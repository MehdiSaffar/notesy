import React, { Component } from "react"
import { produce } from "immer"
import classes from "./NoteEditor.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ToolbarInput from "./../../components/UI/Form/Input/ToolbarInput"
import ToolbarButton from "./../../components/UI/Form/Button/ToolbarButton"
import { inject, observer } from "mobx-react"
import { computed, observable, reaction, autorun, observe } from "mobx"

// Changing a note data triggers a timer with SAVE_TIME amount in milliseconds to trigger a save
const SAVE_TIME = 150

@inject("store")
@observer
export default class NoteEditor extends Component {
    // Changing a note data triggers a timer with SAVE_TIME amount in milliseconds to trigger a save
    saveTimer = null

    @computed
    get store() {
        return this.props.store
    }

    // @computed get changed() {
    //     if(this._id !== this.store.note.currentNote.id) {
    //         // console.info("Different note", this._id, this.store.note.currentNote.id)
    //         return true
    //     }
    //     // console.info("SAME note", this._id, this.store.note.currentNote.id)
    //     return false
    // }

    // //     // Here we check if the user loaded a different note
    // checkChanged = autorun(() => {
    //     if(this.changed) {
    //         // console.info("changed id")
    //         this._id = this.store.note.currentNote.id
    //     }
    // })
    /// DRAFT ---------------------
    // _id = null
    // @computed get
    // id() {
    //     return this._id
    // }

    // _title = ''
    // @computed get
    // title() {
    //     if(this.changed) {
    //         this._title = this.store.note.currentNote.title
    //     }
    //     return this._title
    // }
    // _content = ""
    // @computed get
    // content() {
    //     if(this.changed) {
    //         this._content = this.store.note.currentNote.content
    //     }
    // }

    @observable tagInput = ""
    /// DRAFT ---------------------

    contentTextarea = React.createRef()

    // if (store.note.tags !== this.tags) {
    //         this.tags= store.note.tags
    // }

    componentWillUnmount() {
        // Clear timeout to avoid any unexpected save
        if (this.saveTimer) {
            clearTimeout(this.saveTimer)
        }
    }

    // Triggered when the note content changes
    onTitleChangedHandler = event => {
        this.store.note.currentNote.title = event.target.value
        this.checkSaveTimer()
    }

    // Triggered when the note content changes
    onContentChangedHandler = event => {
        this.store.note.currentNote.content = event.target.value
        this.checkSaveTimer()
    }

    // Triggered when the delete button is pressed
    onDeleteNoteClickedHandler = () => {
        this.store.note.removeNote(this.store.note.currentNote.id, this.store.auth.tokenId)
    }

    // Triggered when the tag is clicked
    onRemoveTagClickedHandler = tag => {
        this.store.note.removeTag(this.store.note.currentNote.id, tag, this.store.auth.tokenId)
    }

    // Triggered when user presses a key in the tag input
    onTagInputKeyUpHandler = event => {
        if (event.key === "Enter") {
            event.preventDefault()
            if (!this.store.note.currentNote.tags.includes(this.tagInput.trim())) {
                this.store.note.addTag(
                    this.store.note.currentNote.id,
                    [this.tagInput.trim()],
                    this.store.auth.tokenId
                )
                this.tagInput = ""
            }
        }
    }


    // Checks if enough time has passed between the last edit to trigger a save
    checkSaveTimer = () => {
        if (this.saveTimer !== null) {
            clearTimeout(this.saveTimer)
        }
        this.saveTimer = setTimeout(() => {
            this.updateNoteAndSaveNote()
        }, SAVE_TIME)
    }

    // Updates the note locally and saves it to the database
    updateNoteAndSaveNote = async () => {
        try {
            await this.store.note.updateCurrentNote(
                this.store.note.currentNote.title,
                this.store.note.currentNote.content
            )
            this.store.note.saveNote(
                this.store.note.currentNote.id,
                this.store.note.currentNote.title,
                this.store.note.currentNote.content,
                this.store.auth.tokenId
            )
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    render() {
        // console.log(this.props.store)
        const deleteNoteButton = (
            <ToolbarButton
                extraClass={classes.ToolIcon}
                onClick={this.onDeleteNoteClickedHandler}
            >
                <FontAwesomeIcon icon={"trash"} fixedWidth />
            </ToolbarButton>
        )

        const tags =
            this.store.note.currentNote.tags &&
            this.store.note.currentNote.tags.map(tag => (
                <div
                    key={tag}
                    className={classes.Tag}
                    onClick={() => this.onRemoveTagClickedHandler(tag)}
                >
                    {tag}
                </div>
            ))

        const tagInput = (
            <ToolbarInput
                value={this.tagInput}
                onChange={event => (this.tagInput = event.target.value)}
                onKeyUp={this.onTagInputKeyUpHandler}
                placeholder="Add tag..."
            />
        )

        const emailLink = (
            <a
                href=""
                className={classes.Email}
                onClick={e => e.preventDefault()}
            >
                {this.store.auth.email}
            </a>
        )

        const toolbar = (
            <div className={classes.Toolbar}>
                {deleteNoteButton}
                {tags}
                {tagInput}
                {emailLink}
            </div>
        )

        const title = (
            <input
                className={classes.Title}
                placeholder="Title"
                value={this.store.note.currentNote.title}
                onChange={this.onTitleChangedHandler}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        this.contentTextarea.current.selectionEnd = 0
                        this.contentTextarea.current.focus()
                    }
                }}
            />
        )

        const content = (
            <textarea
                className={classes.Content}
                placeholder="Content"
                ref={this.contentTextarea}
                value={this.store.note.currentNote.content}
                onChange={this.onContentChangedHandler}
                // onKeyDown={this.onContentKeyDownHandler}
            />
        )

        return (
            <div className={classes.NoteEditor}>
                {toolbar}
                {title}
                {content}
            </div>
        )
    }
}
