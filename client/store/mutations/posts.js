import gql from 'graphql-tag'

export const postCreate = gql`mutation createPost($eventId: String, $post: String!, $photos: [Upload]){
  createPost(eventId:$eventId, content:$post, photos:$photos){
    id
    createdAt
    content
    photos{
      path
      type
    }
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
      owner{
        username
        fullname
        avatar
      }
    }
    owner{
      username
      fullname
      avatar
    }
    event{
      id
      title
      location
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
    photos{
      path
      type
    }
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
      owner{
        username
        fullname
        avatar
      }
    }
    owner{
      username
      fullname
      avatar
    }
  }
}
`
