import gql from 'graphql-tag'
import {commentFields} from './comments'

export const postFields = gql`fragment PostFields on Post {
  id
  createdAt
  content
  photos{
    path
    type
  }
  likes{
    username
    fullname
    avatar
  }
  comments{
    ...CommentFields
  }
  owner{
    username
    fullname
    avatar
    rebrandingDetails {
      logo
      title
      primaryColor
      secondaryColor
      tertiaryColor
    }
  }
  event{
    id
    location
  }
}
${commentFields}
`
