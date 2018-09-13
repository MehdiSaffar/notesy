import React, { Component, Fragment } from "react"
import { produce } from "immer"
import classes from './NoteViewer.css'
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index'

class NoteViewer extends Component {
    state = {
        touched: false,
        id: null,
        title: "",
        content: "",
    }

    static getDerivedStateFromProps(props, state) {
        console.log("getDerivedStateFromProps")
        if(props.id !== undefined && props.id !== state.id) {
            console.log(`received new note from id: ${state.id} to id:${props.id}`)
            const newState = {
                touched: true,
                id: props.id,
                title: props.title,
                content: props.content
            }
            console.log("new state: ", newState)
            return newState
        }
        return null
    }

    onContentChanged = event => {
        // this.props.dispatchUpdateCurrentNote(this.props.title, event.target.value)
        this.setState(produce(this.state, draftState => {
            draftState.content = event.target.value
        }))
    }

    onSaveNote = () => {
        this.props.dispatchUpdateCurrentNote(this.state.title, this.state.content)
    }

    render() {
        return (
            <Fragment>
                <h3>{this.state.title}</h3>
                <textarea
                    value={this.state.content}
                    onChange={this.onContentChanged}
                    className={classes.Content}
                />
                <button onClick={this.onSaveNote}>Save to Redux</button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    dispatchUpdateCurrentNote: (title, content) => dispatch(actions.updateCurrentNote(title, content))
})

const mapStateToProps = state => ({
    id: state.note.currentNote.id,
    title: state.note.currentNote.title,
    content: state.note.currentNote.content,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoteViewer)

