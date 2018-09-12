import React from "react"
import classes from "./Button.css"

const button = props => {
    const cls = [classes.Button]
    const { btnStyle, ...propsPass } = props
    cls.push(classes[btnStyle])
    return <button type={props.type} className={cls.join(" ")} {...propsPass} />
}

export default button
