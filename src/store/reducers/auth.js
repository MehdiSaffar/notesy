import actionTypes from "../actions/actionTypes"
import { produce } from "immer"

const initialState = {
    apiKey: "AIzaSyC24AMwY0KYc03315eO2BW28UcUOKtMe5Y",
    isLoggedIn: false,
    email: null,
    idToken: null,
    localId: null,
    expirationDate: null,
}
