import React from 'react'
import classes from './NoteListItem.css'

const noteListItem = (props) => {
  return (
    <div className={classes.NoteListItem} onClick={props.onClick}>
        <h3 className={classes.Title}>{props.title}</h3>
      {props.children}
    </div>
  )
}

export default noteListItem
