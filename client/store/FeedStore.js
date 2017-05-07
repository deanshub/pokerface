// @flow

import { observable, computed, action, toJS } from 'mobx'
import { EditorState, convertToRaw } from 'draft-js'
import lokkaClient from './lokkaClient'
import {postsQuery} from './queries/posts'
import {postCreate, setPostLike} from './mutations/posts'
import {commentCreate, setCommentLike} from './mutations/comments'

export class FeedStore {
  @observable posts: Object
  @observable editorState: Object
  @observable loading: boolean
  @observable commentDrafts: Object
  currentUser: Object
  noMorePosts: boolean


  constructor(){
    this.posts = observable.map({})
    this.commentDrafts = observable.map({})
    this.loading = false
    this.noMorePosts = false
    this.editorState = EditorState.createEmpty()
  }

  @computed
  get events(): Object[]{
    return toJS(this.posts.values())
  }

  @action
  addPost(){
    const content = this.editorState.getCurrentContent()
    if (content.hasText()){
      const post = convertToRaw(content)
      this.editorState = EditorState.createEmpty()

      const newPostTempId = 9999999999+Math.floor(Math.random()*10000)
      lokkaClient.mutate(postCreate, {username: this.currentUser, post:JSON.stringify(post)})
      // if post mutation succeded add id
      .then(newPost=>{
        this.posts.delete(newPostTempId)
        this.posts.set(newPost.createPost.id, newPost.createPost)
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
        photos:[],
        likes:[],
        comments:[],
        player:{
          username: this.currentUser,
          fullName: 'Dean Shub',
          avatar: 'dean2.jpg',
        },
      })
    }
  }

  @action
  addComment(postId){
    const content = this.commentDrafts.get(postId).getCurrentContent()
    if (content.hasText()){
      const comment = convertToRaw(content)
      this.updateComment(postId, EditorState.createEmpty())

      const newCommentTempId = 9999999999+Math.floor(Math.random()*10000)
      lokkaClient.mutate(commentCreate, {username: this.currentUser, comment:JSON.stringify(comment), post:postId})
      // if post mutation succeded add id
      .then(newComment=>{
        this.posts.set(newComment.addComment.post.id, newComment.addComment.post)
      })
      // if post mutation failed remove it
      .catch(err=>{
        console.error(err);
        const commentedPost = this.posts.get(postId)
        const tempComment = commentedPost.comments.filter(comment=>comment.id===newCommentTempId)[0]
        const tempCommentIndex = commentedPost.comments.indexOf(tempComment)
        if (tempCommentIndex!==-1){
          commentedPost.comments = commentedPost.comments.splice(tempCommentIndex-1, 1)
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
          fullName: 'Dean Shub',
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
    lokkaClient.watchQuery(postsQuery, {username, offset:this.posts.size}, (err, result) => {
      if (err){
        console.error(err.message)
        return
      }

      const newPosts = result.posts.filter(post=>!this.posts.has(post.id))
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
    })
  }

  @action
  setPostLike(postId, like, user){
    lokkaClient.mutate(setPostLike, {username: user, post:postId, like})
    .then(newPost=>{
      this.posts.set(postId, newPost.setPostLike)
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
    lokkaClient.mutate(setCommentLike, {username: user, comment:commentId, like})
    .then(newPost=>{
      this.posts.set(newPost.setCommentLike.post.id, newPost.setCommentLike.post)
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
}
