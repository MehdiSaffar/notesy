import React, { Component} from "react"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"
import NoteListItem from "./NoteListItem/NoteListItem"
import classes from "./NoteList.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Fuse from "fuse.js"

class NoteList extends Component {
    state = {
        searchText: "",
    }
    componentDidMount() {
        this.props.getNotes(this.props.userId, this.props.idToken)
    }

    onNoteListItemClickedHandler = id => {
        if(this.props.currentNote.id !== id) this.props.setCurrentNote(id)
    }

    onAddNoteButtonClickedHandler = () => {
        this.props.addNote("", "", this.props.userId, this.props.idToken)
    }
    onSearchBarChangedHandler = event => {
        event.preventDefault()
        this.setState({
            ...this.state,
            searchText: event.target.value,
        })
    }

    getSearchResults = () => {
        const searchOptions = {
            shouldSort: true,
            tokenize: true,
            matchAllTokens: true,
            keys: ["title", "content", "tags"],
            // id: 'id'
        }
        const fuse = new Fuse(this.props.notes, searchOptions)
        return fuse.search(this.state.searchText.trim())
    }

    render() {
        const addNoteButton = (
            <button
                className={classes.AddNote}
                onClick={this.onAddNoteButtonClickedHandler}
            >
                <FontAwesomeIcon icon="plus-circle" fixedWidth />
            </button>
        )

        const searchBar = (
            <input
                className={classes.SearchBar}
                onChange={this.onSearchBarChangedHandler}
                value={this.state.searchText}
                placeholder="Search notes..."
            />
        )
        const toolbar = (
            <div className={classes.Toolbar}>
                {addNoteButton} {searchBar}
            </div>
        )

        const finalNotes = this.state.searchText.trim()
            ? this.getSearchResults()
            : this.props.notes
        // console.log(this.getSearchResults())

        const notes = finalNotes ? (
            finalNotes.map(note => (
                <NoteListItem
                    key={note.id}
                    title={note.title}
                    isSelected={
                        this.props.currentNote &&
                        this.props.currentNote.id === note.id
                    }
                    isBusyDeleting={this.props.deletingNote === note.id}
                    onClick={() => this.onNoteListItemClickedHandler(note.id)}
                >
                    {note.content}
                </NoteListItem>
            ))
        ) : (
            <p>No notes found</p>
        )

        return (
            <div className={classes.NoteListAll}>
                {toolbar}
                <div className={classes.NoteList}>{notes}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    notes: state.note.notes,
    currentNote: state.note.currentNote,
    deletingNote: state.note.deletingNote,
    userId: state.auth.localId,
    idToken: state.auth.idToken,
})

export default connect(
    mapStateToProps,
    {
        getNotes: actions.getNotes,
        setCurrentNote: actions.setCurrentNote,
        addNote: actions.addNote,
        deleteNote: actions.removeNote,
        addTag: actions.addTag,
    }
)(NoteList)
