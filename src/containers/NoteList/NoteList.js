import React, { Component, Fragment } from "react"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"
import NoteListItem from "./NoteListItem/NoteListItem"
import classes from "./NoteList.css"
import classes2 from "./NoteListItem/NoteListItem.css"

class NoteList extends Component {
    componentDidMount() {
        this.props.getNotes()
    }

    onNoteListItemClickedHandler = id => {
        this.props.setCurrentNote(id)
    }

    onAddNoteButtonClickedHandler = async () => {
        // const {title, content} = await 
        this.props.addNote('New title', 'New content')
    }

    render() {
        return (
            <div className={classes.NoteList}>
                <button
                    className={classes2.NoteListItem}
                    type="button"
                    onClick={this.onAddNoteButtonClickedHandler}
                >
                    Add note
                </button>
                {this.props.notes ? (
                    this.props.notes.map(note => (
                        <NoteListItem
                            key={note.id}
                            title={note.title}
                            onClick={() =>
                                this.onNoteListItemClickedHandler(note.id)
                            }
                        >
                            {note.content}
                        </NoteListItem>
                    ))
                ) : (
                    <p>No notes found</p>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    notes: state.note.notes,
})

export default connect(
    mapStateToProps,
    {
        getNotes: actions.getNotes,
        setCurrentNote: actions.setCurrentNote,
        addNote: actions.addNote,
    }
)(NoteList)
