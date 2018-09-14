import actionTypes from "../actions/actionTypes"
import axios from "axios"
import { produce } from "immer"

const initialState = {
    notes: [],
    currentNote: {},
}

export default (state = initialState, action) => {
    const map = {
        [actionTypes.ADD_NOTE_SUCCESS]: addNote,
        [actionTypes.REMOVE_NOTE]: removeNote,
        // [actionTypes.GET_NOTE]: getNote,
        [actionTypes.GET_NOTES_SUCCESS]: getNotes,
        [actionTypes.UPDATE_CURRENT_NOTE]: updateCurrentNote,
        [actionTypes.SET_CURRENT_NOTE]: setCurrentNote,
    }
    const toCall = map[action.type]
    return toCall ? toCall(state, action) : state
}

const addNote = (state, action) =>
    produce(state, draftState => {
        draftState.notes.push({
            id: action.id,
            title: action.title,
            content: action.content,
        })
    })

const removeNote = (state, action) => {
    return state
}

const getNotes = (state, action) =>
    produce(state, draftState => {
        draftState.notes = action.notes
    })

const setCurrentNote = (state, action) =>
    produce(state, draftState => {
        const id = action.id
        draftState.currentNote = state.notes.find(note => note.id === id)
    })

const updateCurrentNote = (state, action) =>
    produce(state, draftState => {
        draftState.currentNote.title = action.title
        draftState.currentNote.content = action.content
        draftState.notes.find(
            note => note.id === draftState.currentNote.id
        ).title = action.title
        draftState.notes.find(
            note => note.id === draftState.currentNote.id
        ).content = action.content
    })
