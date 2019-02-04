import gql from 'graphql-tag'

export const usersQuery = gql`
  query usersQuery($phrase: String, $username: String) {
    users(phrase: $phrase, username: $username){
      username
      fullname
      avatar
      coverImage
      organization
    }
  }
`
export const optionalUsersSwitchQuery = gql`
  query optionalUsersSwitch{
    optionalUsersSwitch {
      username
      fullname
      avatar
      coverImage
    }
  }
`

export const optionalUsersLoginQuery = gql`
  query optionalUsersLogin{
    optionalUsersLogin {
      username
      fullname
      avatar
      coverImage
    }
  }
`
