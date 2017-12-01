const getCookieValues = (cookie) => {
  const cookieArray = cookie.split('=')
  const cookieValue = cookieArray[1]
  if (typeof cookieValue==='string'){
    return cookieValue.trim()
  }else{
    return undefined
  }
}

const getCookieNames = (cookie) => {
  const cookieArray = cookie.split('=')
  return cookieArray[0].trim()
}

export const getCookieByName = (name) => {
  const cookies = document.cookie.split(';')

  if (!Array.isArray(cookies)){
    return null
  }

  const cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)]

  return (cookieValue === undefined) ? null : cookieValue
}

export const deleteCookie = (name) => {
  if (document.cookie.includes(name)){
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }
}
