import React, { Component, Fragment } from "react"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"
import NoteListItem from "./NoteListItem/NoteListItem"
import classes from "./NoteList.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NoteList extends Component {
    componentDidMount() {
        this.props.getNotes()
    }

    onNoteListItemClickedHandler = id => {
        this.props.setCurrentNote(id)
    }

    onAddNoteButtonClickedHandler = () => {
        this.props.addNote('', '')
    }

    render() {
        const addNoteButton = (
                <button
                    className={classes.AddNote}
                    onClick={this.onAddNoteButtonClickedHandler}
                >
                    <FontAwesomeIcon icon="plus-circle" fixedWidth/>
                </button>
        )

        const toolbar = (
            <div className={classes.Toolbar}>
                {addNoteButton}
            </div>
        )

        const notes = 
                this.props.notes ? (
                    this.props.notes.map(note => (
                        <NoteListItem
                            key={note.id}
                            title={note.title}
                            isSelected={ this.props.currentNote && this.props.currentNote.id === note.id}
                            onClick={() =>
                                this.onNoteListItemClickedHandler(note.id)
                            }
                        >
                            {note.content}
                        </NoteListItem>
                    ))
                ) : <p>No notes found</p>
                
        return (
            <div className={classes.NoteList}>
                {toolbar}
                {notes}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    notes: state.note.notes,
    currentNote: state.note.currentNote,
})

export default connect(
    mapStateToProps,
    {
        getNotes: actions.getNotes,
        setCurrentNote: actions.setCurrentNote,
        addNote: actions.addNote,
        deleteNote: actions.removeNote,
    }
)(NoteList)
