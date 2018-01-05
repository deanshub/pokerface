// @flow

import { observable, computed, action, toJS, extendObservable } from 'mobx'
// import { fromResource } from 'mobx-utils'
import { EditorState, convertToRaw, Modifier, convertFromRaw } from 'draft-js'
import graphqlClient from './graphqlClient'
import {postsQuery} from './queries/posts'
import {postCreate, setPostLike, postDelete} from './mutations/posts'
import {commentCreate, setCommentLike, commentDelete} from './mutations/comments'
import utils from '../containers/SpotPlayer/utils'
import logger from '../utils/logger'
import moment from 'moment'
import request from 'superagent'

const boomPlayerRegex = /www\.boomplayer\.com\/([^\s]+)/gi

// const queryToObservable = (q, callbacks = {}) => {
//   let subscription
//
//   return fromResource(
//     sink =>
//       (subscription = q.subscribe({
//         next: ({ data }) => {
//           sink(observable(data))
//           if (callbacks.onUpdate) callbacks.onUpdate(data)
//         },
//         error: error => {
//           if (callbacks.onError) callbacks.onError(error)
//         },
//       })),
//     () => subscription.unsubscribe()
//   )
// }

export class FeedStore {
  @observable posts: Object
  @observable newPost: Object
  @observable standalonePost: Object
  @observable loading: boolean
  @observable commentDrafts: Object
  currentUser: Object
  noMorePosts: boolean
  @observable uploadedMedia: Object
  @observable openCardSelection: boolean
  @observable currentUploadedFiles: Number

  constructor(){
    this.posts = observable.map({})
    this.commentDrafts = observable.map({})
    this.loading = false
    this.noMorePosts = false
    this.newPost = observable({
      content: EditorState.createEmpty(),
      spot: undefined,
      deletePopupOpen: false,
    })
    this.openCardSelection = false
    this.standalonePost = observable({
      loading: true,
      post: undefined,
    })
    this.uploadedMedia=observable.map({})
    this.currentUploadedFiles=0
  }

  parsePost(post){
    let content = JSON.parse(post.content)
    if (!content.entityMap){
      content.entityMap={}
    }
    const parsedContent = convertFromRaw(content, 'update-contentState')
    const newContent = EditorState.createWithContent(parsedContent)

    const spotPlayerState = utils.generateInitialState(content.spot)

    let parsedPost = Object.assign({}, post, {content: newContent, replying: false, deletePopupOpen: false, spot:content.spot, spotPlayerState})

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
    return this.posts.values().sort((a,b)=>{
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
  addPost(user, spot){
    const editorState = this.newPost.content
    const content = editorState.getCurrentContent()
    if (content.hasText()){
      let rawPostContent = convertToRaw(content)
      this.newPost.content = EditorState.createEmpty()

      logger.logEvent({category:'Post',action:'Create'})
      if(spot){
        rawPostContent = {...rawPostContent,spot}
      }
      const photos = this.uploadedMedia.values().map(element => element.file)
      const newPostTempId = 9999999999+Math.floor(Math.random()*10000)
      graphqlClient.mutate({mutation: postCreate, variables: {post:JSON.stringify(rawPostContent), photos}})
      // if post mutation succeded add id
      .then(result=>{
        this.posts.delete(newPostTempId)
        const newPost = this.parsePost(result.data.createPost)
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
  addComment(postId){
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
        const parsedPost = this.parsePost(result.data.addComment)
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
          username: this.currentUser,
          fullname: 'Dean Shub',
          avatar: '/images/dean2.jpg',
        },
      })
    }
  }

  @action
  updatePost(post, changes, spotPlayer){
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
            extendObservable(spotPlayer.newSpot, {spotPlayerState:utils.generateInitialState(spot)})
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
  fetchPosts(username: String): void{

    if (this.currentUser===username && (this.noMorePosts || this.loading)) return undefined

    this.loading = true
    if (this.currentUser!==username){
      this.posts = observable.map({})
      this.currentUser=username
      this.noMorePosts = false
    }

    // const offset = this.offsets[username]||0
    graphqlClient.watchQuery({
      query: postsQuery,
      variables:{
        username, offset:this.posts.size,
      },
      // pollInterval: 10000, //ms
    }).subscribe({
      next :(result)=>{
        const newPosts = result.data.posts.filter(post=>!this.posts.has(post.id))
        if (newPosts.length===0){
          this.noMorePosts = true
        }else{
          newPosts.forEach((post)=>{
            const parsedPost = this.parsePost(post)
            this.posts.set(parsedPost.id, parsedPost)
          })
        }
        setTimeout(()=>{
          this.loading = false
        },1000)
      },
      error: console.error,
      complete:()=>{
        this.loading = false
      },
    })
  }

  @action
  setPostLike(postId, like, user){
    logger.logEvent({category:'Post',action:'Like',value:like?1:0})
    graphqlClient.mutate({mutation: setPostLike, variables: {post:postId, like}})
    .then(result=>{
      const newPost = this.parsePost(result.data.setPostLike)
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
      const newPost = this.parsePost(result.data.setCommentLike.post)
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
        this.standalonePost.post = this.parsePost(post)
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
      //this.uploadedMedia.set(fileName, {file})
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

    const newContentState = Modifier.replaceText(contentState, targetRange, `[${card}] `)
    const newEditorState = EditorState.push(
      this.newPost.content,
      newContentState,
      'convert-to-immutable-cards',
      // this.newPost.content.getLastChangeType(),
    )

    this.newPost.content = EditorState.moveFocusToEnd(newEditorState)
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
  refresh(){
    this.fetchPosts()
  }

  @computed
  get previewUploadedMedia(){
    return this.uploadedMedia.values().map(({file, src}) => {
      const {name, type} = file
      return {name, type, src}
    })
  }

  @computed
  get uploadingMedia(){
    return (this.currentUploadedFiles > 0)
  }
}
