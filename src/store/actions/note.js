import actions from "./actionTypes"
import axios from "axios"

export const addNote = content => ({ type: actions.ADD_NOTE, ...content })
export const removeNote = noteId => ({ type: actions.REMOVE_NOTE, noteId })
export const getNote = noteId => ({ type: actions.GET_NOTE, noteId })

// NOTES
const notesEndpoint = "https://react-notesy.firebaseio.com/notes.json"

export const getNotes = () => dispatch => {
    const getNotesStart = () => ({ type: actions.GET_NOTES_START })
    const getNotesFail = error => ({ type: actions.GET_NOTES_FAIL, error })
    const getNotesSuccess = notes => ({
        type: actions.GET_NOTES_SUCCESS,
        notes,
    })

    dispatch(getNotesStart())
    const request = notesEndpoint
    axios
        .get(request)
        .then(response => {
            // console.log(response.data)
            const keys = Object.keys(response.data)
            const arr = keys.map(key => ({
                id: key,
                content: response.data[key].content,
            }))
            console.log(arr)
            dispatch(getNotesSuccess(arr))
        })
        .catch(error => {
            console.log(error)
            dispatch(getNotesFail(error.response.data.error))
        })
}
