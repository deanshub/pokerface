// @flow

import { observable, computed, action, toJS } from 'mobx'
import lokkaClient from './lokkaClient'

const postsQuery = `
    {
      posts {
        id
        createdAt
        content
        photos
        likes
        player{
          username
          fullName
          avatar
        }
      }
    }
`

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
