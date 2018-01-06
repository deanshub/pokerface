import mongoose from 'mongoose'

const schema = mongoose.Schema({
  owner: {
    type: String,
    ref: 'User',
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  photos: [{
    type: String,
    required: true,
    default: [],
  }],
  likes: [{
    type: String,
    ref: 'User',
    required: true,
    default: [],
  }],
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
})

const Post = mongoose.model('Post', schema)

export default Post
