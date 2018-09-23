import React, { Component, Fragment } from "react"
import Input from "./Input/Input"
import produce from "immer"
import classes from "./Form.css"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

class Form extends Component {
    checkInputValidity = (value, validation) => {
        const errors = []
        if (validation.minLength) {
            if (!(value.length >= validation.minLength)) {
                errors.push({ code: "minLength" })
            }
        }

        if (validation.maxLength) {
            if (!(value.length <= validation.minLength)) {
                errors.push({ code: "maxLength" })
            }
        }

        if (validation.isRequired) {
            if (value.trim() === "") {
                errors.push({ code: "isRequired" })
            }
        }

        if (validation.isEmail) {
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!pattern.test(value)) {
                errors.push({ code: "isEmail" })
            }
        }

        if (validation.isNumeric) {
            const pattern = /^\d+$/
            if (!pattern.test(value)) {
                errors.push({ code: "isNumeric" })
            }
        }

        if (validation.mustMatch) {
            const targetName = validation.mustMatch
            const target = this.props.form.elements.find(
                el => el.name === targetName
            )
            if (target) {
                if (target.value !== value) {
                    errors.push({ code: "mustMatch", target: targetName })
                }
            } else {
                console.log(
                    "Target " + targetName + " could not be found in form!"
                )
            }
        }

        return errors
    }

    checkFormValidity = form => {
        for (let input of form) {
            const isValid = input.isValid
            const isRequired = input.validation.isRequired
            if (isRequired && !isValid) return false
        }
        return true
    }

    onInputChangedHandler = (event, index) => {
        const updatedForm = produce(this.props.form, dForm => {
            const draftForm = dForm.elements
            const inputErrors = this.checkInputValidity(
                event.target.value,
                draftForm[index].validation
            )
            draftForm[index].isValid = inputErrors.length === 0
            draftForm[index].errors = inputErrors
            draftForm[index].isTouched = true
            draftForm[index].value = event.target.value
            dForm.formIsValid = this.checkFormValidity(draftForm)
            if (dForm.formIsValid !== this.props.formIsValid) {
                if (this.props.onFormValidChanged)
                    this.props.onFormValidChanged(dForm.formIsValid)
            }
        })
        this.props.onFormUpdated(updatedForm)
    }

    prettyErrorMessage = error =>
        ({
            minLength: "Should be at least " + error.minLength + " long",
            maxLength: "Should be at least " + error.maxLength + " long",
            isNumeric: "Should be composed of digits only",
            isEmail: "The email entered is formatted incorrectly.",
            isRequired: "This field is required",
            mustMatch: "This field must match " + error.target,
        }[error.code] || "Unknown error " + error.code)

    render() {
        return this.props.form.elements.map((formElement, index) => {
            const errors = (
                <div className={classes.Container}>
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                        {formElement.errors &&
                            formElement.errors.map(inputError => (
                                <p
                                    key={inputError.code}
                                    className={classes.InputErrors}
                                >
                                    {this.prettyErrorMessage(inputError)}
                                </p>
                            ))}
                    </ReactCSSTransitionGroup>
                </div>
            )
            const input = (
                <Input
                    key={index}
                    icon={formElement.icon}
                    value={formElement.value}
                    onChange={event => this.onInputChangedHandler(event, index)}
                    label={formElement.label}
                    isValid={formElement.isTouched ? formElement.isValid : true}
                    shouldValidate={formElement.validation !== null}
                    {...formElement.elementConfig}
                />
            )
            return (
                <Fragment>
                    {errors}
                    {input}
                </Fragment>
            )
        })
    }
}

export default Form
