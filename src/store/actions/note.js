import actionTypes from "./actionTypes"
import axios from "axios"

// NOTES
const notesEndpoint = "https://react-notesy.firebaseio.com/notes"

export const addNote = (title, content) => dispatch => {
    const start = () => ({ type: actionTypes.ADD_NOTE_START })
    const fail = error => ({ type: actionTypes.ADD_NOTE_FAIL, error })
    const success = (id, title, content) => ({
        type: actionTypes.ADD_NOTE_SUCCESS,
        id, title, content,
    })
    dispatch(start())
   
    const noteData = {title, content}

    axios.post(notesEndpoint + '.json', noteData)
    .then(response => {
        const id = response.data.name
        dispatch(success(id, title, content))
    })
    .catch(error => dispatch(fail(error.response.data.error)))
}
export const removeNote = (id) => dispatch => {
    const start = () => ({ type: actionTypes.REMOVE_NOTE_START })
    const fail = error => ({ type: actionTypes.REMOVE_NOTE_FAIL, error })
    const success = (id, title, content) => ({
        type: actionTypes.REMOVE_NOTE_SUCCESS,
        id, title, content,
    })
    dispatch(start())

    axios.delete(notesEndpoint + "/" + id + ".json")
    .then(response => {
        dispatch(success(id))
    })
    .catch(error => dispatch(fail(error.response.data.error)))
}
export const getNote = noteId => ({ type: actionTypes.GET_NOTE, noteId })


export const getNotes = () => dispatch => {
    const getNotesStart = () => ({ type: actionTypes.GET_NOTES_START })
    const getNotesFail = error => ({ type: actionTypes.GET_NOTES_FAIL, error })
    const getNotesSuccess = notes => ({
        type: actionTypes.GET_NOTES_SUCCESS,
        notes,
    })

    dispatch(getNotesStart())
    const request = notesEndpoint + ".json"
    axios
        .get(request)
        .then(response => {
            // console.log(response.data)
            const keys = Object.keys(response.data)
            const arr = keys.map(key => ({
                id: key,
                title: response.data[key].title,
                content: response.data[key].content,
            }))
            console.log(arr)
            dispatch(getNotesSuccess(arr))
            dispatch(setCurrentNote(arr[0].id))
        })
        .catch(error => {
            console.log(error)
            dispatch(getNotesFail(error.response.data.error))
        })
}

// // CURRENT NOTE
export const updateCurrentNote = (title, content) => dispatch => {
    dispatch(({ type: actionTypes.UPDATE_CURRENT_NOTE, title, content }))
    return Promise.resolve({
        title,
        content,
    })
}

export const setCurrentNote = id => ({
    type: actionTypes.SET_CURRENT_NOTE,
    id: id,
})
export const saveNote = (id, title, content) => dispatch => {
    const saveNoteStart = (id, title, content) => ({
        type: actionTypes.SAVE_NOTE_START,
        id,
        title,
        content,
    })
    const saveNoteFail = error => ({ type: actionTypes.SAVE_NOTE_FAIL, error })
    const saveNoteSuccess = () => ({
        type: actionTypes.SAVE_NOTE_SUCCESS,
    })

    dispatch(saveNoteStart(id, title, content))
    const url = notesEndpoint + "/" + id + "/.json"

    axios
        .patch(url, { title, content })
        .then(response => {
            dispatch(saveNoteSuccess())
        })
        .catch(error => dispatch(saveNoteFail(error.response.data.error)))
}
