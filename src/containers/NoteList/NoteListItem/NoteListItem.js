import React, { Fragment } from "react"
import classes from "./NoteListItem.css"

const noteListItem = props => {
    let cls = [classes.NoteListItem]
    if (props.isSelected) {
        cls.push(classes.Selected)
    }
    const title = props.title
    const content = props.children
    const emptyNote = <i>Empty Note</i>
    const isBusyDeleting = props.isBusyDeleting
    if (isBusyDeleting) {
        cls.push(classes.BusyDeleting)
    }
    const isEmpty = props.title === "" && props.children === ""
    if (isEmpty) {
        cls.push(classes.EmptyNote)
    }

    return (
        <div className={cls.join(" ")} onClick={props.onClick}>
            {isEmpty ? (
                emptyNote
            ) : (
                <Fragment>
                    <h3 className={classes.Title}>{title}</h3>
                    {content}
                </Fragment>
            )}
        </div>
    )
}

export default noteListItem
