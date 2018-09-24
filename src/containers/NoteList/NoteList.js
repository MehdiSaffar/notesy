import React, { Component } from "react"
import NoteListItem from "./NoteListItem/NoteListItem"
import classes from "./NoteList.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Fuse from "fuse.js"
import ToolbarInput from "./../../components/UI/Form/Input/ToolbarInput"
import ToolbarButton from "./../../components/UI/Form/Button/ToolbarButton"
import { observer, inject} from 'mobx-react';

@inject('store')
@observer
export default class NoteList extends Component {
    state = {
        searchText: "",
    }
    componentDidMount() {
        const userId = this.props.store.auth.userId
        const tokenId =  this.props.store.auth.tokenId
        this.props.store.note.getNotes(userId, tokenId)
    }

    onNoteListItemClickedHandler = id => {
        // No point in sending action if same selected
        if (this.props.store.note.currentNote.id !== id) {
            this.props.store.note.setCurrentNote(id)
        }
    }

    onAddNoteButtonClickedHandler = () => {
        this.props.addNote("", "", this.props.store.auth.userId, this.props.store.auth.idToken)
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
        }
        const fuse = new Fuse(this.props.store.note.notes, searchOptions)
        return fuse.search(this.state.searchText.trim())
    }

    render() {
        const store = this.props.store

        const addNoteButton = (
            <ToolbarButton extraClass={classes.AddNote} onClick={this.onAddNoteButtonClickedHandler}>
                <FontAwesomeIcon icon="plus-circle" fixedWidth />
            </ToolbarButton>
        )

        const searchBar = (
            <ToolbarInput
                extraClass={classes.SearchBar}
                onChange={this.onSearchBarChangedHandler}
                value={this.state.searchText}
                placeholder="Search notes..."
            />
        )
        const toolbar = (
            <div className={classes.Toolbar}>
                {searchBar}
                {addNoteButton}
            </div>
        )

        const finalNotes = this.state.searchText.trim()
            ? this.getSearchResults()
            : store.note.notes

        const notes = finalNotes ? (
            finalNotes.map(note => (
                <NoteListItem
                    key={note.id}
                    title={note.title}
                    isSelected={
                        store.note.currentNote &&
                        store.note.currentNote.id === note.id
                    }
                    isBusyDeleting={store.note.deletingNote === note.id}
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