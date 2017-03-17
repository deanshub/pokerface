export const postsQuery = `
    {
      posts {
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
