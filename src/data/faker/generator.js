import faker from 'faker'
import mongoose from 'mongoose'

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

function dropCollection(model){
  return model.remove()
}


const generateFakeData = (DB) => {
  function createUser(){
    return new DB.models.User({
      username: faker.internet.userName(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      coverImage: faker.image.image(),
      password: faker.internet.password(),
      active: true,
    }).save()
  }
  function createDemoUser(){
    return new DB.models.User({
      username: 'deanshub',
      firstname: 'Dean',
      lastname: 'Shub',
      email: 'demo@pokerface.io',
      avatar: 'dean2.jpg',
      coverImage: 'poker-1999643.jpg',
      password:'demo',
      active: true,
    }).save()
  }

  function createGame(players){
    const invited = getRandomItems(players, 5).map(user=>user.username)
    return new DB.models.Game({
      owner: getRandomItems(players)[0].username,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      type: 'Texas Hold\'em',
      subtype: 'Cash',
      location: `${faker.address.streetName()}, ${faker.address.city()}`,
      startDate: faker.date.past(),
      endDate: faker.date.past(),
      invited,
      accepted: invited.slice(0,2),
      declined: invited.slice(2,3),
    }).save()
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

  return Promise.all(Object.keys(DB.models).map(modelName=>{
    return dropCollection(DB.models[modelName])
  }))
  .then(()=>{
    let usersCreatetion = generateArray(20).map(createUser)
    usersCreatetion.push(createDemoUser())

    return Promise.all(usersCreatetion)
    .then(users=>{
      return Promise.all(generateRandomArray(25).map(()=>createGame(users)))
      .then((games)=>{
        return {users,games}
      })
      //   return Promise.all(generateArray(150).map(createPost)).then((posts)=>{
      //     return {users,posts}
      //   })
    })
    // .then(({users,games})=>{
    //   const addingGames = games.map(game=>{
    //     const users = getRandomItems(users)[0]
    //     return users.addGame(game)
    //   })
    //   return Promise.all(addingGames)
    // })
    // .then(({users,posts})=>{
    //   return Promise.all(generateArray(60).map(createComment)).then((comments)=>{
    //     return {users,posts,comments}
    //   })
    // })
    // .then(({users,posts,comments})=>{
    //   posts.forEach((post)=>{
    //     const users = getRandomItem(users)
    //     // post.setUser(users)
    //     users.addPost(post)
    //   })
    //   comments.forEach((comment)=>{
    //     const user = getRandomItem(users)
    //     const post = getRandomItem(posts)
    //     // comment.setUser(user)
    //     // comment.setPost(post)
    //     user.addComment(comment)
    //     post.addComment(comment)
    //   })
    // })
  })

}

export default generateFakeData
