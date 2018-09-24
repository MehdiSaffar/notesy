import { observable, computed, action, runInAction } from "mobx"
import firebase from './../shared/firebase'


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
    async addNote(title, content, userId, tokenId) {
        try {
            const data = await firebase.addNote(
                { title, content, userId, tags: [] },
                tokenId
            )
            const newNote = {
                id: data.name,
                title,
                content,
                tags: [],
            }
            runInAction("addNoteSuccess", () => {
                this.notes.push(newNote)
                this.setCurrentNote()
            })
        } catch (error) {
            console.error("addNote", error)
        }
    }

    @action
    async getNotes(userId, tokenId) {
        try {
            const notes = await firebase.getNotes(userId, tokenId)
            runInAction(() => this.notes = notes) 
        } catch (error) {
            console.error("getNotes", error)
        }
    }

    @action
    async removeNote(id, tokenId) {
        const { title, content } = this.notes.find(el => el.id === id)

        // dont delete last empty note
        if (title === "" && content === "" && this.notes.length === 1) return

        try {
            const data = await firebase.removeNote(id, tokenId)
            this.notes = this.notes.filter(note => note.id !== id)
            if (this.currentNote.id === id) {
                this.currentNote = {}
            }
            this.deletingNote = null
        } catch (error) {
            console.error("removeNote", error)
        }
    }
    @action
    async addTag(tags, id, tokenId) {
        try {
            const newTags = await firebase.addTags(tags, id, tokenId)
            // nope
            this.notes.find(el => el.id === id).tags = newTags
            this.currentNote.tags = newTags
        } catch (error) {
            console.error("addTag", error)
        }
    }
    @action
    async deleteTag(tag, id, tokenId) {
        try {
            const newTags = await firebase.deleteTag(tag, id, tokenId)
            this.notes.find(el => el.id === id).tags = newTags
            this.currentNote.tags = newTags
        } catch (error) {
            console.error("deleteTag", error)
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

    @action
    async saveNote(id, title, content, tokenId) {
        try {
            const data = await firebase.saveNote(
                { title, content },
                id,
                tokenId
            )
        } catch (error) {
            console.error(error)
        }
    }
}
