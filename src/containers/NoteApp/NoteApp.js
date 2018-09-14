import React, { Component, Fragment } from "react"
import NoteList from "../NoteList/NoteList"
import NoteViewer from "../NoteViewer/NoteViewer"
import classes from "./NoteApp.css"

class NoteApp extends Component {
    render() {
        return (
            <div className={classes.Container}>
                <div className={[classes.Split, classes.Left].join(" ")}>
                    <NoteList />
                </div>
                <div className={classes.Separator} />
                <div className={[classes.Split, classes.Right].join(" ")}>
                    <NoteViewer />
                </div>
            </div>
        )
    }
}

export default NoteApp
