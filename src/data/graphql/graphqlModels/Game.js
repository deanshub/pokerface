import DB from '../../db'
import mailer from '../../../utils/mailer'
import {CREATE_PUBLIC_EVENT, PUBLIC} from '../../../utils/permissions'
import {schema as User} from './User'
import {schema as Post} from './Post'
import { prepareEventCoverImage } from '../../helping/user'

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
    image: String
    posts: [Post]
  }

  type Query {
    game(
      gameId: String!
    ): Game
    games: [Game]
    search(
      title: String!
    ): [Game]
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
      invited: String,
      isPublic: Boolean
    ): Game
    deleteGame(
      gameId: String!
    ): Game
  }
`, ...User, ...Post]

const authCondition = (context) => {
  return {$or: [{
    permissions: PUBLIC,
  },{
    owner: context.user._id,
  },{
    invited: context.user._id,
  }]}
}


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
    image: prepareEventCoverImage,
    posts: (game)=> DB.models.Post.find({game: game.id}),
  },

  Query: {
    game: (_, {gameId}, context)=>{
      return DB.models.Game.findOne({
        _id:gameId,
        ...authCondition(context),
      })
    },
    games: (_, args, context)=>{
      const STARTS_IN_X_DAYS = 30
      const ENDS_UP_X_DAYS = 2
      const dayInterval = 24 * 60 * 60 * 1000
      const now = Date.now()

      const dates = {$or:[{
        // staartDate < now < endDate - currently playing
        startDate:{$lt: new Date(now)}, endDate: {$gt: new Date(now)},
      },{
        // now < startDate < now + 7
        startDate:{$gt: new Date(now), $lt: new Date(now + STARTS_IN_X_DAYS*dayInterval)},
      },{
        // now - 2 < endDate < now
        endDate:{$gt: new Date(now - ENDS_UP_X_DAYS*dayInterval), $lt: new Date(now)},
      }]}

      return DB.models.Game.find(authCondition(context)).where(dates)
      .limit(20)
      .sort('-startDate')
    },
    search: (_, {title}, context)=>{

      const names = {title: {$regex: title, $options: 'i'}}

      return DB.models.Game.find(authCondition(context)).where(names)
        .limit(20)
        .sort('-startDate')
    },
  },
  Mutation: {
    gameAttendanceUpdate: (_, {gameId, attendance}, context)=>{
      return DB.models.Game.findOne({
        _id:gameId,
        ...authCondition(context),
      }).then(game=>{
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
    addGame: (_, {title, description, type, subtype, location, from, to, invited, isPublic}, context)=>{

      const {user} = context
      if (isPublic && user.permissions.includes(CREATE_PUBLIC_EVENT)){
        throw new Error('Not authorized to create public events')
      }

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
        permissions: isPublic?[PUBLIC]:undefined,
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
