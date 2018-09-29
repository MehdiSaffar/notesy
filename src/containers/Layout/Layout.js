import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router"
import Login from "../Login/Login"
import MainPage from "../MainPage/MainPage"
import NoteApp from "../NoteApp/NoteApp"
import NavItem from "./../../components/UI/NavBar/NavItem/NavItem"
import classes from "./Layout.css"
import { withRouter } from "react-router"
import { observer, inject } from "mobx-react"
import { computed } from "mobx"

@inject('store')
@observer
class Layout extends Component {
    @computed
    get auth() {
        return this.props.store.auth
    }
    @computed
    get note() {
        return this.props.store.note
    }
    render() {
        const navigationBar = (
            <div className={classes.NavBar}>
                {this.auth.isLoggedIn && (
                    <NavItem to="/logout" onClick={this.auth.logoutUser}>
                        Logout
                    </NavItem>
                )}
                {this.auth.isLoggedIn && <NavItem to="/app">Notes</NavItem>}
                {this.auth.isLoggedIn || <NavItem to="/login">Login</NavItem>}
                <NavItem to="/">Main page</NavItem>
            </div>
        )

        const main = (
            <div className={classes.Content}>
                <Switch>
                    <Route path="/login" exact component={Login} />
                    {this.auth.isLoggedIn ? (
                        <Route path="/app" exact component={NoteApp} />
                    ) : (
                        <Redirect to="/login" />
                    )}
                    <Route path="/" exact component={MainPage} />
                </Switch>
            </div>
        )

        const footer = (
            <div className={classes.Footer}>
                <p>{this.note.status}</p>
            </div>
        )

        return (
            <div className={classes.Layout}>
                {navigationBar}
                {main}
                {footer}
            </div>
        )
    }
}

export default withRouter(Layout)
