import React, { Component, Fragment } from "react"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"
import NoteListItem from './NoteListItem/NoteListItem'

class NoteList extends Component {
    componentDidMount() {
        this.props.dispatchGetNotes()
    }

    onNoteListItemClickedHandler = (id) => {
        this.props.dispatchSetCurrentNode(id)
    }

    render() {
        return (
            <Fragment>
                {this.props.notes ? (
                    this.props.notes.map(note => 
                        <NoteListItem key={note.id} title={note.title} onClick={() => this.onNoteListItemClickedHandler(note.id)}>{note.content}</NoteListItem>
                        )
                ) : (
                    <p>No notes found</p>
                )}
            </Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    dispatchGetNotes: () => dispatch(actions.getNotes()),
    dispatchSetCurrentNode: (id) => dispatch(actions.setCurrentNote(id))
})

const mapStateToProps = state => ({
    notes: state.note.notes,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoteList)
