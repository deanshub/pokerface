// @flow

import { observable, computed, action, toJS } from 'mobx'
import lokkaClient from './lokkaClient'

import {postsQuery} from './queries/posts'

export class FeedStore {
  @observable posts: Object
  @observable loading: boolean
  currentUser: Object
  noMorePosts: boolean

  constructor(){
    this.posts = observable.map({})
    this.loading = false
    this.noMorePosts = false
  }

  @computed
  get events(): Object[]{
    return toJS(this.posts.values())
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
