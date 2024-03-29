// @flow

import { observable, computed, action, toJS, extendObservable } from 'mobx'
// import { fromResource } from 'mobx-utils'
import { EditorState, convertToRaw, Modifier, convertFromRaw } from 'draft-js'
import graphqlClient from './graphqlClient'
import {newRelatedPostsQuery, postsQuery} from './queries/posts'
import {postCreate, setPostLike, postDelete, updatePollAnswer} from './mutations/posts'
import {commentCreate, setCommentLike, commentDelete} from './mutations/comments'
import { postChanged } from './subscriptions/posts'
import utils from '../containers/SpotPlayer/utils'
import logger from '../utils/logger'
import moment from 'moment'
import request from 'superagent'

const boomPlayerRegex = /www\.boomplayer\.com\/([^\s]+)/gi

const parseOwner = (owner)=>{
  let rebrandingDetails
  if (owner.rebrandingDetails){
    rebrandingDetails = Object.keys(owner.rebrandingDetails).reduce((res,detailName)=>{
      if(!owner.rebrandingDetails[detailName]){
        res[detailName] = undefined
      }else{
        res[detailName] = owner.rebrandingDetails[detailName]
      }
      return res
    },{})
  }

  return {
    ...owner,
    rebrandingDetails,
  }
}

export class FeedStore {
  @observable posts: Object
  @observable newPost: Object
  @observable standalonePost: Object
  @observable loading: boolean
  @observable commentDrafts: Object
  currentFetchFilter: String
  noMorePosts: boolean
  @observable uploadedMedia: Object
  @observable currentUploadedFiles: Number
  @observable newReceivedPosts: Object
  @observable newPostsCount: Number
  @observable newRelatedPosts: Object
  postsWatchQuery: Object

  constructor(){
    this.posts = observable.map({})
    this.commentDrafts = observable.map({})
    this.loading = false
    this.noMorePosts = false
    this.newPost = observable({
      content: EditorState.createEmpty(),
      spot: undefined,
      deletePopupOpen: false,
      eventId: undefined,
    })
    this.standalonePost = observable({
      loading: true,
      post: undefined,
    })
    this.uploadedMedia=observable.map({})
    this.currentUploadedFiles=0
    this.currentFetchFilter=undefined
    this.newReceivedPosts = observable.map({})
    this.newRelatedPosts = observable.map({})
    this.newPostsCount = 0
    this.postsWatchQuery = undefined
  }

  @action
  fetchPosts(by = {}): void{
    const newByString = JSON.stringify(by)
    const currentByString = JSON.stringify(this.currentFetchFilter)

    if (currentByString===newByString && (this.noMorePosts || this.loading)) return undefined

    this.loading = true

    if (currentByString!==newByString){
      this.posts.clear()
      this.currentFetchFilter = by
      this.noMorePosts = false

      if (this.resultPromise && this.resultPromise.state==='pending'){
        this.resultPromise.cancel()
      }

      // for the first query
      if (!this.postsWatchQuery){
        // subscribe because the apollo problem
        this.postsWatchQuery = graphqlClient.watchQuery({query: postsQuery, fetchResults:false, variables:by})
        this.postsWatchQuery.subscribe({next :()=>{}})
        this.resultPromise = this.postsWatchQuery.result()
      }else{
        this.resultPromise = this.postsWatchQuery.setVariables(this.getRefetchQueryVariables(by))
      }
    }else{
      this.resultPromise = this.postsWatchQuery.fetchMore({
        variables:{
          ...by, offset:this.posts.size,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult
          if (!previousResult.posts) return fetchMoreResult

          return Object.assign({}, previousResult, {
            // Append the new feed results to the old one
            posts: [...previousResult.posts, ...fetchMoreResult.posts],
          })
        },
      })
    }

    this.resultPromise.then((result)=>{
      const newPosts = result.data.posts.filter(post=>!this.posts.has(post.id))
      if (newPosts.length===0){
        this.noMorePosts = true
      }else{
        newPosts.forEach((post)=>{
          const jsonPost = this.jsonParsePost(post)
          const parsedPost = this.parsePost(jsonPost)
          this.posts.set(parsedPost.id, parsedPost)
        })
      }

      setTimeout(()=>{
        this.loading = false
      },1000)
    })
  }

  @action
  startSubscription(username){
    if (!this.subscribed){
      graphqlClient.subscribe({
        query:postChanged,
      }).subscribe({
        next:({data})=>{

          const {postChanged:{post:changedPost, changeType}} = data
          const jsonPost = this.jsonParsePost(changedPost)
          const parsedPost = this.parsePost(jsonPost)

          // is the user profile is the current feed
          const isInUserProfile =  JSON.stringify({username}) === JSON.stringify(this.currentFetchFilter)
          const isUserRelated = this.isUserRelatedToPost(username, jsonPost)

          // Increase the counters
          if (changeType !== 'DELETE'){
            this.newPostsCount++
          }

          if (isUserRelated && !this.newRelatedPosts.has(parsedPost.id)){
            this.newRelatedPosts.set(parsedPost.id, {id: parsedPost.id})
          }

          // For the option of pushing the new posts
          if (!isInUserProfile || (isInUserProfile && isUserRelated)){
            if (changeType !== 'DELETE'){
              this.newReceivedPosts.set(parsedPost.id, parsedPost)
            }
          }

          this.updateGraphqlStore(changedPost, changeType)
          this.updateGraphqlStore(changedPost, changeType, username)
        },
      })

      this.subscribed = true
    }
  }

  @action
  pushNewReceivedPost(isProfile){
    this.newReceivedPosts.forEach((post, id) =>{
      this.posts.set(id, post)
    })

    if (isProfile){
      this.newRelatedPosts.clear()
    }else{
      this.newPostsCount = 0
    }

    this.newReceivedPosts.clear()
  }

  @computed
  get newRelatedPostsCount(){
    return this.newRelatedPosts.size
  }
  jsonParsePost(post){
    return {...post, content:JSON.parse(post.content)}
  }

  parsePost(post){
    const {content} = post
    if (!content.entityMap){
      content.entityMap={}
    }
    const parsedContent = convertFromRaw(content, 'update-contentState')
    const newContent = EditorState.createWithContent(parsedContent)

    const spotPlayerState = utils.generateInitialState(content.spot)

    let parsedPost = Object.assign({}, post, {
      content: newContent,
      replying: false,
      deletePopupOpen: false,
      spot:content.spot,
      poll:content.poll,
      spotPlayerState,
      owner: parseOwner(post.owner),
    })

    parsedPost.comments = parsedPost.comments.map((comment)=>{
      let originalContent = JSON.parse(comment.content)
      if (!originalContent.entityMap){
        originalContent.entityMap={}
      }
      const parsedContent = convertFromRaw(originalContent, 'update-contentState')

      return {
        ...comment,
        deletePopupOpen: false,
        content: EditorState.createWithContent(parsedContent),
      }
    })

    return parsedPost
  }

  @computed
  get parsedPosts(): Object[]{
    return Object.values(this.posts.toJSON()).sort((a,b)=>{
      return moment(new Date(b.createdAt)).diff(moment(new Date(a.createdAt)))
    })
  }

  @action
  deletePost(postId: String): void{
    const post = toJS(this.posts.get(postId))
    logger.logEvent({category:'Post',action:'Delete'})
    graphqlClient.mutate({mutation: postDelete, variables: {postId}})
    .catch(err=>{
      console.error(err)
      this.posts.set(post.id, post)
    })
    this.posts.delete(postId)
  }

  @action
  addPost(user, spot, eventToNextInit){
    const editorState = this.newPost.content
    const content = editorState.getCurrentContent()
    if (content.hasText()){
      let rawPostContent = convertToRaw(content)

      logger.logEvent({category:'Post',action:'Create'})
      if(spot){
        rawPostContent = {...rawPostContent,spot}
      }
      const photos = Object.values(this.uploadedMedia.toJSON()).map(element => element.file)
      const {event} = this.newPost
      const eventId = event?event.id:null
      const newPostTempId = 9999999999+Math.floor(Math.random()*10000)

      const currentFetchFilter = this.currentFetchFilter
      graphqlClient.mutate({
        mutation: postCreate,
        variables: {post:JSON.stringify(rawPostContent), photos , eventId},
        update: (proxy, { data: { createPost } }) => {
          const data = proxy.readQuery({ query: postsQuery, variables:{...currentFetchFilter, offset:0}})
          data.posts.push(createPost)
          proxy.writeQuery({
            query: postsQuery,
            variables:{...currentFetchFilter, offset:0},
            data }
          )
        },
      })

      // if post mutation succeded add id
      .then(result=>{
        this.posts.delete(newPostTempId)
        const jsonPost = this.jsonParsePost(result.data.createPost)
        const newPost = this.parsePost(jsonPost)
        this.posts.set(newPost.id, newPost)
      })
      // if post mutation failed remove it
      .catch(err=>{
        console.error(err);
        this.posts.delete(newPostTempId)
      })

      // add post anyway
      this.posts.set(newPostTempId, {
        id: newPostTempId,
        createdAt: Date.now(),
        content: editorState,
        photos: [],
        likes:[],
        comments:[],
        owner:user,
      })
      this.newPost = {content:EditorState.createEmpty(), event:eventToNextInit}
      this.uploadedMedia=observable.map({})
    }
  }

  @action
  deleteComment(comment: Object): void{
    comment.deletePopupOpen = false
    let post = this.posts.get(comment.post.id)
    logger.logEvent({category:'Comment',action:'Delete'})
    graphqlClient.mutate({mutation: commentDelete, variables: {commentId:comment.id}})
    .catch(err=>{
      console.error(err)
      post.comments.push(comment)
    })
    post.comments.remove(comment)
  }

  @action
  addComment(postId, user){
    const comment = this.commentDrafts.get(postId)
    const commentState = comment.content
    const content = commentState.getCurrentContent()
    if (content.hasText()){
      const rawComment = convertToRaw(content)
      logger.logEvent({category:'Comment',action:'Create'})
      this.updatePost(this.commentDrafts.get(postId), {
        content:EditorState.createEmpty(),
        spot: undefined,
      })

      const newCommentTempId = 9999999999+Math.floor(Math.random()*10000)
      graphqlClient.mutate({mutation: commentCreate, variables: {comment:JSON.stringify(rawComment), post:postId}})
      // if post mutation succeded add id
      .then(result=>{
        const jsonPost = this.jsonParsePost(result.data.addComment)
        const parsedPost = this.parsePost(jsonPost)
        this.posts.set(parsedPost.id, parsedPost)
      })
      // if post mutation failed remove it
      .catch(err=>{
        console.error(err);
        const commentedPost = this.posts.get(postId)
        const tempComment = commentedPost.comments.filter(comment=>comment.id===newCommentTempId)[0]
        if (tempComment){
          commentedPost.comments.remove(tempComment)
        }
      })

      // add comment anyway
      const commentedPost = this.posts.get(postId)
      commentedPost.comments.push({
        id: newCommentTempId,
        postId,
        createdAt: Date.now(),
        content: commentState,
        photos:[],
        likes:[],
        owner:{
          username: user.currentUser,
          fullname: user.fullname,
          avatar: user.avatar,
        },
      })
    }
  }

  @action
  updatePost(post, changes, spotPlayer, user){
    Object.keys(changes).forEach(key=>{
      // if(key==='content'){
      //   post[key]=EditorState.forceSelection(changes[key], changes[key].getSelection())
      // }else{
      post[key]=changes[key]
      // }
    })

    if (this.newPost===post && spotPlayer.newSpot.spot.moves.length===0){
      const results = boomPlayerRegex.exec(post.content.getCurrentContent().getPlainText())
      if (results){
        request.get('/api/boomTranslator').query({id:results[1]}).then((res)=>{
          // post.loadingPost
          if (spotPlayer.newSpot.spot.moves.length===0){
            // console.log(res.body);
            const spot = res.body
            extendObservable(spotPlayer.newSpot, {spotPlayerState:utils.generateInitialState(spot), owner:user})
            spotPlayer.newSpot.spot = spot
          }
        }).catch(err=>{
          console.error(err)
        })
      }
    }
  }

  @action
  createDraft(post){
    this.commentDrafts.set(post.id, observable({
      content:EditorState.createEmpty(),
      spot: undefined,
      deletePopupOpen: false,
    }))
    post.replying = true
  }
  @action
  removeDraft(post){
    this.commentDrafts.delete(post.id)
    post.replying = false
  }

  @action
  setPostLike(postId, like, user){
    logger.logEvent({category:'Post',action:'Like',value:like?1:0})
    graphqlClient.mutate({mutation: setPostLike, variables: {post:postId, like}})
    .then(result=>{
      const jsonPost = this.jsonParsePost(result.data.setPostLike)
      const newPost = this.parsePost(jsonPost)
      this.posts.set(postId, newPost)
    })
    .catch(err=>{
      console.error(err);
      if (like){
        this.posts.get(postId).likes = this.posts.get(postId).likes
        .filter(username=>username!==user)
      }else{
        this.posts.get(postId).likes.push(user)
      }
    })

    if (like){
      this.posts.get(postId).likes.push(user)
    }else{
      this.posts.get(postId).likes = this.posts.get(postId).likes
        .filter(username=>username!==user)
    }
  }

  @action
  setCommentLike(postId, commentId, like, user){
    logger.logEvent({category:'Comment',action:'Like',value:like?1:0})
    graphqlClient.mutate({mutation: setCommentLike, variables: {comment:commentId, like}})
    .then(result=>{
      const jsonPost = this.jsonParsePost(result.data.setCommentLike.post)
      const newPost = this.parsePost(jsonPost)
      this.posts.set(result.data.setCommentLike.post.id, newPost)
    })
    .catch(err=>{
      console.error(err);
      let currentComment = this.posts.get(postId).comments.filter(comment=>comment.id===commentId)[0]
      if (currentComment){
        if (like){
          currentComment.likes = currentComment.likes.filter(username=>username!==user)
        }else{
          currentComment.likes.push(user)
        }
      }
    })

    let currentComment = this.posts.get(postId).comments.filter(comment=>comment.id===commentId)[0]
    if (currentComment){
      if (like){
        currentComment.likes.push(user)
      }else{
        currentComment.likes = currentComment.likes.filter(username=>username!==user)
      }
    }
  }

  fetchStandalonePost(id: String): Function{
    this.standalonePost.post = undefined
    this.standalonePost.loading = true
    return graphqlClient.query({query: postsQuery, variables: {id}}).then((result) => {
      const post = result.data.posts[0]
      if (post){
        this.standalonePost.loading = false
        const jsonPost = this.jsonParsePost(post)
        this.standalonePost.post = this.parsePost(jsonPost)
      }else{
        this.standalonePost.loading = false
        throw new Error('Post doesn\'t exists anymore')
      }
    }).catch(err=>{
      this.standalonePost.loading = false
      console.error(err)
    })
  }

  @action
  addPreviewUploadMedia(files){
    this.currentUploadedFiles += files.length

    for (let imageIndex = 0; imageIndex < files.length; imageIndex++) {
      const file = files[imageIndex]
      const {name:fileName} = file

      let reader = new FileReader()
      reader.onload = (e)=>{
        this.currentUploadedFiles--
        this.uploadedMedia.set(fileName, {file, src:e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  @action
  deletePreviewUploadMedia(imageName){
    this.uploadedMedia.delete(imageName)
  }

  @action
  addCard(card){
    logger.logEvent({category:'Post',action:'Add card',label:'through button'})
    const contentState = this.newPost.content.getCurrentContent()
    const targetRange = this.newPost.content.getSelection()

    let newContentState = Modifier.removeRange(
      contentState,
      targetRange,
      'backward'
    )

    newContentState = newContentState.createEntity('CARD', 'IMMUTABLE', {card})
    newContentState = Modifier.insertText(newContentState, newContentState.getSelectionAfter(), `[${card}]`)
    // const newEditorState = EditorState.push(
    //   this.newPost.content,
    //   newContentState,
    //   'convert-to-immutable-cards',
    //   // this.newPost.content.getLastChangeType(),
    // )

    const cardEndPos = targetRange.getAnchorOffset()
    const blockKey = targetRange.getAnchorKey()
    const blockSize = contentState.getBlockForKey(blockKey).getLength()

    if (cardEndPos === blockSize) {
      newContentState = Modifier.insertText(
        newContentState,
        newContentState.getSelectionAfter(),
        ' ',
     )
    }

    const newEditorState = EditorState.push(
      this.newPost.content,
      newContentState,
      'convert-to-immutable-cards',
      // this.newPost.content.getLastChangeType(),
    )

    // this.newPost.content = EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter())
    this.newPost.content = EditorState.acceptSelection(newEditorState, newContentState.getSelectionAfter())
  }

  @action
  addFriendTag(){
    const contentState = this.newPost.content.getCurrentContent()
    const targetRange = this.newPost.content.getSelection()

    const newContentState = Modifier.replaceText(contentState, targetRange, '@')
    const newEditorState = EditorState.push(
      this.newPost.content,
      newContentState,
      // 'convert-to-immutable-cards',
      this.newPost.content.getLastChangeType(),
    )

    this.newPost.content = newEditorState
  }

  @action
  fetchNewRelatedPosts(){
    return graphqlClient.query({query:newRelatedPostsQuery}).then(({data}) => {
      const {newRelatedPosts} = data
      newRelatedPosts.forEach(post => {
        this.newRelatedPosts.set(post.id, post)
      })
      return newRelatedPostsQuery
    })
  }

  @action
  refresh(){
    this.fetchPosts()
  }

  updatePollAnswer(postId, option){
    graphqlClient.mutate({mutation: updatePollAnswer, variables: {post:postId, option}})
    .then(result=>{
      console.log(result.data.updatePollAnswer)
    })
    .catch(err=>{
      console.error(err)
    })
  }

  getRefetchQueryVariables(variables){
    const {id, username, eventId, offset} = variables
    return {id, username, eventId, offset}
  }

  isUserRelatedToPost(username, post){
    const {owner, content} = post
    const {entityMap, spot} = content

    return owner.username === username ||
      (spot && (spot.players.some(p => p.username===username && !p.guest))) ||
      Object.values(entityMap).some(e => e.type === 'mention' && e.data.mention.username === username)
  }

  updateGraphqlStore(changedPost, changeType, username){
    try {
      // read from graphql store
      const {posts} = graphqlClient.readQuery({query:postsQuery, variables:{username}})

      const index = posts.findIndex(post => post.id === changedPost.id)

      let updatedData

      if (index === -1 && changeType !== 'DELETE'){
        updatedData = [changedPost, ...posts]
      } else if (index > -1){
        updatedData = posts.filter(post => post.id !== index)

        if (changeType !== 'DELETE'){
          updatedData.unshift(changedPost)
        }
      }

      // write to graphql store
      graphqlClient.writeQuery({
        query:postsQuery,
        data:{posts:updatedData},
        variables:{username},
      })
    }
    catch(error){
      // It OK if the query is not exist
      if (!error.message.startsWith("Can't find field")){
        console.error(error);
      }
    }
  }

  @computed
  get previewUploadedMedia(){
    return Object.values(this.uploadedMedia.toJSON()).map(({file, src}) => {
      const {name, type} = file
      return {name, type, src}
    })
  }

  @computed
  get uploadingMedia(){
    return (this.currentUploadedFiles > 0)
  }
}
