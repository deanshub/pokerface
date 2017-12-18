import COLORS from '../constants/styles.css'

export const selectColor = (text) => {
  switch (text) {
  case 'POT':
    return COLORS.potColor
  case 'K': // check
    return COLORS.checkColor
  case 'B': // bet
    return COLORS.betColor
  case 'A': // all-in
    return COLORS.allinColor
  case 'R': // raise
    return COLORS.raiseColor
  case 'F': // fold
    return COLORS.foldColor
  case 'C': // call
    return COLORS.callColor
  case 'SB': // small blind
    return COLORS.betColor
  case 'BB': // small blind
    return COLORS.betColor
  default:
    return '#FFFFFF'
  }
}

export const textToAction = (text) => {
  if (!text) return undefined

  const upperCased = text.toUpperCase()

  switch (upperCased) {
  case 'CHECK':
    return 'K' // check
  case 'BET':
    return 'B' // bet
  case 'ALL-IN':
    return 'A' // all-in
  case 'RAISE':
    return 'R' // raise
  case 'FOLD':
    return 'F' // fold
  case 'CALL':
    return 'C' // call
  case 'SMALL BLIND':
    return 'SB' // small blind
  case 'BIG BLIND':
    return 'BB' // big blind
  default:
    return upperCased
  }
}
