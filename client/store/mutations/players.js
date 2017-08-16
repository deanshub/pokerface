import gql from 'graphql-tag'

export const updatePersonalInfoMutation = gql`mutation updatePersonalInfo($firstname: String, $cover: Object){
  updatePersonalInfo(firstname: $firstname, cover: $cover){
    username
    fullname
    avatar
    coverImage
  }
}`
