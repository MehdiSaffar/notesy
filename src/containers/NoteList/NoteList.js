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
    @computed
    get auth() {
        return this.props.store.auth
    }
    @computed
    get note() {
        return this.props.store.note
    }

    @observable searchText = ''
    // @computed get note() { return this.note}
    componentDidMount() {
        const userId = this.auth.userId
        const tokenId =  this.auth.tokenId
        this.note.getNotes(userId, tokenId)
    }

    onNoteListItemClickedHandler = id => {
        // No point in sending action if same selected
        if (this.note.currentNote.id !== id) {
            this.note.setCurrentNote(id)
        }
    }

    onAddNoteButtonClickedHandler = () => {
        this.note.addNote("", "", this.auth.userId, this.auth.tokenId)
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
        const fuse = new Fuse(this.note.notes, searchOptions)
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
                    state={note.state}
                    onClick={() =>  this.onNoteListItemClickedHandler(note.id)}
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