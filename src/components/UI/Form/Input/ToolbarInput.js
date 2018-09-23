import React from "react"
import classes from "./ToolbarInput.css"

const toolbarInput = props => {
    const { extraClass, ...pass } = props
    return (
        <input
            className={[classes.ToolbarInput, extraClass].join(" ")}
            {...pass}
        />
    )
}

export default toolbarInput
