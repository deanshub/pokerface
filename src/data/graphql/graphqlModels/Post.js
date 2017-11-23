import path from 'path'
import DB from '../../db'
// import {schema as Player} from './Player'
// import {schema as Comment} from './Comment'

export const schema =  [`
  type Post {
    id: String!
    createdAt: String
    content: String
    photos: [String]
    likes: [Player]
    player: Player
    comments: [Comment]
  }

  type Query {
    posts(
      id: String,
      username: String,
      offset: Int
    ): [Post]
  }

  type Mutation{
    createPost(
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
  }
`]

export const resolvers = {
  Post:{
    id: (post)=>post._id,
    createdAt: (post)=>post.created,
    content: (post)=>JSON.stringify(post.content),
    photos: (post)=>post.photos.map(photo=>`/images/${photo}`),
    likes: (post)=>DB.models.Player.find({
      _id:{
        $in: post.likes,
      },
    }),
    player: (post)=>DB.models.Player.findById(post.player),
    comments: (post)=>DB.models.Comment.find({post:post._id})
      .sort('created'),
  },

  Query: {
    posts: (_, {id, username, offset})=>{
      let query
      if (id!==undefined){
        query = DB.models.Post.find({_id: id})
      }else if (username!==undefined) {
        return DB.models.Comment.find({player: username}).then((comments)=>{
          const posts = comments.map(comment=>comment.post)
          return DB.models.Post.find({
            $or:[
              {player: username},
              {_id:{$in:posts}},
            ],
          })
          .limit(20)
          .skip(offset||0)
          .sort('-created')
        })
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
    createPost: (_, {content, photos}, context)=>{
      const photosUrl = (photos||[]).map(photo=>{
        const filename = path.parse(photo.path).base
        return filename
      })
      return new DB.models.Post({
        content: JSON.parse(content),
        player: context.user._id,
        photos: photosUrl,
      }).save()
    },
    deletePost:(_, {postId}, context)=>{
      return DB.models.Post.findById(postId).then(post=>{
        if (post.player===context.user._id){
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
  },
}
