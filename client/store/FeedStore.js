// @flow

import { observable, computed, action, toJS } from 'mobx'
import lokkaClient from './lokkaClient'

import {postsQuery} from './queries/posts'

export class FeedStore {
  @observable posts: Object[]

  constructor(){
    this.posts = []
  }

  @computed
  get events(): Object[]{
    return toJS(this.posts)
  }

  @action
  fetchEvents(): void{
    lokkaClient.watchQuery(postsQuery, {}, (err, result) => {
      if (err){
        console.error(err.message)
        return
      }
      this.posts = result.posts
    })
  }
}
