import {withFilter} from 'graphql-subscriptions'
import pubSub from './pubSub'
import DB from '../../db'
import path from 'path'
import mailer from '../../../utils/mailer'
import {CREATE_PUBLIC_EVENT, PUBLIC} from '../../../utils/permissions'
import { prepareCoverImage } from '../../helping/user'
import { getInvitedsEventChange, equalInvitedPlayers } from '../../helping/event'

const EVENT_CHANGED = 'eventChanged'

export const schema =  [`
  type Event {
    id: String!
    title: String
    description: String
    type: String
    subtype: String
    location: String
    from: String
    to: String
    isPublic: Boolean
    invited: [Player]
    accepted: [Player]
    declined: [Player]
    unresponsive: [Player]
    updatedAt: String
    createdAt: String
    creator: User
    coverImage: String
    posts: [Post]
  }

  enum EventChangeType {
    ADD
    UPDATE
    DELETE
  }

  type SubscribedEvent {
    event: Event
    changeType: EventChangeType
  }

  type Query {
    event(
      eventId: String!
    ): Event
    events: [Event]
    search(
      title: String!
    ): [Event]
  }

  type Mutation{
    eventAttendanceUpdate(
      eventId: String!,
      attendance: Boolean
    ): Event
    addEvent(
      title: String!,
      description: String,
      type: String,
      subtype: String,
      location: String,
      from: String!,
      to: String,
      invited: String,
      isPublic: Boolean,
      coverImage: Upload,
      clientSocketId: String!
    ): Event
    updateEvent(
      id: String!,
      title: String!,
      description: String,
      type: String,
      subtype: String,
      location: String,
      from: String!,
      to: String,
      invited: String,
      isPublic: Boolean
      coverImage: Upload,
      clientSocketId: String!
    ): Event
    deleteEvent(
      eventId: String!,
      clientSocketId: String!
    ): Event
  }

  type Subscription {
    ${EVENT_CHANGED}: SubscribedEvent
  }
`]

const authCondition = (context) => {
  const {_id:username} = context.user
  return {$or: [{
    permissions: PUBLIC,
  },{
    owner: username,
  },{
    invited: {$elemMatch:{username, guest:{$ne:true}}},
  }]}
}

export const resolvers = {
  Event:{
    id: (game)=>game._id,
    title: (game)=>game.title,
    description: (game)=>game.description,
    type: (game)=>game.type,
    subtype: (game)=>game.subtype,
    location: (game)=>game.location,
    from: (game)=>game.startDate,
    to: (game)=>game.endDate,
    isPublic: (game)=>game.permissions && game.permissions.includes(PUBLIC),
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
    coverImage: (game)=>prepareCoverImage(game.coverImage),
    posts: (game)=> DB.models.Post.find({game: game.id}),
  },

  Query: {
    event: (_, {eventId}, context)=>{
      return DB.models.Game.findOne({
        _id:eventId,
        ...authCondition(context),
      })
    },
    events: (_, args, context)=>{
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

      return DB.models.Game.find().and([authCondition(context),dates])
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
    eventAttendanceUpdate: (_, {eventId, attendance}, context)=>{
      return DB.models.Game.findOne({
        _id:eventId,
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
    addEvent: (_, args , context)=>{
      const {
        title,
        description,
        type,
        subtype,
        location,
        from,
        to,
        invited,
        isPublic,
        coverImage,
        clientSocketId,
      } = args

      const {user} = context
      if (isPublic && (!user.permissions || !user.permissions.includes(CREATE_PUBLIC_EVENT))){
        throw new Error('Not authorized to create public events')
      }
      if (coverImage && (!coverImage.type || !coverImage.type.includes('image'))){
        throw new Error('Image is not valid')
      }

      return new DB.models.Game({
        owner: user._id,
        title,
        description,
        type,
        subtype,
        location,
        startDate: new Date(from),
        endDate: to!==undefined?new Date(to):undefined,
        coverImage: coverImage?path.parse(coverImage.path).base:undefined,
        invited: JSON.parse(invited),
        permissions: isPublic?[PUBLIC]:undefined,
      }).save()
      .then(event=>{
        //const eventRaw = event.toJSON()
        mailer.sendEventInvite(event, event.invited)
        pubSub.publish(EVENT_CHANGED, {[EVENT_CHANGED]:{event, changeType:'ADD'}, clientSocketId})
        return event
      })
    },
    updateEvent: (_, args, context) => {
      const {
        id,
        title,
        description,
        type,
        subtype,
        location,
        from,
        to,
        invited,
        isPublic,
        coverImage,
        clientSocketId,
      } = args
      const {user} = context
      if (isPublic && (!user.permissions || !user.permissions.includes(CREATE_PUBLIC_EVENT))){
        throw new Error('Not authorized to create public events')
      }

      const clientInvited = JSON.parse(invited)
      let oldEvent
      return DB.models.Game.findOne({_id:id, owner: context.user._id}).populate('owner').then(event => {

        oldEvent = event.toJSON()

        event.title = title
        event.description = description
        event.type = type
        event.subtype = subtype
        event.location = location
        event.startDate = from
        event.endDate = to
        event.coverImage = coverImage?path.parse(coverImage.path).base:undefined
        event.permissions = isPublic?[PUBLIC]:undefined
        event.invited = clientInvited

        if (!isPublic){
          event.accepted = oldEvent.accepted.filter(player => {
            return clientInvited.find(newPlayer => equalInvitedPlayers(player, newPlayer))
          })
          event.declined = oldEvent.declined.filter(player => {
            return clientInvited.find(newPlayer => equalInvitedPlayers(player, newPlayer))
          })
        }

        return event.save()
      }).then(updatedEvent =>{

        if (isPublic){

          // TODO may to send also to the inviteds who is not declined
          mailer.sendEventUpadte(updatedEvent, updatedEvent.accepted)
        }else{

          const {
            newInviteds,
            updatedInviteds,
            deletedInviteds,
          } = getInvitedsEventChange(oldEvent, updatedEvent)

          mailer.sendEventInvite(updatedEvent, newInviteds)
          mailer.sendEventCancelled(updatedEvent, deletedInviteds)
          mailer.sendEventUpadte(updatedEvent, updatedInviteds)

          const deletedUsers = deletedInviteds.filter(player=>!player.guest).map(player=>player.username)

          pubSub.publish(EVENT_CHANGED, {
            [EVENT_CHANGED]:{
              event:updatedEvent,
              changeType:'UPDATE',
            },
            deletedUsers,
            clientSocketId,
          })
        }
        return updatedEvent
      })
    },
    deleteEvent: (_, {eventId, clientSocketId}, context)=>{
      return DB.models.Game.findById(eventId).then(event=>{
        if (event.owner===context.user._id ){
          if (event.endDate.getTime() > Date.now()){
            mailer.sendEventCancelled(event, [...event.invited, ...event.accepted])
            pubSub.publish(EVENT_CHANGED, {
              [EVENT_CHANGED]:{
                event,
                changeType:'DELETE',
              },
              clientSocketId,
            })
          }

          return event.remove()
        }else{
          throw new Error('Can\'t delete event of another user')
        }
      })
    },
  },
  Subscription: {
    [EVENT_CHANGED]: {
      resolve: (payload, args, context) => {
        // Manipulate and return the new value
        const {deletedUsers} = payload
        const {userId} = context
        // // Incase of event update we want to send DELETE
        if (deletedUsers && deletedUsers.includes(userId)){
          payload[EVENT_CHANGED].changeType = 'DELETE'
        }

        return payload[EVENT_CHANGED]
      },
      subscribe: withFilter(
        () => pubSub.asyncIterator(EVENT_CHANGED),
        (payload, _, context) => {
          const {userId, clientSocketId} = context

          if (payload){
            const {clientSocketId:socketIdPublisher, deletedUsers} = payload
            const {event} = payload[EVENT_CHANGED]

            const isUserInvited = event.invited.findIndex(player=>!player.guest && player.username === userId) > -1
            const isDeletedInvited = deletedUsers && deletedUsers.includes(userId)

            return (isUserInvited  || userId === event.owner._id || isDeletedInvited) &&
                   (clientSocketId !== socketIdPublisher)
          }

          return false
        }
      ),
    },
  },
}
