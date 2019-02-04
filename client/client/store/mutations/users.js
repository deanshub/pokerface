import gql from 'graphql-tag'

export const updatePersonalInfoMutation = gql`mutation updatePersonalInfo($firstname: String, $lastname: String, $cover: Upload, $avatar: Upload){
  updatePersonalInfo(firstname: $firstname, lastname: $lastname, cover: $cover, avatar: $avatar){
    username
    fullname
    avatar
    coverImage
  }
}`

export const updateLastProfileVisitMutation = gql`mutation updateLastProfileVisit($date: String!){
  updateLastProfileVisit(date: $date){
    username
  }
}`