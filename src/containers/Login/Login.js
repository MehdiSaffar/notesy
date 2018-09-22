import React, { Component, Fragment } from "react"
import Form from "./../../components/UI/Form/Form"
import Button from "./../../components/UI/Form/Button/Button"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"
import { Redirect } from "react-router"
import classes from "./Login.css"
import { icons } from "./../../icons"
import { produce } from "immer"
import logo from "./logo.jpg"

class Login extends Component {
    forms = {
        "signup": () => ({
            name: "signup",
            elements: [
                {
                    name: "email",
                    label: "Email",
                    icon: icons.envelope,
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
                    icon: icons.lock,
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
                {
                    name: "retypePassword",
                    label: "",
                    icon: null,
                    value: "",
                    isTouched: false,
                    isValid: false,
                    elementConfig: {
                        type: "password",
                        placeholder: "Retype password",
                    },
                    validation: {
                        isEmail: false,
                        isRequired: true,
                        mustMatch: "password",
                    },
                },
            ],
            formIsValid: false,
        }),
        login: () => ({
            name: "login",
            elements: [
                {
                    name: "email",
                    label: "Email",
                    icon: icons.envelope,
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
                    icon: icons.lock,
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
        }),
    }
    state = {
        form: this.forms["login"](),
        error: null,
    }

    onLoginButtonClickedHandler = event => {
        const email = this.state.form.elements.find(el => el.name === "email")
            .value
        const password = this.state.form.elements.find(
            el => el.name === "password"
        ).value
        this.setState({
            ...this.state,
            isLoginLoading: true,
        })
        this.props
            .loginUser(email, password, this.onUserLoggedInHandler)
            .then(() => {
                this.setState({ ...this.state, isLoginLoading: false })
            })
            .catch((error) => {
                let message = error.message
                if (error.message.indexOf(" "))
                    message = error.message.substr(
                        0,
                        error.message.indexOf(" ")
                    )
                console.log(error)
                switch (message) {
                    default:
                        message =
                            "There was an error signing up. Please try again in a moment."
                        break
                }

                this.setState({ ...this.state, error: message, isLoginLoading: false })
            })
    }

    onLogoutButtonClickedHandler = event => {
        this.props.logoutUser()
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
        this.props
            .signupUser(email, password)
            .then(() => null)
            .catch(error => {
                let message = error.message
                if (error.message.indexOf(" "))
                    message = error.message.substr(
                        0,
                        error.message.indexOf(" ")
                    )
                console.log(error)
                switch (message) {
                    case "EMAIL_EXISTS":
                        message =
                            "There is already an account with this email. Try logging in?"
                        break
                    case "WEAK_PASSWORD":
                        message = "Please use a stronger password"
                        break
                    default:
                        message =
                            "There was an error signing up. Please try again in a moment."
                        break
                }
                this.setState({ ...this.state, error: message })
            })
    }

    onUserSignedUpHandler = () => {}

    onUserLoggedInHandler = () => {}

    onChangeFormClickedHandler = event => {
        event.preventDefault()
        if (this.state.form.name === "login") {
            this.setState({ form: this.forms["signup"]() })
        } else {
            this.setState({ form: this.forms["login"]() })
        }
    }

    render() {
        const redirect = this.props.isLoggedIn ? <Redirect to="/app" /> : null
        // const redirect = null

        const error = this.state.error
        const form = (
            <div className={classes.Form}>
                <div className={classes.Logo}>
                    <img src={logo} alt="Notesy Logo" />
                </div>
                <p>{error}</p>
                <Form
                    form={this.state.form}
                    onFormUpdated={this.onFormUpdatedHandler}
                />
                {this.state.form.name === "login" ? (
                    <Button
                        type="submit"
                        btnStyle="Success"
                        extraClasses={[classes.LoginButton]}
                        disabled={
                            this.props.isLoggedIn ||
                            !this.state.form.formIsValid
                        }
                        onClick={this.onLoginButtonClickedHandler}
                    >
                        Login
                    </Button>
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
        return (
            <div className={classes.Login}>
                {redirect}
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
})

export default connect(
    mapStateToProps,
    {
        loginUser: actions.loginUser,
        signupUser: actions.signupUser,
        logoutUser: actions.logoutUser,
    }
)(Login)
