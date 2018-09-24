import React, { Component } from "react"
import NoteListItem from "./NoteListItem/NoteListItem"
import classes from "./NoteList.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Fuse from "fuse.js"
import ToolbarInput from "./../../components/UI/Form/Input/ToolbarInput"
import ToolbarButton from "./../../components/UI/Form/Button/ToolbarButton"
import { observer, inject} from 'mobx-react';
import { observable, computed } from "mobx";

@inject('store')
@observer
export default class NoteList extends Component {
    @computed get store() { return this.props.store}
    @observable searchText = ''
    // @computed get note() { return this.props.store.note}
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
        this.store.note.addNote("", "", this.store.auth.userId, this.store.auth.tokenId)
    }

    onSearchBarChangedHandler = event => {
        event.preventDefault()
        this.searchText = event.target.value
    }

    getSearchResults = () => {
        const searchOptions = {
            shouldSort: true,
            tokenize: true,
            matchAllTokens: true,
            keys: ["title", "content", "tags"],
        }
        const fuse = new Fuse(this.props.store.note.notes, searchOptions)
        return fuse.search(this.searchText.trim())
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
                value={this.searchText}
                placeholder="Search notes..."
            />
        )
        const toolbar = (
            <div className={classes.Toolbar}>
                {searchBar}
                {addNoteButton}
            </div>
        )

        const finalNotes = this.searchText.trim()
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