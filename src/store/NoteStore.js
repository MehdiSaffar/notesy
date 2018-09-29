import { observable, computed, action, runInAction, reaction } from "mobx"
import firebase from "./../shared/firebase"

export default class NoteStore {
    root

    constructor(_root) {
        this.root = _root
    }

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

    // checkState = reaction(
    //     () => this.currentNote,
    //     currentNote => {
    //         currentNote.must.not.be.eql(undefined)
    //         Object.keys(currentNote)
    //             .map(key => currentNote[key])
    //             .every(el => el.must.not.be.eql(undefined))
    //         // if(tags === undefined) {
    //         //     console.error("this.currentNote.tags is undefined")
    //         // }
    //     }
    // )

    @action
    async addNote(title, content, userId, tokenId) {
        try {
                this.updateNoteStatus("Adding note...")
                let tempNote = {
                    id: "TEMP",
                    title: "",
                    content: "",
                    tags: [],
                    ready: false,
                }

                this.notes.push(tempNote)

                const data = await firebase.addNote(
                    { title, content, userId, tags: [] },
                    tokenId
                )

                runInAction('addNoteSuccess', () => {
                    // tempNote.id= data.name
                    // tempNote.title = title
                    // tempNote.content = content
                    // tempNote.tags= data.tags || []
                    tempNote = {
                        id: data.name,
                        title,
                        content,
                        tags: data.tags || [],
                        ready: true,
                    }
                    this.notes[this.notes.length - 1] = tempNote

                    // console.log('tempNote', tempNote)
                    // console.log('this.notes lastOne', this.notes[this.notes.length - 1])
                    // console.log('this.notes', this.notes)
                    this.setCurrentNote(tempNote.id)
                })
        } catch (error) {
            console.error("addNote", error)
        } finally {
            this.updateNoteStatus()
        }
    }

    @action
    async getNotes(userId, tokenId) {
        try {
            this.updateNoteStatus("Getting notes...")
            const notes = await firebase.getNotes(userId, tokenId)
            notes.forEach(note => note.ready = true)
            runInAction(() => {
                this.notes = notes
            })
        } catch (error) {
            console.error("getNotes", error)
        } finally {
            this.updateNoteStatus()
        }
    }

    @action
    async removeNote(id, tokenId) {
        const { title, content } = this.notes.find(el => el.id === id)

        // dont delete last empty note
        if (title === "" && content === "" && this.notes.length === 1) return

        try {
            this.updateNoteStatus("Removing note...")
            const data = await firebase.removeNote(id, tokenId)
            this.notes = this.notes.filter(note => note.id !== id)
            if (this.currentNote.id === id) {
                this.currentNote = this.notes[this.notes.length - 1].id
            }
            this.deletingNote = null
        } catch (error) {
            console.error("removeNote", error)
        } finally {
            this.updateNoteStatus()
        }
    }

    @action
    async addTag(id, tags, tokenId) {
        console.info("addTag in store", tags, id, tokenId)
        try {
            this.updateNoteStatus("Adding tag...")
            const newTags = await firebase.addTags(tags, id, tokenId)
            // nope
            runInAction(() => {
                this.notes.find(el => el.id === id).tags = newTags
                this.currentNote.tags = newTags
                // console.log(this.currentNote.tags)
            })
        } catch (error) {
            console.error("addTag", error)
        } finally {
            this.updateNoteStatus()
        }
    }
    @action
    async removeTag(id, tag, tokenId) {
        try {
            this.updateNoteStatus("Removing tag...")
            const newTags = await firebase.deleteTag(tag, id, tokenId)
            runInAction(() => {
                this.notes.find(el => el.id === id).tags = newTags
                this.currentNote.tags = newTags
            })
        } catch (error) {
            console.error("deleteTag", error)
        } finally {
            this.updateNoteStatus()
        }
    }

    @action
    setCurrentNote(id) {
        const noteToFind = this.notes.find(note => note.id === id)
        this.currentNote = noteToFind
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
    updateNoteStatus(status) {
        this.status = status || "" || "Ready"
    }

    @action
    async saveNote(id, title, content, tokenId) {
        try {
            this.updateNoteStatus("Saving note...")
            const data = await firebase.saveNote(
                { title, content },
                id,
                tokenId
            )
        } catch (error) {
            console.error(error)
        } finally {
            this.updateNoteStatus()
        }
    }
}
