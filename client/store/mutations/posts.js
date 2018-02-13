import gql from 'graphql-tag'
import {postFields} from '../fragments/posts'

export const postCreate = gql`mutation createPost($eventId: String, $post: String!, $photos: [Upload]){
  createPost(eventId:$eventId, content:$post, photos:$photos){
    ...PostFields
  }
}
${postFields}
`

export const postDelete = gql`mutation deletePost($postId: String!){
  deletePost(postId: $postId){
    id
  }
}
`

export const setPostLike = gql`mutation setPostLike($post: String!, $like: Boolean!){
  setPostLike(content:$like, post:$post){
    ...PostFields
  }
}
${postFields}
`

export const updatePollAnswer = gql`mutation updatePollAnswer($post: String!, $option: Int!){
  updatePollAnswer(post: $post, option: $option){
    ...PostFields
  }
}
${postFields}
`
