export const playersQuery = `query _($phrase: String)
    {
      players(phrase: $phrase){
        username
        fullName
        avatar
      }
    }
`
