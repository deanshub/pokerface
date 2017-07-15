import Sequelize from 'sequelize'
import CreatePlayerModel from './dbModels/Player'
import CreatePostModel from './dbModels/Post'
import CreateCommentModel from './dbModels/Comment'
import CreateGameModel from './dbModels/Game'
import generateFakeData from './faker/generator'

const Conn = new Sequelize(
  'pokerface',
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    dialect: 'postgres',
    host: 'localhost',
  }
)

const Player = CreatePlayerModel(Conn)
const Post = CreatePostModel(Conn)
const Comment = CreateCommentModel(Conn)
const Game = CreateGameModel(Conn)

Game.belongsTo(Player)
Player.hasMany(Game)
Player.hasMany(Post)
Player.hasMany(Comment)
Post.belongsTo(Player)
Post.hasMany(Comment)
Comment.belongsTo(Post)
Comment.belongsTo(Player)


// Conn
// // .sync()
// // TODO: only in debug
// .sync({force: true})
// .then(()=>{
//   return generateFakeData(Conn, {
//     Player,
//     Post,
//     Comment,
//     Game,
//   })
// })

export default Conn
