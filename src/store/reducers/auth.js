import actionTypes from "../actions/actionTypes"
import { produce } from "immer"

const initialState = {
    apiKey: "AIzaSyC24AMwY0KYc03315eO2BW28UcUOKtMe5Y",
    isLoggedIn: true,
    email: null,
    idToken: null,
    localId: null,
    expirationDate: null,
}

const loginUserSuccess = (state, action) =>
    produce(state, draftState => {
        draftState.isLoggedIn = true
        draftState.email = action.email
        draftState.idToken = action.idToken
        draftState.localId = action.localId
        draftState.expirationDate = new Date(
            Date.now() + action.expiresIn * 1000
        )
    })

const loginUserFail = (state, action) => produce(state, draftState => {})

const logoutUser = (state, action) => produce(state, draftState => {
    draftState.isLoggedIn = false
    draftState.email = null
    draftState.idToken = null
    draftState.localId = null
    draftState.expirationDate = null
})

const signupUserSuccess = (state, action) => loginUserSuccess(state, action)
const signupUserFail = (state, action) => produce(state, draftState => {})

export default (state = initialState, action) => {
    const map = {
        [actionTypes.LOGIN_USER_SUCCESS]: () => loginUserSuccess(state, action),
        [actionTypes.LOGIN_USER_FAIL]: () => loginUserFail(state, action),

        [actionTypes.SIGNUP_USER_SUCCESS]: () => signupUserSuccess(state, action),
        [actionTypes.SIGNUP_USER_FAIL]: () => signupUserFail(state, action),

        [actionTypes.LOGOUT_USER]: () => logoutUser(state, action),
    }
    const toCall = map[action.type]
    return toCall ? toCall(state, action) : state
}
