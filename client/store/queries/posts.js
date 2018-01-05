import gql from 'graphql-tag'

export const postsQuery = gql`
  query _($username: String, $offset: Int, $id: String) {
    posts(username: $username, offset: $offset, id: $id) {
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
      owner{
        username
        fullname
        avatar
      }
    }
  }
`
