import R from 'ramda'

export const viewParam = (path, obj) => {
  const lense = R.lensPath(path.split('.'))
  return R.view(lense, obj)
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isEmailPattern = (email) => {
  return emailRegex.test(email)
}
