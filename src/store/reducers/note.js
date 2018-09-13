import actionTypes from "../actions/actionTypes"
import axios from 'axios'
import { produce } from 'immer';

const initialState = {
    notes: [],
}


export default (state = initialState, action) => {
    const map = {
        [actionTypes.ADD_NOTE]: addNote,
        [actionTypes.REMOVE_NOTE]: removeNote,
        // [actionTypes.GET_NOTE]: getNote,
        [actionTypes.GET_NOTES_SUCCESS]: getNotes,
    }
    const toCall = map[action.type]
    return toCall ? toCall(state, action) : state
}

const addNote = (state, action) => {return state}

const removeNote = (state, action) => {return state}

const getNotes = (state, action) => produce(state, draftState => {
    draftState.notes = action.notes
})
