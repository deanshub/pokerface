import gql from 'graphql-tag'

export const usersQuery = gql`
  query _($phrase: String, $username: String) {
    users(phrase: $phrase, username: $username){
      username
      fullname
      avatar
      coverImage
    }
  }
`
export const optionalUsersSwitchQuery = gql`
  query {
    optionalUsersSwitch {
      username
      fullname
      avatar
      coverImage
    }
  }
`

export const optionalUsersLoginQuery = gql`
  query {
    optionalUsersLogin {
      username
      fullname
      avatar
      coverImage
    }
  }
`
