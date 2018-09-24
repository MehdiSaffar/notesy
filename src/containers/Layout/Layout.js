import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router"
import Login from "../Login/Login"
import MainPage from "../MainPage/MainPage"
import NoteApp from "../NoteApp/NoteApp"
import NavItem from "./../../components/UI/NavBar/NavItem/NavItem"
import classes from "./Layout.css"
import { withRouter } from "react-router"
import { observer, inject} from "mobx-react";

@inject('store')
@observer
class Layout extends Component {
    render() {
        const store = this.props.store
        const navigationBar = (
            <div className={classes.NavBar}>
                {store.auth.isLoggedIn && (
                    <NavItem to="/logout" onClick={store.auth.logoutUser}>
                        Logout
                    </NavItem>
                )}
                {store.auth.isLoggedIn && <NavItem to="/app">Notes</NavItem>}
                {store.auth.isLoggedIn || <NavItem to="/login">Login</NavItem>}
                <NavItem to="/">Main page</NavItem>
            </div>
        )

        const main = (
            <div className={classes.Content}>
                <Switch>
                    <Route path="/login" exact component={Login} />
                    {store.auth.isLoggedIn ? (
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
                <p>{store.note.status}</p>
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
