import gql from 'graphql-tag'

export const postCreate = gql`mutation createPost($post: String!){
  createPost(content:$post){
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
`

export const postDelete = gql`mutation deletePost($postId: String!){
  deletePost(postId: $postId){
    id
  }
}
`


export const setPostLike = gql`mutation setPostLike($post: String!, $like: Boolean!){
  setPostLike(content:$like, post:$post){
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
`
