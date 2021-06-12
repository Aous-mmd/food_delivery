import { createStore } from 'redux'

const initialState = {
  sidebarShow: 'responsive',
  user: ''
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'user':
      return { ...state, ...rest }
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store