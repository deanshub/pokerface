import path from 'path'
import DB from '../../db'

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

  type Query {
    posts(
      id: String,
      eventId: String,
      username: String,
      offset: Int
    ): [Post]
  }

  type Mutation{
    createPost(
      eventId: String,
      content: String!,
      photos: [Upload]
    ): Post
    deletePost(
      postId: String!
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
`]

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
    path: (file) => `/images/${file.path}`,
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
            ],
          })
          .limit(20)
          .skip(offset||0)
          .sort('-created')
        })
      }else if(eventId!==undefined){
        return DB.models.Post.find({ game: eventId })
        .limit(20)
        .skip(offset||0)
        .sort('-created')
      }else{
        // TODO: limit the number of posts
        query = DB.models.Post.find()
      }

      return query
        .limit(20)
        .skip(offset||0)
        .sort('-created')
    },
  },

  Mutation: {
    createPost: (_, {content, photos, eventId}, context)=>{
      const files = (photos||[]).map(photo=>{
        const filename = path.parse(photo.path).base
        return {path:filename, type:photo.type}
      })

      return new DB.models.Post({
        content: JSON.parse(content),
        owner: context.user._id,
        photos: files,
        game: eventId,
      }).save()
    },
    deletePost:(_, {postId}, context)=>{
      return DB.models.Post.findById(postId).then(post=>{
        if (post.owner===context.user._id){
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
}
