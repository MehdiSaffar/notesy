import React from 'react'
import classes from './NoteListItem.css'

const noteListItem = (props) => {
    let cls = [classes.NoteListItem]
    if(props.isSelected) {
        cls.push(classes.Selected)
    }
    const title = props.title === '' ? "Title" : props.title
    const content = props.children === '' ? "Content" : props.children
    const isBusyDeleting = props.isBusyDeleting;
    if(isBusyDeleting) {
        cls.push(classes.BusyDeleting)
    }

  return (
    <div className={cls.join(' ')} onClick={props.onClick}>
        <h3 className={classes.Title}>{title}</h3>
      {content}
    </div>
  )
}

export default noteListItem
