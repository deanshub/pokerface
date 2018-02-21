import gql from 'graphql-tag'
import {postFields} from '../fragments/posts'

export const postsQuery = gql`
  query posts($username: String, $eventId: String, $offset: Int, $id: String) {
    posts(username: $username, eventId: $eventId, offset: $offset, id: $id) @connection(key: "posts", filter: ["username","eventId","id"]) {
      ...PostFields
    }
  }
  ${postFields}
`
export const newRelatedPostsQuery = gql`
  query newRelatedPosts{
    newRelatedPosts{
      id
    }
  }
`
