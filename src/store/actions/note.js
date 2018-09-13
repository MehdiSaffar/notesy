import actionTypes from "./actionTypes"
import axios from "axios"

export const addNote = content => ({ type: actionTypes.ADD_NOTE, ...content })
export const removeNote = noteId => ({ type: actionTypes.REMOVE_NOTE, noteId })
export const getNote = noteId => ({ type: actionTypes.GET_NOTE, noteId })

// NOTES
const notesEndpoint = "https://react-notesy.firebaseio.com/notes"

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
export const updateCurrentNote = (title, content) => ({type: actionTypes.UPDATE_CURRENT_NOTE, title, content})
export const setCurrentNote = (id) => ({type: actionTypes.SET_CURRENT_NOTE, id: id})
export const saveCurrentNote = (id, title, content) => dispatch => {
    const saveCurrentNoteStart = (id,title,content) => ({ type: actionTypes.SAVE_CURRENT_NOTE_START, id,title,content})
    const saveCurrentNoteFail = error => ({ type: actionTypes.SAVE_CURRENT_NOTE_FAIL, error })
    const saveCurrentNoteSuccess = () => ({
        type: actionTypes.SAVE_CURRENT_NOTE_SUCCESS,
    })

    dispatch(saveCurrentNoteStart(id,title,content))
    const url = notesEndpoint + "/" + id + "/.json"

    axios.patch(url, {title, content})
        .then(response => dispatch(saveCurrentNoteSuccess()))
        .catch(error => dispatch(saveCurrentNoteFail(error.response.data.error)))
} 
