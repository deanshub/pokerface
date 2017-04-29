export const postCreate = `($username: String!, $post: String!){
  createPost(content:$post, username:$username){
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
}`
