import {
  GraphQLObjectType, GraphQLInt, GraphQLString,
  GraphQLList,
} from 'graphql'

import Player from './Player'

const Game = new GraphQLObjectType({
  name: 'Game',
  description: 'Represents a games scheduled',
  fields: ()=>{
    return {
      id: {
        type: GraphQLInt,
        resolve(game){
          return game.id
        },
      },
      title: {
        type: GraphQLString,
        resolve(game){
          return game.title
        },
      },
      description: {
        type: GraphQLString,
        resolve(game){
          return game.description
        },
      },
      type: {
        type: GraphQLString,
        resolve(game){
          return game.type
        },
      },
      subtype: {
        type: GraphQLString,
        resolve(game){
          return game.subtype
        },
      },
      location: {
        type: GraphQLString,
        resolve(game){
          return game.location
        },
      },
      from: {
        type: GraphQLString,
        resolve(game){
          return game.from
        },
      },
      to: {
        type: GraphQLString,
        resolve(game){
          return game.to
        },
      },
      invited: {
        type: new GraphQLList(GraphQLString),
        resolve(game){
          return game.invited
        },
      },
      accepted: {
        type: new GraphQLList(GraphQLString),
        resolve(game){
          return game.accepted
        },
      },
      declined: {
        type: new GraphQLList(GraphQLString),
        resolve(game){
          return game.declined
        },
      },
      unresponsive: {
        type: new GraphQLList(GraphQLString),
        resolve(game){
          return game.unresponsive
        },
      },
      updatedAt: {
        type: GraphQLString,
        resolve(game){
          return game.updated
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve(game){
          return game.created
        },
      },
      creator: {
        type: Player,
        resolve(game){
          return game.getPlayer()
        },
      },
    }
  },
})

export default Game
