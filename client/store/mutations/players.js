export const updatePersonalInfoMutation = `($firstname: String, $cover: Object){
  updatePersonalInfo(firstname: $firstname, cover: $cover){
    username
    fullname
    avatar
    coverImage
  }
}`
