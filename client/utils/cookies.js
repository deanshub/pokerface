export const getCookieByName = (name) => {
  const getCookieValues = (cookie) => {
    const cookieArray = cookie.split('=')
    return cookieArray[1].trim()
  }

  const getCookieNames = (cookie) => {
    const cookieArray = cookie.split('=')
    return cookieArray[0].trim()
  }

  const cookies = document.cookie.split(';')

  if (cookies == ''){
    return null
  }

  const cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)]

  return (cookieValue === undefined) ? null : cookieValue
}
