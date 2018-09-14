import React, { Component, Fragment } from "react"
import Form from "./../../components/UI/Form/Form"
import Button from "./../../components/UI/Form/Button/Button"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"
import { Redirect } from 'react-router'
import classes from './Login.css'

class Login extends Component {
    loginForm = () => ({
        name: "login",
        elements: [
            {
                name: "email",
                label: "Email",
                value: "",
                isTouched: false,
                isValid: false,
                elementConfig: {
                    type: "text",
                    placeholder: "Email Address",
                },
                validation: {
                    isEmail: true,
                    isRequired: true,
                },
            },
            {
                name: "password",
                label: "Password",
                value: "",
                isTouched: false,
                isValid: false,
                elementConfig: {
                    type: "password",
                    placeholder: "Password",
                },
                validation: {
                    isEmail: false,
                    isRequired: true,
                },
            },
        ],
        formIsValid: false,
    })

    signUpForm = () => ({
        name: "signup",
        elements: [
            {
                name: "email",
                label: "Email",
                value: "",
                isTouched: false,
                isValid: false,
                elementConfig: {
                    type: "text",
                    placeholder: "Email Address",
                },
                validation: {
                    isEmail: true,
                    isRequired: true,
                },
            },
            {
                name: "password",
                label: "Password",
                value: "",
                isTouched: false,
                isValid: false,
                elementConfig: {
                    type: "password",
                    placeholder: "Password",
                },
                validation: {
                    isEmail: false,
                    isRequired: true,
                },
            },
        ],
        formIsValid: false,
    })

    state = {
        form: this.loginForm(),
    }

    // onFormValidChanged = newValidValue => {
    //     this.setState({ ...this.state, formIsValid: newValidValue })
    // }

    onLoginButtonClickedHandler = event => {
        const email = this.state.form.elements.find(el => el.name === "email")
            .value
        const password = this.state.form.elements.find(
            el => el.name === "password"
        ).value
        this.props.dispatchLoginUser(email, password, this.onUserLoggedInHandler)
    }

    onLogoutButtonClickedHandler = event => {
        this.props.dispatchLogoutUser()
    }

    onFormUpdatedHandler = updatedForm => {
        this.setState({
            form: updatedForm,
        })
    }

    onSignupButtonClickedHandler = event => {
        const email = this.state.form.elements.find(el => el.name === "email")
            .value
        const password = this.state.form.elements.find(
            el => el.name === "password"
        ).value
        this.props.dispatchSignupUser(
            email,
            password,
            this.onUserSignedUpHandler
        )
    }

    onUserSignedUpHandler = () => {
        
    }

    onUserLoggedInHandler = () => {
        
    }

    onChangeFormClickedHandler = event => {
        event.preventDefault()
        if (this.state.isLoginForm) {
            this.setState({ form: this.signUpForm() })
        } else {
            this.setState({ form: this.loginForm() })
        }
    }

    render() {
        const redirect = this.props.isLoggedIn ? <Redirect to="/app" /> : null
        return (
            <div className={classes.Login}>
                {redirect}
                <Form
                    form={this.state.form}
                    // onFormValidChanged={this.onFormValidChanged}
                    onFormUpdated={this.onFormUpdatedHandler}
                />
                {this.state.form.name === "login" ? (
                    <Fragment>
                        <Button
                            type="submit"
                            btnStyle="Success"
                            disabled={
                                this.props.isLoggedIn ||
                                !this.state.form.formIsValid
                            }
                            onClick={this.onLoginButtonClickedHandler}
                        >
                            Login
                        </Button>
                        <Button
                            type="submit"
                            btnStyle="Danger"
                            disabled={!this.props.isLoggedIn}
                            onClick={this.onLogoutButtonClickedHandler}
                        >
                            Logout
                        </Button>
                    </Fragment>
                ) : (
                    <Button
                        type="submit"
                        btnStyle="Success"
                        disabled={!this.state.form.formIsValid}
                        onClick={this.onSignupButtonClickedHandler}
                    >
                        Signup
                    </Button>
                )}
                <p>
                    {this.props.isLoggedIn
                        ? "You are logged in!"
                        : "You are NOT logged in!"}
                </p>
                <p>
                    {this.state.form.name === "login" ? (
                        <a href="" onClick={this.onChangeFormClickedHandler}>
                            Not signed up? Sign up now!
                        </a>
                    ) : (
                        <a href="" onClick={this.onChangeFormClickedHandler}>
                            Already have an account? Login now!
                        </a>
                    )}
                </p>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
})

const mapDispatchToProps = dispatch => ({
    dispatchLoginUser: (email, password, callback) =>
        dispatch(actions.loginUser(email, password, callback)),
    dispatchSignupUser: (email, password, callback) =>
        dispatch(actions.signupUser(email, password, callback)),
    dispatchLogoutUser: _ => dispatch(actions.logoutUser()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
