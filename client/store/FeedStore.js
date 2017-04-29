// @flow

import { observable, computed, action, toJS } from 'mobx'
import { EditorState } from 'draft-js'
import lokkaClient from './lokkaClient'
import {postsQuery} from './queries/posts'
import {postCreate} from './mutations/posts'

export class FeedStore {
  @observable posts: Object
  @observable editorState: Object
  @observable loading: boolean
  currentUser: Object
  noMorePosts: boolean


  constructor(){
    this.posts = observable.map({})
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
      const postText = content.getPlainText()
      this.editorState = EditorState.createEmpty()

      const newPostTempId = 9999999999+Math.floor(Math.random()*10000)
      lokkaClient.mutate(postCreate, {username: this.currentUser, post:postText})
      // if post mutation succeded add id
      .then(newPost=>{
        console.log('success',newPost);
        this.posts.set(newPostTempId, newPost.createPost)
      })
      // if post mutation failed remove it
      .catch(err=>{
        console.error(err);
        this.posts.delete(newPostTempId)
      })

      this.posts.set(newPostTempId, {
        id: newPostTempId,
        createdAt: Date.now(),
        content: postText,
        photos:[],
        likes:[],
        comments:[],
        player:{
          username: this.currentUser,
          fullName: 'Dean Shub',
          avatar: 'dean2.jpg',
        },
      })
      // add post anyway
    }
  }

  @action
  updatePost(editorState){
    this.editorState = editorState
  }

  @computed
  get rawEditorState(): Object{
    return toJS(this.editorState)
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
}
