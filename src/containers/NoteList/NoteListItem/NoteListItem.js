import React from 'react'
import classes from './NoteListItem.css'

const noteListItem = (props) => {
    let cls = [classes.NoteListItem]
    if(props.isSelected) {
        cls.push(classes.Selected)
    }
  return (
    <div className={cls.join(' ')} onClick={props.onClick}>
        <button className={[classes.CloseButton, 'fa fa-close'].join(' ')} onClick={props.onCloseButtonClicked}/>
        <h3 className={classes.Title}>{props.title}</h3>
      {props.children}
    </div>
  )
}

export default noteListItem
