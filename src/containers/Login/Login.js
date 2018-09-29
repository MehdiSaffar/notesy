import React, { Component, Fragment} from "react"
import Form from "./../../components/UI/Form/Form"
import Button from "./../../components/UI/Form/Button/Button"
import { Redirect } from "react-router"
import classes from "./Login.css"
import { icons } from "./../../icons"
import logoImg from "./logo.jpg"
import { observable } from "mobx"
import { inject, observer } from "mobx-react"
import { runInAction } from "mobx"
import Spinner from './../../components/UI/Spinner/Spinner';

@inject("store")
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
                        autoComplete: 'password'
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
                        autofill: 'off',
                        autoComplete: 'off'
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
                        autoComplete: 'email'
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
                        autoComplete: 'password'
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

    @observable
    form = this.forms["login"]()
    @observable
    error = null
    @observable
    isLoginLoading = false

    onLoginButtonClickedHandler = async event => {
        console.info('onLoginButtonClickedHandler')
        const email = this.form.elements.find(el => el.name === "email")
            .value
        const password = this.form.elements.find(
            el => el.name === "password"
        ).value
        this.isLoginLoading = true
        try {
            const tokenId = await this.props.store.auth.getTokenId(email, password)
            const isVerified = await this.props.store.auth.isEmailVerified(tokenId)
            // no need to set it again
            // runInAction(() => {
            //     this.isLoginLoading = false
            // })
            if(isVerified) {
                // alert("Your email is verified")
                await this.props.store.auth.loginUser(email, password)
            }
            else {
                alert("Your email is NOT verified")
                await this.props.store.auth.sendVerificationEmail(tokenId)
            }
        } catch (error) {
            let message =
                "There was an error signing up. Please try again in a moment."
            switch (error.response.data.error.message) {
                case "EMAIL_NOT_FOUND":
                    message = "There is no account with this email. Try signing up?"
                    break;
                case "INVALID_PASSWORD":
                    message = "The password your entered is not valid."
                    break;
                case "USER_DISABLED":
                    message = "The account associated with this email has been disabled. Please contact an administrator."
                    break;
                default:
                    break
            }
            console.log(message)

            runInAction(() => {
                this.error = message
                this.isLoginLoading = false
            })
        }
    }

    onLogoutButtonClickedHandler = event => {
        this.props.store.auth.logoutUser()
    }

    onFormUpdatedHandler = updatedForm => {
        this.form = updatedForm
    }

    onSignupButtonClickedHandler = async event => {
        console.info('onSignupButtonClickedHandler')
        const email = this.form.elements.find(el => el.name === "email").value
        const password = this.form.elements.find(el => el.name === "password")
            .value
        try {
            const signupResponse = await this.props.store.auth.signupUser(email, password)
            await this.props.store.auth.sendVerificationEmail(signupResponse.tokenId)
            alert("Verification email has been sent to " + signupResponse.email)
        } catch (error) {
            // error = error.response.data
            let message =
                "There was an error signing up. Please try again in a moment."
            switch (error.response.data.error.message) {
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
            this.error = message
        }
    }

    onChangeFormClickedHandler = event => {
        event.preventDefault()
        if (this.form.name === "login") {
            this.form = this.forms["signup"]()
        } else {
            this.form = this.forms["login"]()
        }
        this.error = null
    }

    render() {
        const store = this.props.store
        const redirect = store.auth.isLoggedIn ? <Redirect to="/app" /> : null

        const error = <p>{this.error}</p>
        const logo = (
            <div className={classes.Logo}>
                <img src={logoImg} alt="Notesy Logo" />
            </div>
        )
        const innerForm = (
            <Form
                form={this.form}
                onFormUpdated={this.onFormUpdatedHandler}
            />
        )
        const buttons =
            this.form.name === "login" ? (
                <Button
                    type="submit"
                    btnStyle="Success"
                    extraClasses={[classes.LoginButton]}
                    disabled={
                        store.auth.isLoggedIn || !this.form.formIsValid
                    }
                    onClick={this.onLoginButtonClickedHandler}
                >
                    Login
                </Button>
            ) : (
                <Button
                    type="submit"
                    btnStyle="Success"
                    extraClasses={[classes.LoginButton]}
                    disabled={!this.form.formIsValid}
                    onClick={this.onSignupButtonClickedHandler}
                >
                    Signup
                </Button>
            )
        const formSwitch = (
            <p>
                {this.form.name === "login" ? (
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
              {!this.isLoginLoading ? 
                  <Fragment>
                    {error}
                    <form onSubmit={(e) => e.preventDefault()}>
                        {innerForm}
                        {buttons}
                        {formSwitch}
                    </form>
                  </Fragment>
                : <Spinner />
              }

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
