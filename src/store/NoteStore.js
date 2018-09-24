import actionTypes from "./actionTypes"
import axios from "axios"
import { observable, computed, action, runInAction } from "mobx"

    authStr = idToken => "?auth=" + idToken
    notesEndpoint = "https://react-notesy.firebaseio.com/notes"
 firebase = new function() {
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

export default class NoteStore {
    @observable
    notes = []
    @observable
    currentNote = {}
    @observable
    deletingNote = null
    @observable
    status = "Ready"

    @action
    resetNotes() {
        this.notes = []
        this.currentNote = {}
        this.deletingNote = null
        this.status = "Ready"
    }

    @action
    async addNote(title, content) {
        try {
            const data = await firebase.addNote(
                { title, content, userId, tags: [] },
                idToken
            )
            const newNote = {
                id: data.name,
                title,
                content,
                tags: [],
            }
            runInAction('addNoteSuccess', () => {
                this.notes.push(newNote)
                this.setCurrentNote()
            })
        } catch (error) {
            console.error("addNote", error)
        }
    }

    @action async getNotes(userId, tokenId) {
        try {
            const notes = await firebase.getNotes(userId, tokenId)
        } catch (error) {
            console.error('getNotes', error)
        }
    }

    @action
    async removeNote(id) {
        const { title, content } = this.notes.find(el => el.id === id)

        // dont delete last empty note
        if (title === "" && content === "" && this.notes.length === 1)
            return

        try {
            const data = await firebase.removeNote(id, idToken)
            this.notes = this.notes.filter(note => note.id !== id)
            if (this.currentNote.id === id) {
                this.currentNote = {}
            }
            this.deletingNote = null
        } catch (error) {
            console.error('removeNote', error)
        }
    }
    @action
    async addTag(tags, id) {
        try {
            const newTags = await firebase.addTags(tags, id, idToken)
            // nope
            this.notes.find(el => el.id === id).tags = newTags
            this.currentNote.tags = newTags
        } catch (error) {
            console.error('addTag', error)
        }
    }
    @action
    async deleteTag(tags, id) {
        try {
            const newTags = await firebase.deleteTag(tag, id, idToken)
            this.notes.find(el => el.id === id).tags = newTags
            this.currentNote.tags = newTags
        } catch (error) {
            console.error('deleteTag', error)
        }
        // nope
    }
    @action
    removeNoteStart(id) {
        this.deletingNote = id
    }

    @action
    setCurrentNote(id) {
        this.currentNote = this.notes.find(note => note.id === id)
    }

    @action
    updateCurrentNote(title, content) {
        this.currentNote.title = title
        this.currentNote.content = content
        this.notes.find(note => note.id === this.currentNote.id).title = title
        this.notes.find(
            note => note.id === this.currentNote.id
        ).content = content
        // this.notes.find(
        //     note => note.id === this.currentNote.id
        // ).tags = tags
    }

    @action
    updateNoteStatus(status = "") {
        this.status = status === "" ? "Ready" : status
    }

    // lkfjsd;fljds;lfjsdl;kfjsfjsdlkfjsdlfjdslkfjsdljfsl;kdjflksjflkdsjfd


// NOTES

// // CURRENT NOTE
updateCurrentNote = (title, content)  {
    return Promise.resolve({
        title,
        content,
    })
}


saveNote = (id, title, content, idToken) => async (
    dispatch,
    getState
) => {
    try {
        // dispatch(updateStatus("Saving note..."))
        // dispatch(start(id, title, content))

        const data = await firebase.saveNote({ title, content }, id, idToken)
        // dispatch(success())
        // dispatch(updateStatus())
    } catch (error) {
        // dispatch(fail(error))
    }
    }
}
