import gql from 'graphql-tag'
import {postFields} from '../fragments/posts'
//import {commentFields} from '../fragments/comments'

export const commentCreate = gql`mutation addComment($post: String!, $comment: String!){
  addComment(post: $post, content:$comment){
    ...PostFields
  }
}
${postFields}
`

export const commentDelete = gql`mutation deleteComment($commentId: String!){
  deleteComment(commentId: $commentId){
    id
  }
}`

export const setCommentLike = gql`mutation setCommentLike($comment: String!, $like: Boolean!){
  setCommentLike(content:$like, comment:$comment){
    id
    post{
      ...PostFields
    }
  }
}
${postFields}
`
