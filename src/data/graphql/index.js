import GraphHTTP from 'express-graphql'
import { GraphQLSchema } from 'graphql'
import Query from './query'
import Mutation from './mutation'

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

// TODO: make pretty and graphiql true only in dev
export default GraphHTTP({
  schema: Schema,
  pretty: process.env.NODE_ENV==='development'?true:false,
  graphiql: process.env.NODE_ENV==='development'?true:false,
  printErrors: true,
})
