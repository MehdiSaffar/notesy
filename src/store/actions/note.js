import actionTypes from "./actionTypes"
import axios from "axios"

// NOTES
const notesEndpoint = "https://react-notesy.firebaseio.com/notes"


export const addNote = (title, content) => (dispatch, getState) => {
    const start = () => ({ type: actionTypes.ADD_NOTE_START })
    const fail = error => ({ type: actionTypes.ADD_NOTE_FAIL, error })
    const success = (id, title, content) => ({
        type: actionTypes.ADD_NOTE_SUCCESS,
        id,
        title,
        content,
    })
    dispatch(start())

    const user_id = getState().auth.localId
    const noteData = { user_id, title, content }

    axios
        .post(notesEndpoint + ".json?auth=" + getState().auth.idToken, noteData)
        .then(response => {
            const id = response.data.name
            dispatch(success(id, title, content))
            dispatch(setCurrentNote(id))
        })
        .catch(error => dispatch(fail(error.response.data.error)))
}

export const addTag = (id, tags) => (dispatch, getState) => {
    const start = () => ({ type: actionTypes.ADD_TAG_START })
    const fail = error => ({ type: actionTypes.ADD_TAG_FAIL, error })
    const success = (id, tags) => ({
        type: actionTypes.ADD_TAG_SUCCESS,
        id,
        tags,
    })
    dispatch(start())

    const url = notesEndpoint + "/" + id

    axios
        .get(url + "/tags.json?auth=" + getState().auth.idToken)
        .then(response => {
            const existingTags = response.data || []
            const noteData = {
                tags: existingTags.concat(tags),
            }
            axios.patch(url + ".json", noteData).then(response => {
                dispatch(success(id, noteData.tags))
            })
        })

        .catch(error => dispatch(fail(error.response.data.error)))
}

export const deleteTag = (id, tag) => (dispatch, getState) => {
    dispatch(updateStatus("Removing tag..."))
    const start = () => ({ type: actionTypes.REMOVE_TAG_START, id })
    const fail = error => ({ type: actionTypes.REMOVE_TAG_FAIL, error })
    const success = ts => ({
        type: actionTypes.REMOVE_TAG_SUCCESS,
        id,
        tags: ts,
    })
    dispatch(start())

    const url = notesEndpoint + "/" + id
    axios.get(url + "/tags.json").then(response => {
        console.log("response: ", response)
        const existingTags = response.data
        const noteData = {
            tags: existingTags.filter(t => t !== tag),
        }
        console.log("noteData: ", noteData)
        axios
            .patch(url + ".json", noteData)
            .then(response => {
                dispatch(success(noteData.tags))
            })
            .catch(error => {
                console.log(error)
                dispatch(fail(error.response.data.error))
            })
    }).catch(err => {
        console.log(err)
        dispatch(fail(err.response.data.error))
    })
}
export const removeNote = id => (dispatch, getState) => {
    const { title, content } = getState().note.notes.find(el => el.id === id)
    if (title === "" && content === "" && getState().note.notes.length === 1)
        return
    dispatch(updateStatus("Removing note..."))
    const start = () => ({ type: actionTypes.REMOVE_NOTE_START, id })
    const fail = error => ({ type: actionTypes.REMOVE_NOTE_FAIL, error })
    const success = (id, title, content) => ({
        type: actionTypes.REMOVE_NOTE_SUCCESS,
        id,
        title,
        content,
    })
    dispatch(start())

    axios
        .delete(notesEndpoint + "/" + id + ".json?auth=" + getState().auth.idToken)
        .then(response => {
            dispatch(success(id))
            dispatch(updateStatus())
            if (getState().note.notes.length) {
                const goodId = getState().note.notes[
                    getState().note.notes.length - 1
                ].id
                dispatch(setCurrentNote(goodId))
            } else {
                dispatch(addNote("", ""))
            }
        })
        .catch(error => {
            console.log(error)
            dispatch(fail(error.response.data.error))
        })
}
export const getNote = noteId => ({ type: actionTypes.GET_NOTE, noteId })

export const getNotes = () => (dispatch, getState) => {
    const getNotesStart = () => ({ type: actionTypes.GET_NOTES_START })
    const getNotesFail = error => ({ type: actionTypes.GET_NOTES_FAIL, error })
    const getNotesSuccess = notes => ({
        type: actionTypes.GET_NOTES_SUCCESS,
        notes,
    })

    const tokenStr = "?auth=" + getState().auth.idToken
    dispatch(getNotesStart())
    const request = notesEndpoint + ".json" + tokenStr
    axios
        .get(request)
        .then(response => {
            // console.log(response.data)
            const keys = Object.keys(response.data)
            const arr = keys.map(key => {
                console.log("thing:", response.data[key].tags)
                return {
                    id: key,
                    userId: response.data[key].user_id,
                    title: response.data[key].title,
                    content: response.data[key].content,
                    tags: response.data[key].tags
                        ? response.data[key].tags
                        : [],
                }
            }).filter(el => el.userId === getState().auth.localId)
            console.log("arr:", arr)
            dispatch(getNotesSuccess(arr))
            if(arr.length) dispatch(setCurrentNote(arr[0].id))
        })
        .catch(error => {
            console.log(error)
            dispatch(getNotesFail(error.response.data.error))
        })
}

// // CURRENT NOTE
export const updateCurrentNote = (title, content) => dispatch => {
    dispatch({ type: actionTypes.UPDATE_CURRENT_NOTE, title, content })
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
    dispatch(updateStatus("Saving note..."))
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
            dispatch(updateStatus())
        })
        .catch(error => dispatch(saveNoteFail(error.response.data.error)))
}

export const updateStatus = (status = "") => ({
    type: actionTypes.NOTE_UPDATE_STATUS,
    status,
})
