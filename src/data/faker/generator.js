import faker from 'faker'

faker.seed(123)

function generateRandomArray(num){
  return Array.from(Array(Math.floor(Math.random()*num)))
}

function generateArray(num){
  return Array.from(Array(num))
}

function shuffle(arr) {
  let a = [...arr]
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]]
  }
  return a
}

function getRandomItems(arr, num=1){
  return shuffle(arr).slice(-num)
}


const generateFakeData = (conn, {Player,Post,Comment,Game}) => {
  function createPlayer(){
    return Player.create({
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      coverImage: faker.image.image(),
      password: faker.internet.password(),
    })
  }
  function createDemoPlayer(){
    return Player.create({
      username: 'deanshub',
      firstName: 'Dean',
      lastName: 'Shub',
      email: 'demo@pokerface.io',
      avatar: 'dean2.jpg',
      coverImage: 'poker-1999643.jpg',
      password:'demo',
    })
  }

  function createGame(players){
    const invited = getRandomItems(players, 5).map(user=>user.username)
    return Game.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      type: 'Texas Hold\'em',
      subtype: 'Cash',
      location: `${faker.address.streetName()}, ${faker.address.city()}`,
      from: faker.date.past(),
      to: faker.date.past(),
      invited,
      accepted: invited.slice(0,2),
      declined: invited.slice(2,3),
    })
  }

  // function createPost(){
  //   return Post.create({
  //     content: faker.lorem.paragraph(),
  //     photos: generateRandomArray(5).map(()=>faker.random.image()),
  //     likes: generateRandomArray(10).map(()=>faker.internet.userName()),
  //   })
  // }
  //
  // function createComment(){
  //   return Comment.create({
  //     content: faker.lorem.paragraph(),
  //     // photos: generateRandomArray(5).map(()=>faker.random.image()),
  //     likes: generateRandomArray(10).map(()=>faker.internet.userName()),
  //   })
  // }


  let playersCreatetion = generateArray(20).map(createPlayer)
  playersCreatetion.push(createDemoPlayer())

  return Promise.all(playersCreatetion)
  .then(players=>{
    return Promise.all(generateRandomArray(25).map(()=>createGame(players)))
    .then((games)=>{
      return {players,games}
    })
    //   return Promise.all(generateArray(150).map(createPost)).then((posts)=>{
    //     return {players,posts}
    //   })
  })
  .then(({players,games})=>{
    const addingGames = games.map(game=>{
      const player = getRandomItems(players)[0]
      return player.addGame(game)
    })
    return Promise.all(addingGames)
  })
    // .then(({players,posts})=>{
    //   return Promise.all(generateArray(60).map(createComment)).then((comments)=>{
    //     return {players,posts,comments}
    //   })
    // })
    // .then(({players,posts,comments})=>{
    //   posts.forEach((post)=>{
    //     const player = getRandomItem(players)
    //     // post.setPlayer(player)
    //     player.addPost(post)
    //   })
    //   comments.forEach((comment)=>{
    //     const player = getRandomItem(players)
    //     const post = getRandomItem(posts)
    //     // comment.setPlayer(player)
    //     // comment.setPost(post)
    //     player.addComment(comment)
    //     post.addComment(comment)
    //   })
    // })
}

export default generateFakeData
