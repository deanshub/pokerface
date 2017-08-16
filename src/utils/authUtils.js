const isSuperAdmin = (user)=>{
  return user._id === 'deanshub'
}

export default {
  isSuperAdmin,
}
