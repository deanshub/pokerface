// export default /\[]/g
// export const rangeRegex = /(\s|\[|,)?(13|12|10|11|[1-9]|[kKjJqQaAjJtT])([dDhHsScC♥♦♠♣])/g


const ace = '([1aA])'
const king = '(13|[kK])'
const queen = '(12|[qQ])'
const jack = '(11|[jJ])'
const ten = '(10|[Tt])'
const any = '([xX])'
const rank = `((2)|(3)|(4)|(5)|(6)|(7)|(8)|(9)|${ten}|${jack}|${queen}|${king}|${ace}|${any})`
const pair = `((${rank})\\1)`
const suit = `(${rank}${rank}[sS])`
const offSuit = `(${rank}${rank}[oO])`

const pairsWithRange = `(${pair}((\\+)|(-${pair}))?)`
const suitWithRange = `(${suit}((\\+)|(-${suit}))?)`
const offSuitWithRange = `(${offSuit}((\\+)|(-${offSuit}))?)`

const range = new RegExp(`(\\[((${pairsWithRange}|${suitWithRange}|${offSuitWithRange})[ ,]*)+])`,'g')
export default range
