import mongoose from 'mongoose'

const schema = mongoose.Schema({
  owner: {
    type: String,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
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
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
})

const Comment = mongoose.model('Comment', schema)

export default Comment
