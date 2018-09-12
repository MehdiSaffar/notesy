import React, { Component } from "react"
import classes from "./NavBar.css"

class NavBar extends Component {
    render() {
        return <div className={classes.NavBar}>{this.props.children}</div>
    }
}

export default NavBar
