export const commentCreate = `($post: String!, $comment: String!){
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

export const commentDelete = `($commentId: String!){
  deleteComment(commentId: $commentId){
    id
  }
}`

export const setCommentLike = `($comment: String!, $like: Boolean!){
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
