import React from "react"
import { NavLink } from "react-router-dom"
import classes from "./NavItem.css"
import { withRouter } from "react-router"

const navItem = props => {
    return (
            <NavLink
                to={props.to}
                exact
                onClick={props.onClick}
                activeClassName={[classes.NavItem, classes.active].join(' ')}
            className={classes.NavItem}
            >
                {props.children}
            </NavLink>
    )
}

export default withRouter(navItem)
