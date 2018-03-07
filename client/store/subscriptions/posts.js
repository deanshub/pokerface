import gql from 'graphql-tag'
import {postFields} from '../fragments/posts'

export const postChanged = gql`
  subscription _{
    postChanged{
      changeType
      post{
        ...PostFields
      }
    }
  }
  ${postFields}
`
