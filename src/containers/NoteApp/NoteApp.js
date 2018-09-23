import React, { Component } from "react"
import NoteList from "../NoteList/NoteList"
import NoteEditor from "../NoteEditor/NoteEditor";
import classes from "./NoteApp.css"

class NoteApp extends Component {
    render() {
        return (
            <div className={classes.Container}>
                <div className={[classes.Split, classes.Left].join(" ")}>
                    <NoteList />
                </div>
                {<div className={classes.Separator} /> }
                <div className={[classes.Split, classes.Right].join(" ")}>
                    <NoteEditor />
                </div>
            </div>
        )
    }
}

export default NoteApp
