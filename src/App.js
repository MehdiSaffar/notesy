import React, { Component } from "react"
import Layout from "./containers/Layout/Layout"

import { library } from "@fortawesome/fontawesome-svg-core"
import { icons } from "./icons"
import { connect } from "react-redux"
import * as actions from "./store/actions/index"
// library.add(...fontAwesome)

var ic = Object.keys(icons).map(iconName => icons[iconName])
library.add(...ic)

class App extends Component {
    // componentDidMount() {
    //     this.props.checkTokenLocalStorage()
    // }
    render() {
        return <Layout />
    }
}

export default connect(
    null,
    {
        checkTokenLocalStorage: actions.checkTokenLocalStorage,
    }
)(App)
