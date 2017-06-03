// @flow

export const SUITES = {
  hearts: '♥',
  diams: '♦',
  spades: '♠',
  clubs: '♣',
}

export const RANKS: string[] = ['2','3','4','5','6','7','8','9','10','j','q','k','a']

const suitesKeys = Object.keys(SUITES)

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
  if (lowerSuit==='♥'||lowerSuit==='h'||lowerSuit==='heart'||lowerSuit==='hearts'){
    return 'hearts'
  }else if (lowerSuit==='♦'||lowerSuit==='d'||lowerSuit==='dimond'||lowerSuit==='dimonds'||lowerSuit==='diam'||lowerSuit==='diams'){
    return 'diams'
  }else if (lowerSuit==='♠'||lowerSuit==='s'||lowerSuit==='spade'||lowerSuit==='spades'){
    return 'spades'
  }else if (lowerSuit==='♣'||lowerSuit==='c'||lowerSuit==='club'||lowerSuit==='clubs'){
    return 'clubs'
  }else{
    return null
  }
}

export const normalizeRank: Function =(originalRank: string): string=>{
  const lowerRank = originalRank.toLowerCase()
  if (lowerRank==='j'||lowerRank==='11'){
    return 'j'
  }else if (lowerRank==='q'||lowerRank==='12') {
    return 'q'
  }else if (lowerRank==='k'||lowerRank==='13') {
    return 'k'
  }else if (lowerRank==='1'||lowerRank==='a') {
    return 'a'
  }else{
    return lowerRank
  }
}
