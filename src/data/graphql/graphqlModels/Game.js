import {
  GraphQLObjectType, GraphQLInt, GraphQLString,
  GraphQLList,
} from 'graphql'
import DB from '../../db'
import Player from './Player'

const Game = new GraphQLObjectType({
  name: 'Game',
  description: 'Represents a games scheduled',
  fields: ()=>{
    return {
      id: {
        type: GraphQLString,
        resolve(game){
          return game._id
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
          return game.startDate
        },
      },
      to: {
        type: GraphQLString,
        resolve(game){
          return game.endDate
        },
      },
      invited: {
        type: new GraphQLList(Player),
        resolve(game){
          return DB.models.Player.find({
            _id: {
              $in: game.invited,
            },
          })
        },
      },
      accepted: {
        type: new GraphQLList(Player),
        resolve(game){
          return DB.models.Player.find({
            _id: {
              $in: game.accepted,
            },
          })
        },
      },
      declined: {
        type: new GraphQLList(Player),
        resolve(game){
          return DB.models.Player.find({
            _id: {
              $in: game.declined,
            },
          })
        },
      },
      unresponsive: {
        type: new GraphQLList(Player),
        resolve(game){
          return DB.models.Player.find({
            _id: {
              $in: game.unresponsive,
            },
          })
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
          return DB.models.Player.findById(game.player)
        },
      },
      // player: {
      //   type: Player,
      //   resolve(game){
      //     return game.player
      //   },
      // },
    }
  },
})

export default Game
