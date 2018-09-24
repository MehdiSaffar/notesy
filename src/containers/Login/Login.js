import React, { Component } from "react"
import Form from "./../../components/UI/Form/Form"
import Button from "./../../components/UI/Form/Button/Button"
import { Redirect } from "react-router"
import classes from "./Login.css"
import { icons } from "./../../icons"
import logoImg from "./logo.jpg"
import { inject, observer } from "mobx-react";

@inject('store')
@observer
class Login extends Component {
    forms = {
        signup: () => ({
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

    onLoginButtonClickedHandler = async event => {
        const email = this.state.form.elements.find(el => el.name === "email")
            .value
        const password = this.state.form.elements.find(
            el => el.name === "password"
        ).value
        this.setState({
            ...this.state,
            isLoginLoading: true,
        })
        try {
            await this.props.store.auth.loginUser(email, password)
            this.setState({ ...this.state, isLoginLoading: false })
        } catch (error) {
            let message =
                "There was an error signing up. Please try again in a moment."
            switch (error.message) {
                case "EMAIL_EXISTS":
                    message = "The email entered already exists!"
                    break
                default:
                    break
            }
            console.log(message)

            this.setState({
                ...this.state,
                error: message,
                isLoginLoading: false,
            })
        }
    }

    onLogoutButtonClickedHandler = event => {
        this.props.logoutUser()
    }

    onFormUpdatedHandler = updatedForm => {
        this.setState({
            form: updatedForm,
        })
    }

    onSignupButtonClickedHandler = async (event) => {
        const email = this.state.form.elements.find(el => el.name === "email")
            .value
        const password = this.state.form.elements.find(
            el => el.name === "password"
        ).value
        try {
            await this.props.signupUser(email, password)
        } catch (error) {
            let message =
                "There was an error signing up. Please try again in a moment."
            switch (error.message) {
                case "EMAIL_EXISTS":
                    message =
                        "There is already an account with this email. Try logging in?"
                    break
                case "WEAK_PASSWORD":
                    message = "Please use a stronger password"
                    break
                default:
                    break
            }
            this.setState({ ...this.state, error: message })
        }
    }

    onChangeFormClickedHandler = event => {
        event.preventDefault()
        if (this.state.form.name === "login") {
            this.setState({ form: this.forms["signup"]() })
        } else {
            this.setState({ form: this.forms["login"]() })
        }
    }

    render() {
        const store = this.props.store
        const redirect = store.auth.isLoggedIn ? <Redirect to="/app" /> : null

        const error = <p>{this.state.error}</p>
        const logo = (
            <div className={classes.Logo}>
                <img src={logoImg} alt="Notesy Logo" />
            </div>
        )
        const innerForm = (
            <Form
                form={this.state.form}
                onFormUpdated={this.onFormUpdatedHandler}
            />
        )
        const buttons =
            this.state.form.name === "login" ? (
                <Button
                    type="submit"
                    btnStyle="Success"
                    extraClasses={[classes.LoginButton]}
                    disabled={
                        store.auth.isLoggedIn || !this.state.form.formIsValid
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
            )
        const formSwitch = (
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
        )
        const form = (
            <div className={classes.Form}>
                {error}
                {innerForm}
                {buttons}
                {formSwitch}
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

export default Login
