import gql from 'graphql-tag'

export const updatePersonalInfoMutation = gql`mutation updatePersonalInfo($firstname: String, $lastname: String, $cover: Upload, $avatar: Upload){
  updatePersonalInfo(firstname: $firstname, lastname: $lastname, cover: $cover, avatar: $avatar){
    username
    fullname
    firstname
    lastname
    avatar
    coverImage
  }
}`
