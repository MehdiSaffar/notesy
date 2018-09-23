import actionTypes from "./actionTypes"
import axios from "axios"

// NOTES
const notesEndpoint = "https://react-notesy.firebaseio.com/notes"

const authStr = idToken => "?auth=" + idToken

const firebase = new function() {
    this.addNote = async (noteData, idToken) => {
        try {
            const response = await axios.post(
                `${notesEndpoint}.json${authStr(idToken)}`,
                noteData
            )
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.removeNote = async (noteId, idToken) => {
        try {
            const response = await axios.delete(
                `${notesEndpoint}/${noteId}.json${authStr(idToken)}`
            )
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.saveNote = async (noteData, noteId, idToken) => {
        try {
            const response = await axios.patch(
                `${notesEndpoint}/${noteId}.json${authStr(idToken)}`,
                noteData
            )
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.getNotes = async (userId, idToken) => {
        try {
            const response = await axios.get(
                `${notesEndpoint}.json${authStr(idToken)}`
            )
            return Object.keys(response.data)
                .map(key => ({
                    id: key,
                    userId: response.data[key].user_id,
                    title: response.data[key].title,
                    content: response.data[key].content,
                    tags: response.data[key].tags || [],
                }))
                .filter(el => el.userId === userId)
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.getTags = async (noteId, idToken) => {
        try {
            const response = await axios.get(
                `${notesEndpoint}/${noteId}/tags.json${authStr(idToken)}`
            )
            return response.data || []
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.addTags = async (tags, noteId, idToken) => {
        try {
            const existingTags = await this.getTags(noteId, idToken)
            const newTags = existingTags.concat(tags)
            await this.setTags(newTags, noteId, idToken)
            return newTags
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.setTags = async (tags, noteId, idToken) => {
        try {
            const response = await axios.patch(
                `${notesEndpoint}/${noteId}.json${authStr(idToken)}`,
                {
                    tags,
                }
            )
            return response.data.tags || []
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.deleteTag = async (tag, noteId, idToken) => {
        try {
            const existingTags = await this.getTags(noteId, idToken)
            const filteredTags = existingTags.filter(t => t !== tag)
            const newTags = await this.setTags(filteredTags, noteId, idToken)
            return newTags
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }
}()

export const addNote = (title, content, userId, idToken) => async dispatch => {
    const start = () => ({ type: actionTypes.ADD_NOTE_START })
    const fail = error => ({ type: actionTypes.ADD_NOTE_FAIL, error })
    const success = (id, title, content) => ({
        type: actionTypes.ADD_NOTE_SUCCESS,
        id,
        title,
        content,
    })
    try {
        dispatch(start())
        const data = await firebase.addNote(
            { title, content, user_id: userId },
            idToken
        )
        const id = data.name
        dispatch(success(id, title, content))
        dispatch(setCurrentNote(id))
    } catch (error) {
        dispatch(fail(error))
    }
}

export const addTag = (id, tags, idToken) => async (dispatch, getState) => {
    const start = () => ({ type: actionTypes.ADD_TAG_START })
    const fail = error => ({ type: actionTypes.ADD_TAG_FAIL, error })
    const success = (id, tags) => ({
        type: actionTypes.ADD_TAG_SUCCESS,
        id,
        tags,
    })

    try {
        dispatch(start())
        const newTags = await firebase.addTags(tags, id, idToken)
        dispatch(success(id, newTags))
    } catch (error) {
        dispatch(fail(error))
    }
}

export const deleteTag = (id, tag, idToken) => async (dispatch, getState) => {
    const start = () => ({ type: actionTypes.DELETE_TAG_START, id })
    const fail = error => ({ type: actionTypes.DELETE_TAG_FAIL, error })
    const success = tags => ({
        type: actionTypes.DELETE_TAG_SUCCESS,
        id,
        tags
    })
    try {
        dispatch(updateStatus("Deleting tag..."))
        dispatch(start())
        const newTags = await firebase.deleteTag(tag, id, idToken)
        dispatch(updateStatus())
        dispatch(success(newTags))
    } catch (error) {
        console.log(error)
        dispatch(fail(error))
    }
}

export const removeNote = (id, idToken) => async (dispatch, getState) => {
    const start = () => ({ type: actionTypes.REMOVE_NOTE_START, id })
    const fail = error => ({ type: actionTypes.REMOVE_NOTE_FAIL, error })
    const success = (id, title, content) => ({
        type: actionTypes.REMOVE_NOTE_SUCCESS,
        id,
        title,
        content,
    })
    const { title, content } = getState().note.notes.find(el => el.id === id)
    if (title === "" && content === "" && getState().note.notes.length === 1)
        return

    try {
        dispatch(updateStatus("Removing note..."))
        dispatch(start())

        const data = await firebase.removeNote(id, idToken)
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
    } catch (error) {
        dispatch(fail(error))
    }
}

export const getNote = noteId => ({ type: actionTypes.GET_NOTE, noteId })
export const getNotes = (userId, tokenId) => async (dispatch, getState) => {
    const start = () => ({ type: actionTypes.GET_NOTES_START })
    const fail = error => ({ type: actionTypes.GET_NOTES_FAIL, error })
    const success = notes => ({
        type: actionTypes.GET_NOTES_SUCCESS,
        notes,
    })

    try {
        dispatch(start())
        const notes = await firebase.getNotes(userId, tokenId)
        dispatch(success(notes))
        if (notes.length) dispatch(setCurrentNote(notes[0].id))
    } catch (error) {
        dispatch(fail(error))
    }
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

export const saveNote = (id, title, content, idToken) => async (
    dispatch,
    getState
) => {
    const start = (id, title, content) => ({
        type: actionTypes.SAVE_NOTE_START,
        id,
        title,
        content,
    })
    const fail = error => ({ type: actionTypes.SAVE_NOTE_FAIL, error })
    const success = () => ({
        type: actionTypes.SAVE_NOTE_SUCCESS,
    })

    try {
        dispatch(updateStatus("Saving note..."))
        dispatch(start(id, title, content))

        const data = await firebase.saveNote({ title, content }, id, idToken)
        dispatch(success())
        dispatch(updateStatus())
    } catch (error) {
        dispatch(fail(error))
    }
}

export const updateStatus = (status = "") => ({
    type: actionTypes.NOTE_UPDATE_STATUS,
    status,
})
