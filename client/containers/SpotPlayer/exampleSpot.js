import MOVES from './constants'

const spot = {
  currency: MOVES.CURRENCIES.EURO,
  // ante:1398,
  // sb:922,
  // bb:1394,
  sb:2,
  bb:4,
  players:[
    {
      fullname: 'player1',
      guest: true,
      avatar: '/images/avatar.png',
      bank: 100,
    },
    {
      fullname: 'player2',
      guest: true,
      avatar: '/images/avatar.png',
      bank: 100,
    },
    {
      fullname: 'player3',
      guest: true,
      avatar: '/images/avatar.png',
      bank: 100,
    },
    {
      fullname: 'player4',
      guest: true,
      avatar: '/images/avatar.png',
      bank: 100,
    },
    {
      username: 'deanshub',
      firstname: 'Dean',
      lastname: 'Shub',
      fullname: 'Dean Shub',
      email: 'demo@pokerface.io',
      avatar: '/images/upload_a591e181882091f45888bc07444da2eb.jpg',
      bank: 100,
    },
    // null,
    {
      fullname: 'player6',
      guest: true,
      avatar: '/images/avatar.png',
      bank: 100,
    },
    // {
    //   fullname: 'player7',
    //   guest: true,
    //   avatar: '/images/avatar.png',
    //   bank: 100,
    // },
    // {
    //   fullname: 'player8',
    //   guest: true,
    //   avatar: '/images/avatar.png',
    //   bank: 100,
    // },
    // {
    //   fullname: 'player9',
    //   guest: true,
    //   avatar: '/images/avatar.png',
    //   bank: 100,
    // },
  ],
  cards:{
    4:'Kc Ac',
    3:'Ah Th',
  },
  moves:[
    {
      player:4,
      action:MOVES.PLAYER_META_ACTIONS.SHOWS,
    },
    {
      player:1,
      action:MOVES.PLAYER_ACTIONS.FOLD,
    },
    {
      player:2,
      action:MOVES.PLAYER_ACTIONS.FOLD,
    },
    {
      player:3,
      action:MOVES.PLAYER_ACTIONS.RAISE,
      value:12,
    },
    {
      player:4,
      action:MOVES.PLAYER_ACTIONS.RAISE,
      value:36,
    },
    {
      player:5,
      action:MOVES.PLAYER_ACTIONS.FOLD,
    },
    {
      player:0,
      action:MOVES.PLAYER_ACTIONS.FOLD,
    },
    {
      player:3,
      action:MOVES.PLAYER_ACTIONS.CALL,
      value: 36,
    },
    {
      player:MOVES.DEALER,
      action:MOVES.DEALER_ACTIONS.FLOP,
      value:'4d 9d ad',
    },
    {
      player:3,
      action:MOVES.PLAYER_ACTIONS.CHECK,
    },
    {
      player:4,
      action:MOVES.PLAYER_ACTIONS.CHECK,
    },
    {
      player:MOVES.DEALER,
      action:MOVES.DEALER_ACTIONS.TURN,
      value:'4s',
    },
    {
      player:3,
      action:MOVES.PLAYER_ACTIONS.RAISE,
      value: 54,
    },
    {
      player:4,
      action:MOVES.PLAYER_ACTIONS.CALL,
      value: 54,
    },
    {
      player:MOVES.DEALER,
      action:MOVES.DEALER_ACTIONS.RIVER,
      value:'3s',
    },
    {
      player:3,
      action:MOVES.PLAYER_ACTIONS.RAISE,
      value: 128,
    },
    {
      player:4,
      action:MOVES.PLAYER_ACTIONS.CALL,
      value: 128,
    },
    {
      player:3,
      action:MOVES.PLAYER_META_ACTIONS.SHOWS,
    },
    {
      player:4,
      action:MOVES.PLAYER_META_ACTIONS.SHOWS,
    },
    // {//????? what about splits and side pots
    //   winners: [4],
    //   lossers: [3],
    // }
  ],
}

// {
//   player:2\MOVES.DEALER,
//   action:MOVES.PLAYER_ACTIONS.FOLD\MOVES.PLAYER_ACTIONS.CALL\MOVES.PLAYER_ACTIONS.RAISE\MOVES.PLAYER_ACTIONS.CHECK,
//   action:MOVES.DEALER_ACTIONS.FLOP\MOVES.DEALER_ACTIONS.TURN\MOVES.DEALER_ACTIONS.RIVER,
//   value:4,
//   value:'4d 9d ad',
// },

export default spot
