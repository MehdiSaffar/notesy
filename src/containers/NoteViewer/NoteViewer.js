import React, { Component, Fragment } from "react"
import { produce } from "immer"
import classes from "./NoteViewer.css"
import { connect } from "react-redux"
import * as actions from "../../store/actions/index"

const SAVE_TIME = 2000

class NoteViewer extends Component {
    timer = null
    state = {
        id: null,
        title: "",
        content: "",
    }
    contentTextarea = React.createRef()

    static getDerivedStateFromProps(props, state) {
        console.log("getDerivedStateFromProps")
        if (props.id !== undefined && props.id !== state.id) {
            console.log(
                `received new note from id: ${state.id} to id:${props.id}`
            )
            const newState = {
                id: props.id,
                title: props.title,
                content: props.content,
            }
            console.log("new state: ", newState)
            return newState
        }
        return null
    }

    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer)
    }

    onContentChanged = event => {
        this.setState(
            produce(this.state, draftState => {
                draftState.content = event.target.value
            })
        )
        this.checkSaveTimer()
    }

    checkSaveTimer = () => {
        if (this.timer !== null) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.onSaveNote()
        }, SAVE_TIME)
    }

    onSaveNote = async () => {
        const { title, content } = await this.props.updateCurrentNote(
            this.state.title,
            this.state.content
        )

        this.props.saveNote(this.state.id, title, content)
    }
    onTitleChangedHandler = event => {
        this.setState(
            produce(this.state, draftState => {
                draftState.title = event.target.value
            })
        )
        this.checkSaveTimer()
    }

    render() {
        return (
            <div className={classes.NoteViewer}>
                <input
                    className={classes.Title}
                    type="text"
                    placeholder="Title"
                    value={this.state.title}
                    onChange={this.onTitleChangedHandler}
                    onKeyDown={e => {
                        e.preventDefault()
                        if (e.key === "Enter") {
                            this.contentTextarea.current.selectionEnd = 0
                            this.contentTextarea.current.focus()
                        }
                    }}
                />
                <textarea
                    ref={this.contentTextarea}
                    value={this.state.content}
                    onChange={this.onContentChanged}
                    className={classes.Content}
                />
            </div>
        )
    }
}

// const mapDispatchToProps = dispatch => ({
//     dispatchUpdateCurrentNote: (title, content) =>
//         dispatch(actions.updateCurrentNote(title, content)),
//     dispatchSaveCurrentNote: (id, title, content) =>
//         dispatch(actions.saveNote(id, title, content)),
// })

const mapStateToProps = state => ({
    id: state.note.currentNote.id,
    title: state.note.currentNote.title,
    content: state.note.currentNote.content,
})

export default connect(
    mapStateToProps,
    {
        saveNote: actions.saveNote,
        addNote: actions.addNote,
        updateCurrentNote: actions.updateCurrentNote,
    }
)(NoteViewer)
