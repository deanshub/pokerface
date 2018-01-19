import DB from '../db'

export const equalInvitedPlayers = (p1, p2) => {
  return ((p1.guest && p2.guest && p1.fullname === p2.fullname) ||
    (!p1.guest && !p2.guest && p1.username === p2.username))
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const getInvitedsEventChange = (oldEvent, newEvent) => {

  const eventDetailsChanged = (
    oldEvent.title !== newEvent.title ||
    oldEvent.description !== newEvent.description ||
    oldEvent.type !== newEvent.type ||
    oldEvent.subtype !== newEvent.subtype ||
    oldEvent.location !== newEvent.location ||
    oldEvent.startDate.getTime() !== newEvent.startDate.getTime() ||
    oldEvent.endDate.getTime() !== newEvent.endDate.getTime()
  )

  const {newInviteds, updatedInviteds} = newEvent.invited.reduce(({newInviteds, updatedInviteds}, player) =>{

    const isPlayerNew = !oldEvent.invited.find(oldPlayer => equalInvitedPlayers(player, oldPlayer))

    if (isPlayerNew){
      return {updatedInviteds , newInviteds:newInviteds.concat(player)}
    }else if (eventDetailsChanged){
      return {newInviteds , updatedInviteds:updatedInviteds.concat(player)}
    }else{
      return {newInviteds, updatedInviteds}
    }
  }, {newInviteds:[], updatedInviteds:[]})

  const deletedInviteds = oldEvent.invited.filter(player => {
    return !newEvent.invited.find(newPlayer => equalInvitedPlayers(player, newPlayer))
  })



  return {newInviteds, updatedInviteds, deletedInviteds}
}

export const getSendableInviteds = (players) => {
  const invitedUsers = players.filter(player=>!player.guest).map(player=>player.username)
  const invitedGuests = players.filter(player=>player.guest)

  return DB.models.User.find({
    _id: {
      $in: invitedUsers,
    },
  }).populate({
    path:'players',
    select:'username firstname lastname fullname email',
  }).then(users=>{
    const additionalPlayers = invitedGuests.filter(player=>emailRegex.test(player.fullname)).map(player=>{
      return {
        email: player.fullname,
        new: true,
      }
    })

    // get the player of organizations
    const players = users.reduce((players, currentUser) => {
      if (!currentUser.players){
        return [...players, currentUser]
      }else{
        const orgPlayers = []

        // add only players not invited independently
        currentUser.players.forEach(orgPlayer => {
          if (!invitedUsers.includes(orgPlayer.username)){
            orgPlayers.push({...orgPlayer.toJSON(), organization:currentUser.fullname})
          }
        })

        return [...players,...orgPlayers]
      }
    },[])

    const registeredPlayersEmails = players.map(player=>player.email)
    const additionalPlayersEmails = additionalPlayers.filter(newPlayer=>!registeredPlayersEmails.includes(newPlayer.email))
    return players.concat(additionalPlayersEmails)
  })
}
