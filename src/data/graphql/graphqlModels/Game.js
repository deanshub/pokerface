import DB from '../../db'
import mailer from '../../../utils/mailer'
import {schema as User} from './User'

export const schema =  [`
  type Game {
    id: String!
    title: String
    description: String
    type: String
    subtype: String
    location: String
    from: String
    to: String
    invited: [Player]
    accepted: [Player]
    declined: [Player]
    unresponsive: [Player]
    updatedAt: String
    createdAt: String
    creator: User
  }

  type Query {
    games: [Game]
  }

  type Mutation{
    gameAttendanceUpdate(
      gameId: String!,
      attendance: Boolean
    ): Game
    addGame(
      title: String!,
      description: String,
      type: String,
      subtype: String,
      location: String,
      from: String!,
      to: String,
      invited: String
    ): Game
    deleteGame(
      gameId: String!
    ): Game
  }
`, ...User]

export const resolvers = {
  Game:{
    id: (game)=>game._id,
    title: (game)=>game.title,
    description: (game)=>game.description,
    type: (game)=>game.type,
    subtype: (game)=>game.subtype,
    location: (game)=>game.location,
    from: (game)=>game.startDate,
    to: (game)=>game.endDate,
    invited: (game)=>{
      const invitedUsers = game.invited.filter(player=>!player.guest).map(player=>player.username)
      const invitedGuests = game.invited.filter(player=>player.guest)
      return DB.models.User.find({
        _id: {
          $in: invitedUsers,
        },
      }).then((players)=>{
        return players.concat(invitedGuests)
      })
    },
    accepted: (game)=>DB.models.User.find({
      _id: {
        $in: game.accepted,
      },
    }),
    declined: (game)=>DB.models.User.find({
      _id: {
        $in: game.declined,
      },
    }),
    unresponsive: (game)=>{
      const invitedUsers = game.unresponsive.filter(player=>!player.guest).map(player=>player.username)
      const invitedGuests = game.unresponsive.filter(player=>player.guest)

      return DB.models.User.find({
        _id: {
          $in: invitedUsers,
        },
      }).then((players)=>{
        return players.concat(invitedGuests)
      })
    },
    updatedAt: (game)=>game.updated,
    createdAt: (game)=>game.created,
    creator: (game)=>DB.models.User.findById(game.owner),
  },

  Query: {
    games: (_, args, context)=>{
      return DB.models.Game.find({
        startDate: {
          $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      })
      .or([{
        invited: context.user._id,
      },{
        owner: context.user._id,
      }])
      .limit(20)
      .sort('-startDate')
    },
  },

  Mutation: {
    gameAttendanceUpdate: (_, {gameId, attendance}, context)=>{
      return DB.models.Game.findById(gameId)
      .then(game=>{
        const username = context.user._id
        let invited = game.invited.filter(player=>!player.guest).map(player=>player.username)

        if (invited.includes(username)){
          let accepted = game.get('accepted')
          let declined = game.get('declined')

          const acceptedIndex = accepted.indexOf(username)
          const declinedIndex = declined.indexOf(username)

          if (attendance===null){
            if (acceptedIndex!==-1) {
              accepted.splice(acceptedIndex, 1)
            }
            if (declinedIndex!==-1){
              declined.splice(declinedIndex, 1)
            }
          }else if (attendance===true) {
            if (acceptedIndex===-1) {
              accepted.push(username)
            }
            if (declinedIndex>-1){
              declined.splice(declinedIndex, 1)
            }
          }else if (attendance===false) {
            if (acceptedIndex>-1){
              accepted.splice(acceptedIndex, 1)
            }
            if (declinedIndex===-1){
              declined.push(username)
            }
          }

          game.set('accepted',accepted)
          game.set('declined',declined)
          return game.save()
        }

        return game
      })
    },
    addGame: (_, {title, description, type, subtype, location, from, to, invited}, context)=>{
      return new DB.models.Game({
        owner: context.user._id,
        title,
        description,
        type,
        subtype,
        location,
        startDate: new Date(from),
        endDate: to!==undefined?new Date(to):undefined,
        invited: JSON.parse(invited),
      }).save()
      .then(game=>{
        mailer.sendGameInvite(game, DB)
        return game
      })
    },
    deleteGame: (_, args, context)=>{
      return DB.models.Game.findById(args.gameId).then(game=>{
        if (game.owner===context.user._id){
          return mailer.sendGameCancelled(game, DB).catch((err)=>{
            console.error(err)
            return game.remove()
          }).then(()=>{
            return game.remove()
          })
        }else{
          throw new Error('Can\'t delete game of another user')
        }
      })
    },
  },
}
