// @flow

import { observable, computed, action, toJS } from 'mobx'
// import { fromResource } from 'mobx-utils'
import { EditorState, convertToRaw, Modifier, convertFromRaw } from 'draft-js'
import graphqlClient from './graphqlClient'
import {postsQuery} from './queries/posts'
import {postCreate, setPostLike, postDelete} from './mutations/posts'
import {commentCreate, setCommentLike, commentDelete} from './mutations/comments'
import utils from '../containers/SpotPlayer/utils'
import moment from 'moment'

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
  @observable uploadImages
  @observable openCardSelection: boolean


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
    this.uploadImages = []
    this.openCardSelection = false
    this.standalonePost = observable({
      loading: true,
      post: undefined,
    })
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
    graphqlClient.mutate({mutation: postDelete, variables: {postId}})
    .catch(err=>{
      console.error(err)
      this.posts.set(post.id, post)
    })
    this.posts.delete(postId)
  }

  @action
  addPost(photos){
    const editorState = this.newPost.content
    const content = editorState.getCurrentContent()
    if (content.hasText()){
      const rawPostContent = convertToRaw(content)
      this.newPost.content = EditorState.createEmpty()

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

      // TODO: replace this with auth user
      // add post anyway
      this.posts.set(newPostTempId, {
        id: newPostTempId,
        createdAt: Date.now(),
        content: editorState,
        photos: [],
        likes:[],
        comments:[],
        player:{
          username: this.currentUser,
          fullname: 'Dean Shub',
          avatar: 'dean2.jpg',
        },
      })
      this.uploadImages=[]
    }
  }

  @action
  deleteComment(comment: Object): void{
    comment.deletePopupOpen = false
    let post = this.posts.get(comment.post.id)
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
        player:{
          username: this.currentUser,
          fullname: 'Dean Shub',
          avatar: '/images/dean2.jpg',
        },
      })
    }
  }

  @action
  updatePost(post, changes){
    Object.keys(changes).forEach(key=>{
      post[key]=changes[key]
    })
    // if (this.newPost.content === post.content){
    //   this.newPost.content = EditorState.forceSelection(post.content, post.content.getSelection())
    // }else{
    //   this.newPost.content = post.content
    // }
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
  fetchEvents(username: String): void{
    if (this.loading) return undefined
    if (this.currentUser===username && this.noMorePosts) return undefined

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
    graphqlClient.mutate({mutation: setCommentLike, variables: {comment:commentId, like}})
    .then(result=>{
      this.posts.set(result.data.setCommentLike.post.id, result.data.setCommentLike.post)
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
    })
  }

  @action
  previewUploadImages(images){
    this.uploadImages=[]
    for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
      const image = images[imageIndex]
      let reader = new FileReader()
      reader.onload = (e)=>{
        this.uploadImages.push(e.target.result)
      }
      reader.readAsDataURL(image)
    }
  }

  @action
  addCard(card){
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
}
