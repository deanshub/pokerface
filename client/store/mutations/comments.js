import gql from 'graphql-tag'
export const commentCreate = gql`mutation addComment($post: String!, $comment: String!){
  addComment(post: $post, content:$comment){
    id
    createdAt
    content
    photos
    likes{
      username
      fullname
      avatar
    }
    comments{
      id
      post{
        id
      }
      likes{
        username
        fullname
        avatar
      }
      content
      player{
        username
        fullname
        avatar
      }
    }
    player{
      username
      fullname
      avatar
    }
  }
}`

export const commentDelete = gql`mutation deleteComment($commentId: String!){
  deleteComment(commentId: $commentId){
    id
  }
}`

export const setCommentLike = gql`mutation setCommentLike($comment: String!, $like: Boolean!){
  setCommentLike(content:$like, comment:$comment){
    id
    post{
      id
      createdAt
      content
      photos
      likes{
        username
        fullname
        avatar
      }
      comments{
        id
        post{
          id
        }
        likes{
          username
          fullname
          avatar
        }
        content
        player{
          username
          fullname
          avatar
        }
      }
      player{
        username
        fullname
        avatar
      }
    }
  }
}`
