import mongoose from 'mongoose'
const Schema = mongoose.Schema

const schema = Schema(
  {
    _id: {
      alias: 'username',
      type: String,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, 'Username is required'],
      trim: true,
      ref: 'User',
    },
    theme: String,
    unsubscribe:{
      type:[{
        type: String,
      }],
    },
  }
)

const UserSettings = mongoose.model('UserSettings', schema)

export default UserSettings
