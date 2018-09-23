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

const checkTokenLocalStorage = (state,action) => {
    const idToken = window.localStorage.getItem("idToken")
    const localId = window.localStorage.getItem("localId")
    const email = window.localStorage.getItem("email")
    const expirationDate = window.localStorage.getItem("expirationDate")
    if(idToken) {
        return {
            ...state,
            isLoggedIn: true,
            idToken,
            localId,
            email,
            expirationDate
        }
    }
    else return state
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

         window.localStorage.setItem("idToken", action.idToken)
         window.localStorage.setItem("localId", action.localId)
         window.localStorage.setItem("email", action.email)
         window.localStorage.setItem("expirationDate", draftState.expirationDate)
    })

const loginUserFail = (state, action) => produce(state, draftState => {})

const logoutUser = (state, action) => produce(state, draftState => {
    draftState.isLoggedIn = false
    draftState.email = null
    draftState.idToken = null
    draftState.localId = null
    draftState.expirationDate = null
    window.localStorage.removeItem("idToken")
    window.localStorage.removeItem("localId")
    window.localStorage.removeItem("email")
    window.localStorage.removeItem("expirationDate")
})

const signupUserSuccess = (state, action) => loginUserSuccess(state, action)
const signupUserFail = (state, action) => produce(state, draftState => {})

export default (state = initialState, action) => {
    const map = {
        [actionTypes.CHECK_TOKEN_LOCAL_STORAGE]: checkTokenLocalStorage,
        [actionTypes.LOGIN_USER_SUCCESS]: loginUserSuccess,
        [actionTypes.LOGIN_USER_FAIL]: loginUserFail,

        [actionTypes.SIGNUP_USER_SUCCESS]: signupUserSuccess,
        [actionTypes.SIGNUP_USER_FAIL]: signupUserFail,

        [actionTypes.LOGOUT_USER]: logoutUser,
    }
    const toCall = map[action.type]
    return toCall ? toCall(state, action) : state
}
