import React, { Component, Fragment } from "react"
import Input from "./Input/Input"
import produce from "immer"

class Form extends Component {

    checkInputValidity = (value, validation) => {
        if (validation.minLength) {
            if (!(value.length >= validation.minLength)) return false
        }

        if (validation.maxLength) {
            if (!(value.length <= validation.minLength)) return false
        }

        if (validation.isRequired) {
            if (value.trim() === "") return false
        }

        if (validation.isEmail) {
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!pattern.test(value)) return false
        }

        if (validation.isNumeric) {
            const pattern = /^\d+$/
            if (!pattern.test(value)) return false
        }

        return true
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
            draftForm[index].isValid = this.checkInputValidity(
                event.target.value,
                draftForm[index].validation
            )
            draftForm[index].isTouched = true
            draftForm[index].value = event.target.value
            dForm.formIsValid = this.checkFormValidity(draftForm)
            if (dForm.formIsValid !== this.props.formIsValid) {
                if(this.props.onFormValidChanged) this.props.onFormValidChanged(dForm.formIsValid)
            }
        })
        this.props.onFormUpdated(updatedForm)
    }

    render() {
        // let changeHappened = false
        // const updatedForm = produce(this.props.form, dForm => {
        //   for(let key in dForm.elements) {
        //     dForm.elements[key].isValid = this.checkInputValidity(dForm.elements[key].value, dForm.elements[key].validation)
        //   }
        //   let newValid = this.checkFormValidity(dForm.elements)
        //   if(this.props.form.formIsValid !== newValid) {
        //     dForm.formIsValid = newValid
        //   }
        // })

        // if(changeHappened) {
        //     this.props.onFormUpdated(updatedForm)
        // }

       return this.props.form.elements.map((formElement, index) => (
            <Input
                key={index}
                value={formElement.value}
                onChange={event => this.onInputChangedHandler(event, index)}
                label={index}
                isValid={formElement.isTouched ? formElement.isValid : true}
                shouldValidate={formElement.validation !== null}
                {...formElement.elementConfig}
            />
        ))
    }
}

export default Form
