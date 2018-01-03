import mongoose from 'mongoose'

const schema = mongoose.Schema({
  owner: {
    type: String,
    ref: 'User',
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
    ref: 'User',
    required: true,
    default: [],
  }],
  declined:[{
    type: String,
    ref: 'User',
    required: true,
    default: [],
  }],
  permissions:{
    type:[{
      type: String,
    }],
  },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
})
schema.virtual('unresponsive').get(function(){
  return (this.invited).filter((user)=>{
    return user.guest || ((!this.accepted.includes(user.username) && !this.declined.includes(user.username)))
  })
})

const Game = mongoose.model('Game', schema)

export default Game
