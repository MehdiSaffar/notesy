import React from "react"
import classes from "./Input.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const input = props => {
    let element = null
    let inputClasses = [classes.InputElement]

    const { shouldValidate, isValid, divClass, ...config } = props

    if (shouldValidate && !isValid) {
        inputClasses.push(classes.Invalid)
    }

    switch (props.type) {
        default:
        case "text":
            element = (
                <input
                    className={inputClasses.join(" ")}
                    {...config}
                />
            )
            break
        case "select":
            element = (
                <select
                    className={inputClasses.join(" ")}
                    {...config}
                />
            )
            break
        case "textarea":
            element = (
                <input
                    className={inputClasses.join(" ")}
                    {...config}
                />
            )
            break
    }

    return (
        <div className={[classes.Input, divClass].join(' ')}>
            {props.icon && <FontAwesomeIcon icon={props.icon} />}
            {props.label && <label className={classes.Label}>{props.label + ':'}</label>}
            {element}
        </div>
    )
}

export default input
