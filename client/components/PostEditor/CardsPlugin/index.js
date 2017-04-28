// @flow

import CardBlock from './CardBlock'
import cardsStrategy from './cardsStrategy'

export default () => {
  return {
    decorators: [
      {
        strategy: cardsStrategy,
        component: CardBlock,
      },
    ],
  }
}
