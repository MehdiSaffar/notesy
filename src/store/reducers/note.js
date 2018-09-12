import actionTypes from "../actions/actionTypes"

const initialState = {}

export default (state = initialState, action) => {
    const map = {
        [actionTypes.ADD_NOTE]: addNote,
        [actionTypes.REMOVE_NOTE]: removeNote,
    }
    const toCall = map[action.type]
    return toCall ? toCall(state, action) : state
}

const addNote = (state, action) => {}

const removeNote = (state, action) => {}
