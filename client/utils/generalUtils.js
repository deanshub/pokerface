import R from 'ramda'

export const viewParam = (path, obj) => {
  const lense = R.lensPath(path.split('.'))
  return R.view(lense, obj)
}
