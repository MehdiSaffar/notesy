import actions from './actionTypes'

export const addNote = (content) => ({ type: actions.ADD_NOTE, ...content})
export const removeNote = (noteId) => ({ type: actions.REMOVE_NOTE, ...noteId})