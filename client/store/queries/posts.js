export const postsQuery = `
    {
      posts {
        id
        createdAt
        content
        photos
        likes
        player{
          username
          fullName
          avatar
        }
      }
    }
`
