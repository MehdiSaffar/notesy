import React from 'react'
import { NavLink } from 'react-router-dom';
import classes from './NavItem.css'
import {withRouter} from 'react-router'

const navItem = (props) => {
  return (
    <div className={classes.NavItem}>
        <NavLink to={props.to} onClick={props.onClick}>{props.children}</NavLink>
    </div>
  )
}

export default withRouter(navItem)
