import React, { Component, Fragment } from "react"
import { Switch, Route, Redirect } from "react-router"
import Login from "../Login/Login"
import MainPage from "../MainPage/MainPage"
import NoteApp from "../NoteApp/NoteApp"
import NavItem from "./../../components/UI/NavBar/NavItem/NavItem"
import classes from "./Layout.css"
import { connect } from "react-redux"
import * as actions from "./../../store/actions/index"
import { withRouter } from "react-router"

class Layout extends Component {
    render() {
        const navigationBar = (
            <div className={classes.NavBar}>
                {this.props.isLoggedIn && <NavItem to="/logout" onClick={() => this.props.logoutUser()}>
                    Logout
                </NavItem>}
                {this.props.isLoggedIn && <NavItem to="/app">Notes</NavItem>}
                {this.props.isLoggedIn || <NavItem to="/login">Login</NavItem>}
                <NavItem to="/">Main page</NavItem>
            </div>
        )

        const main = (
                <div className={classes.Content}>
                    <Switch>
                        <Route path="/login" exact component={Login} />
                        {this.props.isLoggedIn ? (
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
                <p style={{margin: '0'}}>Some kind of status bar</p>
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

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
})

export default withRouter(
    connect(
        mapStateToProps,
        {
            logoutUser: actions.logoutUser
        }
    )(Layout)
)
