import React, { Component, Fragment } from "react"
import Layout from "./containers/Layout/Layout"

import { library } from "@fortawesome/fontawesome-svg-core"
import { icons } from "./icons"
import { withRouter } from "react-router"
import { inject } from "mobx-react";

const ic = Object.keys(icons).map(iconName => icons[iconName])
library.add(...ic)

@inject('store')
class App extends Component {

    componentDidMount() {
        if(!this.props.store.isLoggedIn) 
         this.props.store.auth.loginFromLocalStorage()
    }

    render() {
        return <Layout />
    }
}

export default withRouter(App)
