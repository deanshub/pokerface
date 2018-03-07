import gql from 'graphql-tag'
import {postFields} from '../fragments/posts'

export const postCreate = gql`mutation createPost(
  $eventId: String,
  $post: String!,
  $photos: [Upload],
  $clientSocketId: String!,
){
  createPost(
    eventId:$eventId,
    content:$post,
    photos:$photos,
    clientSocketId:$clientSocketId
  ){
    ...PostFields
  }
}
${postFields}
`

export const postDelete = gql`mutation deletePost($postId: String!, $clientSocketId: String!){
  deletePost(postId: $postId, clientSocketId:$clientSocketId){
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
