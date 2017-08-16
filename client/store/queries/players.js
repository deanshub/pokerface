import gql from 'graphql-tag'

export const playersQuery = gql`
  query _($phrase: String, $username: String) {
    players(phrase: $phrase, username: $username){
      username
      fullname
      avatar
      coverImage
    }
  }
`
