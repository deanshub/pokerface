export const SUITES = {
  hearts: '♥',
  diams: '♦',
  spades: '♠',
  clubs: '♣',
}

export const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

const suitesKeys = Object.keys(SUITES)

export const randomSuit = ()=>{
  const randomIndex = Math.floor(Math.random() * suitesKeys.length)
  return suitesKeys[randomIndex]
}

export const randomRank = ()=>{
  const randomIndex = Math.floor(Math.random() * RANKS.length)
  return RANKS[randomIndex]
}
