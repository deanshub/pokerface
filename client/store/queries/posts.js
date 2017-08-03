export const postsQuery = `query _($username: String, $offset: Int)
    {
      posts(username: $username, offset: $offset) {
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
          post{
            id
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
