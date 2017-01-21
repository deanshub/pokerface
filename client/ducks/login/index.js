import { handleActions, createAction } from 'redux-actions'
import { replace, push } from 'react-router-redux'
import { browserHistory } from 'react-router'

const initialState = {}

export default handleActions({
  // 'select pawn' (state, action) {
  //   const selectedPawn = action.payload
  //   const statePawnData = state.data[selectedPawn.x][selectedPawn.y]
  //
  //   if (statePawnData && statePawnData.player!==0 && statePawnData.player!==undefined){
  //     // console.log(boardHelper.getNighborsXY(selectedPawn.x, selectedPawn.y));
  //     return Object.assign({}, state, {selectedPawn})
  //   }else if (state.selectedPawn){
  //     const selectedPawnData = state.data[state.selectedPawn.x][state.selectedPawn.y]
  //
  //     const suggestion = boardHelper.isSuggested(state.selectedPawn, selectedPawn)
  //     // console.log(state.selectedPawn, selectedPawn);
  //     if(suggestion === boardHelper.SUGGEST_CLOSE){
  //       return Object.assign({}, state,{
  //         data: boardHelper.duplicatePawn(state.data, selectedPawn, selectedPawnData),
  //         selectedPawn: undefined,
  //       })
  //     }else if(suggestion === boardHelper.SUGGEST_FAR){
  //       return Object.assign({}, state,{
  //         data: boardHelper.movePawn(state.data, selectedPawn, selectedPawnData, state.selectedPawn),
  //         selectedPawn: undefined,
  //       })
  //     }
  //   }
  //   return Object.assign({}, state, {selectedPawn:undefined})
  // },
  'login' (state, action){
    const { user, password } = action.payload
    console.log(state, { user, password })
    // push('/')
    // browserHistory.push('/')
    return state
  },
}, initialState)


// export const selectPawn = createAction('select pawn')
export const login = createAction('login')
