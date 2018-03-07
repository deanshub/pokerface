import gql from 'graphql-tag'

export const commentFields = gql`fragment CommentFields on Comment {
  id
  createdAt
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
  post{
    id
  }
}
`
