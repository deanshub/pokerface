import mongoose from 'mongoose'

const schema = mongoose.Schema({
  player: {
    type: String,
    ref: 'Player',
    required: true,
  },
  title:{
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description:{
    type: String,
    trim: true,
  },
  type:{
    type: String,
    // enum: []
  },
  subtype:{
    type: String,
    // enum: []
  },
  location:{
    type: String,
    trim: true,
  },
  startDate:{
    type: Date,
    required: [true, 'Start time is required'],
  },
  endDate:{
    type: Date,
  },
  invited:[{
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: [],
  }],
  accepted:[{
    type: String,
    ref: 'Player',
    required: true,
    default: [],
  }],
  declined:[{
    type: String,
    ref: 'Player',
    required: true,
    default: [],
  }],
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
})
schema.virtual('unresponsive').get(function(){
  return (this.invited).filter((player)=>{
    return player.guest || ((!this.accepted.includes(player.username) && !this.declined.includes(player.username)))
  })
})

const Game = mongoose.model('Game', schema)

export default Game
