import React, { Component } from "react"
import { produce } from "immer"
import classes from "./NoteEditor.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ToolbarInput from "./../../components/UI/Form/Input/ToolbarInput"
import ToolbarButton from './../../components/UI/Form/Button/ToolbarButton';
import { inject, observer } from "mobx-react";
import { computed } from 'mobx'

// Changing a note data triggers a timer with SAVE_TIME amount in milliseconds to trigger a save
const SAVE_TIME = 150

@inject('store')
@observer
export default class NoteEditor extends Component {
    // Changing a note data triggers a timer with SAVE_TIME amount in milliseconds to trigger a save
    saveTimer = null

    @computed get store() { return this.props.store}

    state = {
        id: null,
        title: "",
        content: "",
        tagInput: "",
    }

    contentTextarea = React.createRef()

    static getDerivedStateFromProps(props, state) {
        // Here we check if the user loaded a different note
        // console.log("getDerivedStateFromProps")

        // A note has been deleted
        const store = props.store
        if (store.note.id === undefined && state.id !== undefined) {
            return {
                ...state,
                id: null,
                title: "",
                content: "",
                tags: [],
            }
        }
        if (store.note.id !== undefined && store.note.id !== state.id) {
            // console.log(
            //     `received new note from id: ${state.id} to id:${props.id}`
            // )
            const newState = {
                id: store.note.id,
                title: store.note.title,
                content: store.note.content,
                tags: store.note.tags,
            }
            // console.log("new state: ", newState)
            return newState
        }
        if (props.tags !== state.tags) {
            const newState = {
                ...state,
                tags: store.note.tags,
            }
            return newState
        }
        return null
    }

    componentWillUnmount() {
        // Clear timeout to avoid any unexpected save
        if (this.saveTimer) {
            clearTimeout(this.saveTimer)
        }
    }

    // Triggered when the note content changes
    onTitleChangedHandler = event => {
        this.setState(
            produce(this.state, draftState => {
                draftState.title = event.target.value
            })
        )
        this.checkSaveTimer()
    }

    // Triggered when the note content changes
    onContentChangedHandler = event => {
        this.setState(
            produce(this.state, draftState => {
                draftState.content = event.target.value
            })
        )
        this.checkSaveTimer()
    }

    // Triggered when the delete button is pressed
    onDeleteNoteClickedHandler = () => {
        this.store.note.deleteNote(this.state.id, this.store.auth.tokenId)
    }

    // Triggered when the tag is clicked
    onRemoveTagClickedHandler = tag => {
        this.store.deleteTag(this.state.id, tag, this.store.auth.tokenId)
    }

    // Triggered when user presses a key in the tag input
    onTagInputKeyUpHandler = event => {
        if (event.key === "Enter") {
            event.preventDefault()
            if (!this.props.tags.includes(this.state.tagInput.trim())) {
                this.store.note.addTag(
                    this.state.id,
                    [this.state.tagInput.trim()],
                    this.store.auth.tokenId
                )
                this.setState({ ...this.state, tagInput: "" })
            }
        }
    }

    onContentKeyDownHandler = event => {
        if (event.keyCode === 9) {
            event.preventDefault()
            let start = event.target.selectionStart
            let end = event.target.selectionEnd
            let val = event.target.value
            let selected = val.substring(start, end)
            let re, count
            let happened = false

            if (event.shiftKey) {
                re = /^\t/gm
                if (selected.length > 0) {
                    count = -selected.match(re).length
                    event.target.value =
                        val.substring(0, start) +
                        selected.replace(re, "") +
                        val.substring(end)
                } else {
                    const before = val.substring(start - 1, start)
                    if (before === "\t") {
                        event.target.value =
                            val.substring(0, start - 1) + val.substring(start)
                        happened = true
                    }
                }
                // todo: add support for shift-tabbing without a selection
            } else {
                re = /^/gm
                count = selected.match(re).length
                event.target.value =
                    val.substring(0, start) +
                    selected.replace(re, "\t") +
                    val.substring(end)
            }

            if (start === end) {
                event.target.selectionStart = end + count
            } else {
                event.target.selectionStart = start
            }
            if (happened) {
                event.target.selectionStart = start
            }

            event.target.selectionEnd = end + count
            this.setState(
                produce(this.state, draftState => {
                    draftState.content = event.target.value
                })
            )
            this.checkSaveTimer()
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
            const { title, content } = await this.store.note.updateCurrentNote(
                this.state.title,
                this.state.content
            )
            this.props.saveNote(
                this.state.id,
                title,
                content,
                this.store.auth.tokenId
            )
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    render() {
        const deleteNoteButton = (
            <ToolbarButton
                extraClass={classes.ToolIcon}
                onClick={() => this.onDeleteNoteClickedHandler()}
            >
                <FontAwesomeIcon icon={"trash"} fixedWidth />
            </ToolbarButton>
        )
        const tags =
            this.store.note.tags &&
            this.store.note.tags.map(tag => (
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
                value={this.state.tagInput}
                onChange={event =>
                    this.setState({
                        ...this.state,
                        tagInput: event.target.value,
                    })
                }
                onKeyUp={this.onTagInputKeyUpHandler}
                placeholder="Add tag..."
            />
        )

        const emailLink = (
            <a href="" className={classes.Email} onClick={(e) => e.preventDefault()} >{this.store.auth.email}</a>
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
                value={this.state.title}
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
                value={this.state.content}
                onChange={this.onContentChangedHandler}
                onKeyDown={this.onContentKeyDownHandler}
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