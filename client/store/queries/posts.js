export const postsQuery = `query _($username: String, $offset: Int)
    {
      posts(username: $username, offset: $offset) {
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
`
