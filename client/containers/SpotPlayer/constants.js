const MOVES={
  DEALER:-1,
  CURRENCIES:{
    EURO: '€',
    DOLLAR: '$',
    NIS: '₪',
  },
  PLAYER_ACTIONS:{
    FOLD: 'FOLD',
    CHECK: 'CHECK',
    CALL: 'CALL',
    RAISE: 'RAISE',
    ANTE: 'ANTE',
    SMALLBLIND: 'SMALLBLIND',
    BIGBLIND: 'BIGBLIND',
  },
  PLAYER_META_ACTIONS:{
    DEALER: 'DEALER',
    SHOWS: 'SHOWS',
    MOCKS: 'MOCKS',
  },
  DEALER_ACTIONS:{
    FLOP: 'FLOP',
    TURN: 'TURN',
    RIVER: 'RIVER',
  },
  DEALER_META_ACTIONS:{
    END: 'END',
  },
}

export default MOVES
