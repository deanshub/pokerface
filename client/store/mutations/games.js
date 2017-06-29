export const gameAttendanceUpdate = `($gameId: String!, $attendance: Boolean!){
  gameAttendanceUpdate(gameId: $gameId, attendance: $attendance){
    id
    title
    description
    type
    subtype
    location
    from
    to
    invited
    accepted
    declined
    unresponsive
    updatedAt
    createdAt
  }
}`
