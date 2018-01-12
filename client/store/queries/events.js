import gql from 'graphql-tag'

export const eventsQuery = gql`
    query _{
      games{
          id
          creator{
            username
            fullname
            avatar
          }
          title
          description
          type
          subtype
          location
          from
          to
          invited{
            username
            fullname
            avatar
            guest
          }
          accepted{
            username
            fullname
            avatar
          }
          declined{
            username
            fullname
            avatar
          }
          unresponsive{
            username
            fullname
            avatar
            guest
          }
          image
          updatedAt
          createdAt
      }
    }
`

export const eventQuery = gql`
  query _($eventId: String!) {
    game(gameId: $eventId) {
      id
      creator{
        username
        fullname
        avatar
      }
      title
      description
      type
      subtype
      location
      from
      to
      invited{
        username
        fullname
        avatar
        guest
      }
      accepted{
        username
        fullname
        avatar
      }
      declined{
        username
        fullname
        avatar
      }
      unresponsive{
        username
        fullname
        avatar
        guest
      }
      image
      updatedAt
      createdAt
    }
  }
`

export const searchEventsQuery = gql`
  query _($title: String!){
    search(title: $title){
      id
      title
      location
    }
  }

`
