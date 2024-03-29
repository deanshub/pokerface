import {withFilter} from 'graphql-subscriptions'
import pubSub from './pubSub'
import DB from '../../db'
import path from 'path'
import config from 'config'

const POST_CHANGED = 'postChanged'

export const schema =  [`
  type File {
    path: String!
    type: String
  }

  type Post {
    id: String!
    createdAt: String
    content: String
    photos: [File]
    likes: [User]
    owner: User
    comments: [Comment]
    event: Event
  }

  enum PostChangeType {
    ADD
    UPDATE
    DELETE
  }

  type SubscribedPost {
    post: Post
    changeType: PostChangeType
  }

  type Query {
    posts(
      id: String,
      eventId: String,
      username: String,
      offset: Int
    ): [Post]
    newRelatedPosts: [Post]
  }

  type Mutation{
    createPost(
      eventId: String,
      content: String!,
      photos: [Upload],
      clientSocketId: String!
    ): Post
    deletePost(
      postId: String!,
      clientSocketId: String!
    ): Post
    setPostLike(
      content: Boolean!,
      post: String!
    ): Post
    updatePollAnswer(
      post: String!,
      option: Int!
    ): Post
  }

  type Subscription {
    ${POST_CHANGED}: SubscribedPost
  }
`]

const prepareRelatedUsers = (content) => {
  const entitys = content.entityMap
  if (!entitys){
    return undefined
  }

  const mentions = Object.values(entitys).filter(entity => entity.type === 'mention')

  return mentions.map(entity => entity.data.mention.username)
}

export const resolvers = {
  Post:{
    id: (post)=>post._id,
    createdAt: (post)=>post.created,
    content: (post)=>JSON.stringify(post.content),
    photos: (post)=>post.photos,
    likes: (post)=>DB.models.User.find({
      _id:{
        $in: post.likes,
      },
    }),
    owner: (post)=>DB.models.User.findById(post.owner),
    comments: (post)=>DB.models.Comment.find({post:post._id})
      .sort('created'),
    event: (post)=>DB.models.Game.findById(post.game),
  },
  File:{
    path: (file) => `${config.ROOT_URL}/images/${file.path}`,
    type: (file) => file.type,
  },
  Query: {
    posts: (_, {id, username, eventId, offset})=>{
      let query

      if (id!==undefined){
        query = DB.models.Post.find({_id: id})
      }else if (username!==undefined) {
        return DB.models.Comment.find({owner: username}).then((comments)=>{
          const posts = comments.map(comment=>comment.post)
          return DB.models.Post.find({
            $or:[
              {owner: username},
              {_id:{$in:posts}},
              {'content.spot.players.username': username},
              {relatedUsers: username},
            ],
          })
          .skip(offset||0)
          .limit(10)
          .sort('-created')
        })
      }else if(eventId!==undefined){
        return DB.models.Post.find({ game: eventId })
        .skip(offset||0)
        .limit(10)
        .sort('-created')
      }else{
        // TODO: limit the number of posts
        query = DB.models.Post.find()
      }

      return query
        .limit(10)
        .sort('-created')
        .skip(offset||0)
    },
    newRelatedPosts: (_, args, context)=>{
      const {_id:username} = context.user
      return DB.models.User.findById(username).then(user => {

        return DB.models.Post.find({
          updated: {$gt: user.lastPulseCheck},
          $or:[
            {'content.spot.players.username': username},
            {relatedUsers: username},
          ],
        })
      })

    },
  },

  Mutation: {
    createPost: (_, {content, photos, eventId, clientSocketId}, context)=>{
      const files = (photos||[]).map(photo=>{
        const filename = path.parse(photo.path).base
        if (photo.type.includes('image')||photo.type.includes('video')){
          return {path:filename, type:photo.type}
        }else{
          throw new Error(`Can't upload a file with type ${photo.type}`)
        }
      })

      const parsedContent = JSON.parse(content)
      return new DB.models.Post({
        content: parsedContent,
        owner: context.user._id,
        photos: files,
        game: eventId,
        relatedUsers: prepareRelatedUsers(parsedContent),
      }).save().then(post => {
        pubSub.publish(POST_CHANGED, {[POST_CHANGED]:{post, changeType:'ADD'}, clientSocketId})
        return post
      })
    },
    deletePost:(_, {postId, clientSocketId}, context)=>{
      return DB.models.Post.findById(postId).then(post=>{
        if (post.owner===context.user._id){
          pubSub.publish(POST_CHANGED, {[POST_CHANGED]:{post, changeType:'DELETE'}, clientSocketId})
          return post.remove()
        }else{
          throw new Error('Can\'t delete post of another user')
        }
      })
    },
    setPostLike:(_, {post, content}, context)=>{
      return DB.models.Post.findById(post)
        .then((post)=>{
          const username = context.user._id
          let likes = post.get('likes')
          if (content&&!likes.includes(username)){
            likes.push(username)
          }else if (!content&&likes.includes(username)){
            likes = likes.filter(user=>user!==username)
          }

          post.set('likes', likes)
          return post.save()
        })
    },
    updatePollAnswer(_, {post, option}, context){
      const username = context.user._id

      return DB.models.Post.findById(post)
        .then(post=>{
          const pullQueries = post.content.poll.answers.map((_, index)=>`content.poll.answers.${index}.votes`)
          const pullQuery = pullQueries.reduce((res,cur,index)=>{
            if (index!==option){
              res[cur]=username
            }
            return res
          },{})
          const pushQuery = {[`content.poll.answers.${option}.votes`]:username}
          return DB.models.Post.findOneAndUpdate({_id: post}, { $pull: pullQuery, $push: pushQuery })
        })
    },
  },
  Subscription:{
    [POST_CHANGED]:{
      subscribe: withFilter(
        () => pubSub.asyncIterator(POST_CHANGED),
        (payload, _, context) => {
          const {clientSocketId} = context

          if (payload){
            const {clientSocketId:socketIdPublisher} = payload
            return (clientSocketId !== socketIdPublisher)
          }

          return false
        },
      ),
    },
  },
}
