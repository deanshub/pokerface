// @flow

import { observable, computed, action, toJS } from 'mobx'
import {Lokka} from 'lokka'
import {Transport} from 'lokka-transport-http'

export class FeedStore {
  @observable posts: Object[]

  constructor(){
    this.posts = []
    this.client = new Lokka({
      transport: new Transport('http://localhost:9031/graphql'),
    })
  }

  @computed
  get events(): Object[]{
    return toJS(this.posts)
  }

  @action
  fetchEvents(): void{
    this.client.query(`
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
    `).then(result => {
      this.posts = result.posts
    })
  }
}
