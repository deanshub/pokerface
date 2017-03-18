import Sequelize from 'sequelize'
import faker from 'faker'
import CreatePlayerModel from './dbModels/Player'
import CreatePostModel from './dbModels/Post'
import CreateCommentModel from './dbModels/Comment'

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

Player.hasMany(Post)
Player.hasMany(Comment)
Post.belongsTo(Player)
Post.hasMany(Comment)
Comment.belongsTo(Post)
Comment.belongsTo(Player)


Conn
// .sync()
.sync({force: true})
.then(()=>{
  // TODO: only in debug
  function generateRandomArray(num){
    return Array.from(Array(Math.floor(Math.random()*num)))
  }

  function generateArray(num){
    return Array.from(Array(num))
  }

  function getRandomItem(arr){
    return arr[Math.floor(Math.random()*arr.length)]
  }

  function createPlayer(){
    return Player.create({
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      coverImage: faker.image.image(),
    })
  }

  function createPost(){
    return Post.create({
      content: faker.lorem.paragraph(),
      photos: generateRandomArray(5).map(()=>faker.random.image()),
      likes: generateRandomArray(10).map(()=>faker.internet.userName()),
    })
  }

  function createComment(){
    return Comment.create({
      content: faker.lorem.paragraph(),
      // photos: generateRandomArray(5).map(()=>faker.random.image()),
      likes: generateRandomArray(10).map(()=>faker.internet.userName()),
    })
  }

  faker.seed(123)
  Promise.all(generateArray(20).map(createPlayer))
  .then(players=>{
    return Promise.all(generateArray(150).map(createPost)).then((posts)=>{
      return {players,posts}
    })
  })
  .then(({players,posts})=>{
    return Promise.all(generateArray(60).map(createComment)).then((comments)=>{
      return {players,posts,comments}
    })
  })
  .then(({players,posts,comments})=>{
    posts.forEach((post)=>{
      const player = getRandomItem(players)
      // post.setPlayer(player)
      player.addPost(post)
    })
    comments.forEach((comment)=>{
      const player = getRandomItem(players)
      const post = getRandomItem(posts)
      // comment.setPlayer(player)
      // comment.setPost(post)
      player.addComment(comment)
      post.addComment(comment)
    })
  })
})

export default Conn
