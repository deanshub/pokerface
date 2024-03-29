import mongoose from 'mongoose'
const Schema = mongoose.Schema

const validateEmail = (email)=> {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const schema = Schema(
  {
    _id: {
      alias: 'username',
      type: String,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, 'Username is required'],
      // validate: [validateUsername, 'This username already exists, username must be unique'],
      trim: true,
    },
    organization: {
      type: Boolean,
    },
    players: {
      type:[{
        type: String,
        ref: 'User',
      }],
      default: undefined,
    },
    owner:{
      type: String,
      ref: 'User',
    },
    firstname: {
      type: String,
      required: [true, 'Firstname is required'],
      index: true,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
      index: true,
    },
    email:{
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Email address is required'],
      validate: [validateEmail, 'Please fill a valid email address'],
      index: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    coverImage: {
      type: String,
    },
    phonenumber:{
      type: String,
    },
    permissions:{
      type:[{
        type: String,
      }],
    },
    rebrandingDetails:{
      logo:{
        type: String,
      },
      title:{
        type: String,
      },
      primaryColor: {
        type: String,
      },
      secondaryColor: {
        type: String,
      },
      tertiaryColor: {
        type: String,
      },
    },
    gender:{
      type:String,
    },
    lastPulseCheck:{
      type:Date,
    },
    tempuuid: {
      type: String,
    },
    tempuuiddate:{
      type: Date,
    },
    unsbscribe: {
      type: Boolean,
    },
    unsbscribeuuid: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
)

schema.virtual('fullname').get(function(){
  return `${this.firstname}${this.lastname?` ${this.lastname}`:''}`
})

const User = mongoose.model('User', schema)

export default User
