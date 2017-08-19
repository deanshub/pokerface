import DB from '../../db'
import {schema as Player} from './Player'
import {schema as Post} from './Post'

export const schema =  [`
  type Comment {
    id: String!
    createdAt: String
    content: String
    photos: [String]
    likes: [Player]
    player: Player
    post: Post
  }

  type Query {
    comments(
      postId: String!
    ): [Comment]
  }

  type Mutation{
    addComment(
      content: String!,
      photos:[String],
      post: String!
    ): Post
    deleteComment(
      commentId: String!
    ): Comment
    setCommentLike(
      content: Boolean!,
      comment: String!
    ): Comment
  }
`, ...Player, ...Post]

export const resolvers = {
  Comment:{
    id: (comment)=>comment._id,
    createdAt: (comment)=>comment.created,
    content: (comment)=>JSON.stringify(comment.content),
    photos: (comment)=>comment.photos,
    likes: (comment)=>DB.models.Player.find({
      _id:{
        $in: comment.likes,
      },
    }),
    player: (comment)=>DB.models.Player.findById(comment.player),
    post: (comment)=>DB.models.Post.findById(comment.post),
  },

  Query: {
    comments: (_, {postId})=>{
      return DB.models.Comment.find({post:postId})
    },
  },

  Mutation: {
    addComment: (_, {content, photos, post}, context)=>{
      return new DB.models.Comment({
        content: JSON.parse(content),
        player: context.user._id,
        post,
        photos,
      }).save()
      .then(()=>{
        return DB.models.Post.findById(post)
      })
    },
    deleteComment:(_, {commentId}, context)=>{
      return DB.models.Comment.findById(commentId).then(comment=>{
        if (comment.player===context.user._id){
          return comment.remove()
        }else{
          throw new Error('Can\'t delete comment of another user')
        }
      })
    },
    setCommentLike:(_, {comment, content}, context)=>{
      return DB.models.Comment.findById(comment)
        .then((comment)=>{
          const username = context.user._id
          let likes = comment.get('likes')
          if (content&&!likes.includes(username)){
            likes.push(username)
          }else if (!content&&likes.includes(username)){
            likes = likes.filter(user=>user!==username)
          }

          comment.set('likes', likes)
          return comment.save()
        })
    },
  },
}
