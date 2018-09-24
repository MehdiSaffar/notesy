import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import registerServiceWorker from "./registerServiceWorker"
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'mobx-react'
import NoteStore from './store/NoteStore';
import AuthStore from './store/AuthStore';


const store = {
    note: new NoteStore(),
    auth: new AuthStore()
}

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById("root"))
registerServiceWorker()
