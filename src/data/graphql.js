import GraphHTTP from 'express-graphql'
import Schema from '../data/schema'

// TODO: make pretty and graphiql true only in dev
export default GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true,
})
