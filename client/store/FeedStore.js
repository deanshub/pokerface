// @flow

import { observable, computed, action, toJS } from 'mobx'
// import { fromResource } from 'mobx-utils'
import { EditorState, convertToRaw } from 'draft-js'
import graphqlClient from './graphqlClient'
import {postsQuery} from './queries/posts'
import {postCreate, setPostLike, postDelete} from './mutations/posts'
import {commentCreate, setCommentLike, commentDelete} from './mutations/comments'

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
  @observable editorState: Object
  @observable loading: boolean
  @observable commentDrafts: Object
  currentUser: Object
  noMorePosts: boolean
  @observable uploadImages


  constructor(){
    this.posts = observable.map({})
    this.commentDrafts = observable.map({})
    this.loading = false
    this.noMorePosts = false
    this.editorState = EditorState.createEmpty()
    this.uploadImages = []
  }

  @computed
  get events(): Object[]{
    return toJS(this.posts.values())
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
    const content = this.editorState.getCurrentContent()
    if (content.hasText()){
      const post = convertToRaw(content)
      this.editorState = EditorState.createEmpty()

      const newPostTempId = 9999999999+Math.floor(Math.random()*10000)
      graphqlClient.mutate({mutation: postCreate, variables: {post:JSON.stringify(post), photos}})
      // if post mutation succeded add id
      .then(result=>{
        this.posts.delete(newPostTempId)
        this.posts.set(result.data.createPost.id, result.data.createPost)
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
        content: JSON.stringify(post),
        photos: [],
        likes:[],
        comments:[],
        player:{
          username: this.currentUser,
          fullname: 'Dean Shub',
          avatar: 'dean2.jpg',
        },
      })
    }
  }

  @action
  deleteComment(comment: Object): void{
    // console.log(comment);
    const commentCopy = toJS(comment)
    let post = this.posts.get(comment.post.id)
    graphqlClient.mutate({mutation: commentDelete, variables: {commentId:comment.id}})
    .catch(err=>{
      console.error(err)
      post.comments.push(commentCopy)
    })
    post.comments.remove(comment)
  }

  @action
  addComment(postId){
    const content = this.commentDrafts.get(postId).getCurrentContent()
    if (content.hasText()){
      const comment = convertToRaw(content)
      this.updateComment(postId, EditorState.createEmpty())

      const newCommentTempId = 9999999999+Math.floor(Math.random()*10000)
      graphqlClient.mutate({mutation: commentCreate, variables: {comment:JSON.stringify(comment), post:postId}})
      // if post mutation succeded add id
      .then(result=>{
        this.posts.set(result.data.addComment.id, result.data.addComment)
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
        content: JSON.stringify(comment),
        photos:[],
        likes:[],
        player:{
          username: this.currentUser,
          fullname: 'Dean Shub',
          avatar: 'dean2.jpg',
        },
      })
    }
  }

  @action
  updatePost(editorState){
    if (this.editorState === editorState){
      this.editorState = EditorState.forceSelection(editorState, editorState.getSelection())
    }else{
      this.editorState = editorState
    }
  }

  @computed
  get rawEditorState(): Object{
    return toJS(this.editorState)
  }

  @action
  updateComment(postId, editorState=EditorState.createEmpty()){
    if (this.commentDrafts.get(postId) === editorState){
      this.commentDrafts.set(postId, EditorState.forceSelection(editorState, editorState.getSelection()))
    }else{
      this.commentDrafts.set(postId, editorState)
    }
  }
  @computed
  get rawComments(): Object{
    return toJS(this.commentDrafts)
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
            this.posts.set(post.id, post)
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
      this.posts.set(postId, result.data.setPostLike)
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

  getStandalonePost(id: String): Function{
    return graphqlClient.query({query: postsQuery, variables: {id}}).then((result) => {
      const post = result.data.posts[0]
      if (post){
        return post
      }else{
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
}
