import React, { Component, Fragment } from "react"
import Form from "./../../components/UI/Form/Form"
import Button from "./../../components/UI/Form/Button/Button"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"

class Login extends Component {
    loginForm = () => ({
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
        isLoginForm: true,
        form: this.signUpForm(),
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
        this.props.dispatchLoginUser(email, password)
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
        this.props.dispatchSignupUser(email, password)
    }

    onChangeFormClickedHandler = event => {
        event.preventDefault()
        if (this.state.isLoginForm) {
            this.setState({ form: this.signUpForm(), isLoginForm: false })
        } else {
            this.setState({ form: this.loginForm(), isLoginForm: true })
        }
    }

    render() {
        return (
            <Fragment>
                <Form
                    form={this.state.form}
                    // onFormValidChanged={this.onFormValidChanged}
                    onFormUpdated={this.onFormUpdatedHandler}
                />
                {this.state.isLoginForm ? (
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
                    {this.state.isLoginForm ? (
                        <a href="" onClick={this.onChangeFormClickedHandler}>
                            Not signed up? Sign up now!
                        </a>
                    ) : (
                        <a href="" onClick={this.onChangeFormClickedHandler}>
                            Already have an account? Login now!
                        </a>
                    )}
                </p>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
})

const mapDispatchToProps = dispatch => ({
    dispatchLoginUser: (email, password) =>
        dispatch(actions.loginUser(email, password)),
    dispatchSignupUser: (email, password) =>
        dispatch(actions.signupUser(email, password)),
    dispatchLogoutUser: _ => dispatch(actions.logoutUser()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
