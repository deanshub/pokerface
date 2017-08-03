export const playersQuery = `query _($phrase: String, $username: String)
    {
      players(phrase: $phrase, username: $username){
        username
        fullname
        avatar
        coverImage
      }
    }
`
