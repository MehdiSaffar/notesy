import React, { Component } from "react"
import { produce } from "immer"
import classes from "./NoteEditor.css"
import { connect } from "react-redux"
import * as actions from "../../store/actions/index"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Changing a note data triggers a timer with SAVE_TIME amount in milliseconds to trigger a save
const SAVE_TIME = 150

class NoteEditor extends Component {
    // Changing a note data triggers a timer with SAVE_TIME amount in milliseconds to trigger a save
    saveTimer = null

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
        if (props.id === undefined && state.id !== undefined) {
            return {
                ...state,
                id: null,
                title: "",
                content: "",
                tags: [],
            }
        }
        if (props.id !== undefined && props.id !== state.id) {
            // console.log(
            //     `received new note from id: ${state.id} to id:${props.id}`
            // )
            const newState = {
                id: props.id,
                title: props.title,
                content: props.content,
                tags: props.tags,
            }
            // console.log("new state: ", newState)
            return newState
        }
        if (props.tags !== state.tags) {
            const newState = {
                ...state,
                tags: props.tags,
            }
            return newState
        }
        return null
    }

    componentWillUnmount() {
        // Clear timeout to avoid any unexpected save
        if (this.saveTimer) clearTimeout(this.saveTimer)
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

    checkSaveTimer = () => {
        if (this.saveTimer !== null) {
            clearTimeout(this.saveTimer)
        }
        this.saveTimer = setTimeout(() => {
            this.updateNoteAndSaveNote()
        }, SAVE_TIME)
    }

    updateNoteAndSaveNote = async () => {
        const { title, content } = await this.props.updateCurrentNote(
            this.state.title,
            this.state.content
        )

        this.props.saveNote(this.state.id, title, content, this.props.idToken)
    }

    onDeleteNoteClickedHandler = () => {
        this.props.deleteNote(this.state.id, this.props.idToken)
    }
    onRemoveTagClickedHandler = tag => {
        this.props.deleteTag(this.state.id, tag, this.props.idToken)
    }
    onTagInputKeyUpHandler = event => {
        if (event.key === "Enter") {
            event.preventDefault()
            if (!this.props.tags.includes(this.state.tagInput.trim())) {
                this.props.addTag(this.state.id, [this.state.tagInput.trim()], this.props.idToken)
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

    render() {
        const toolbar = (
            <div className={classes.Toolbar}>
                <button
                    className={classes.ToolIcon}
                    onClick={() => this.onDeleteNoteClickedHandler()}
                >
                    <FontAwesomeIcon icon={"trash"} fixedWidth />
                </button>
                {this.props.tags &&
                    this.props.tags.map(tag => (
                        <div
                            className={classes.Tag}
                            key={tag}
                            onClick={() => this.onRemoveTagClickedHandler(tag)}
                        >
                            {tag}
                        </div>
                    ))}
                <input
                    className={classes.TagInput}
                    value={this.state.tagInput}
                    onChange={event =>
                        this.setState({
                            ...this.state,
                            tagInput: event.target.value,
                        })
                    }
                    onKeyUp={this.onTagInputKeyUpHandler}
                    placeholder="Add tag here..."
                />
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

const mapStateToProps = state => ({
    id: state.note.currentNote.id,
    title: state.note.currentNote.title,
    content: state.note.currentNote.content,
    tags: state.note.currentNote.tags,
    idToken: state.auth.idToken,
    userId: state.auth.localId,
})

export default connect(
    mapStateToProps,
    {
        saveNote: actions.saveNote,
        deleteNote: actions.removeNote,
        updateCurrentNote: actions.updateCurrentNote,
        updateStatus: actions.updateStatus,
        addTag: actions.addTag,
        deleteTag: actions.deleteTag,
    }
)(NoteEditor)
