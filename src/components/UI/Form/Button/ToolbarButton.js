import React from "react"
import classes from "./ToolbarButton.css"

const toolbarButton = props => {
    const { extraClass, children,...pass } = props
    return (
        <button
            className={[classes.ToolbarButton, extraClass].join(" ")}
            {...pass}
        >{children}</button>
    )
}

export default toolbarButton
