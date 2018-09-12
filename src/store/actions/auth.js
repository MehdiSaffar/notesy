import actionTypes from "./actionTypes"
import * as authUtil from "./../../shared/authUtility"
import axios from 'axios'

export const loginUserStart = (email, password) => ({
    type: actionTypes.LOGIN_USER_START,
    email: email,
    password: password,
})

export const loginUserSuccess = (authData) => ({
    type: actionTypes.LOGIN_USER_SUCCESS,
    ...authData
})

export const loginUserFail = (error) => ({
    type: actionTypes.LOGIN_USER_FAIL,
    error
})

export const logoutUser = _ => ({
    type: actionTypes.LOGOUT_USER,
})

export const loginUser = (email, password) => (dispatch, getState) => {
    dispatch(loginUserStart(email, password))

    let url = authUtil.getFirebaseVerifyPasswordUrl(getState().auth.apiKey)

    const authData = {
        email: email,
        password: password,
        returnSecureToken: true,
    }

    axios
        .post(url, authData)
        .then(response => {
            const authData = {
                email: response.data.email,
                idToken: response.data.idToken,
                localId: response.data.localId,
                expiresIn: response.data.expiresIn,
            }
            dispatch(loginUserSuccess(authData))
        })
        .catch(error => {
            dispatch(loginUserFail(error))
        })
}

export const signupUserStart = (email, password) => ({
    type: actionTypes.SIGNUP_USER_START,
    email, password
})

export const signupUserSuccess = (authData) => ({
    type: actionTypes.SIGNUP_USER_SUCCESS,
    ...authData
})

export const signupUserFail = (error) => ({
    type: actionTypes.SIGNUP_USER_FAIL,
    error
})

export const signupUser = (email, password) => (dispatch, getState) => {
    dispatch(signupUserStart(email, password))

    let url = authUtil.getFirebaseSignupNewUser(getState().auth.apiKey)

    const authData = {
        email: email,
        password: password,
        returnSecureToken: true,
    }

    axios
        .post(url, authData)
        .then(response => {
            console.log(response.data)
            const authData = {
                email: response.data.email,
                idToken: response.data.idToken,
                localId: response.data.localId,
                expiresIn: response.data.expiresIn,
            }
            dispatch(signupUserSuccess(authData))
        })
        .catch(error => {
            dispatch(signupUserFail(error.response.data.error))
        })
}
