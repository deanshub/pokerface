export const commentCreate = `($username: String!, $post: String!, $comment: String!){
  addComment(username:$username, post: $post, content:$comment){
    id
    post{
      id
      createdAt
      content
      photos
      likes
      comments{
        id
        likes
        content
        player{
          username
          fullName
          avatar
        }
      }
      player{
        username
        fullName
        avatar
      }
    }
  }
}`
