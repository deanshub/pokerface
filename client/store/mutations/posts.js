export const postCreate = `($username: String!, $post: String!){
  createPost(content:$post, username:$username){
    id
    createdAt
    content
    photos
    likes
    comments{
      id
      post{
        id
      }
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

export const setPostLike = `($username: String!, $post: String!, $like: Boolean!){
  setPostLike(content:$like, username:$username, post:$post){
    id
    createdAt
    content
    photos
    likes
    comments{
      id
      post{
        id
      }
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
