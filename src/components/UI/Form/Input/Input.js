import React from "react"
import classes from "./Input.css"

const input = props => {
    let element = null
    let inputClasses = [classes.InputElement]

    const { shouldValidate, isValid, ...config } = props

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
        <div className={classes.Input}>{element}</div>
    )
}

export default input
