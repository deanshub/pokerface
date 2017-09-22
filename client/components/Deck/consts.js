// @flow

export const SUITES = {
  hearts: '♥',
  diams: '♦',
  spades: '♠',
  clubs: '♣',
}

export const RANKS: string[] = ['2','3','4','5','6','7','8','9','10','t','j','q','k','a']

const suitesKeys = Object.keys(SUITES)

export const getUnimportantCard: Function = (): Object=>{
  return {
    rank: '?',
    suit: '?',
  }
}

export const randomSuit: Function = (): string=>{
  const randomIndex: number = Math.floor(Math.random() * suitesKeys.length)
  return suitesKeys[randomIndex]
}

export const randomRank: Function = (): string=>{
  const randomIndex: number = Math.floor(Math.random() * RANKS.length)
  return RANKS[randomIndex]
}

export const normalizeSuite: Function =(originalSuit: string): string=>{
  const lowerSuit = originalSuit.toLowerCase()
  if (lowerSuit==='♥'||lowerSuit==='♡'||lowerSuit==='h'||lowerSuit==='heart'||lowerSuit==='hearts'){
    return 'hearts'
  }else if (lowerSuit==='♦'||lowerSuit==='♢'||lowerSuit==='d'||lowerSuit==='dimond'||lowerSuit==='dimonds'||lowerSuit==='diam'||lowerSuit==='diams'){
    return 'diams'
  }else if (lowerSuit==='♠'||lowerSuit==='♤'||lowerSuit==='s'||lowerSuit==='spade'||lowerSuit==='spades'){
    return 'spades'
  }else if (lowerSuit==='♣'||lowerSuit==='♧'||lowerSuit==='c'||lowerSuit==='club'||lowerSuit==='clubs'){
    return 'clubs'
  }else if (lowerSuit==='?'||lowerSuit==='joker'||lowerSuit==='☺'||lowerSuit==='☻'){
    return 'joker'
  }else{
    return null
  }
}

export const normalizeRank: Function =(originalRank: string): string=>{
  const lowerCaseRank = originalRank.toLowerCase()
  if (lowerCaseRank==='t'||lowerCaseRank==='10'){
    return '10'
  } else if (lowerCaseRank==='j'||lowerCaseRank==='11'){
    return 'j'
  }else if (lowerCaseRank==='q'||lowerCaseRank==='12') {
    return 'q'
  }else if (lowerCaseRank==='k'||lowerCaseRank==='13') {
    return 'k'
  }else if (lowerCaseRank==='1'||lowerCaseRank==='a') {
    return 'a'
  }else if (lowerCaseRank==='?'||lowerCaseRank==='joker') {
    return 'joker'
  }else{
    return lowerCaseRank
  }
}
