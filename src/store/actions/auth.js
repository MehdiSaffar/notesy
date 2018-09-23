import actionTypes from "./actionTypes"
import * as authUtil from "./../../shared/authUtility"
import axios from "axios"

export const checkTokenLocalStorage = () => ({
    type: actionTypes.CHECK_TOKEN_LOCAL_STORAGE,
})

export const logoutUser = () => dispatch => {
    dispatch({ type: actionTypes.RESET_NOTES })
    dispatch({
        type: actionTypes.LOGOUT_USER,
    })
}

export const loginUser = (email, password) => async (dispatch, getState) => {
    const start = (email, password) => ({
        type: actionTypes.LOGIN_USER_START,
        email: email,
        password: password,
    })
    const fail = error => ({
        type: actionTypes.LOGIN_USER_FAIL,
        error,
    })
    const success = authData => ({
        type: actionTypes.LOGIN_USER_SUCCESS,
        ...authData,
    })
    try {
        dispatch(start(email, password))
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        const url = authUtil.getFirebaseVerifyPasswordUrl(
            getState().auth.apiKey
        )
        const response = await axios.post(url, authData)
        const receivedAuthData = {
            email: response.data.email,
            idToken: response.data.idToken,
            localId: response.data.localId,
            expiresIn: response.data.expiresIn,
        }
        dispatch(success(receivedAuthData))
        return receivedAuthData
    } catch (error) {
        dispatch(fail(error))
        console.log(error)
        return error.response.data.error
    }
}

export const signupUser = (email, password) => async (dispatch, getState) => {
    const start = (email, password) => ({
        type: actionTypes.SIGNUP_USER_START,
        email,
        password,
    })
    const success = authData => ({
        type: actionTypes.SIGNUP_USER_SUCCESS,
        ...authData,
    })
    const fail = error => ({
        type: actionTypes.SIGNUP_USER_FAIL,
        error,
    })
    try {
        dispatch(start(email, password))

        const url = authUtil.getFirebaseSignupNewUser(getState().auth.apiKey)

        const authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        const response = await axios.post(url, authData)
        const receivedAuthData = {
            email: response.data.email,
            idToken: response.data.idToken,
            localId: response.data.localId,
            expiresIn: response.data.expiresIn,
        }
        dispatch(success(receivedAuthData))
        return receivedAuthData
    } catch (error) {
        dispatch(fail(error.response.data.error))
        console.log(error)
        throw error.response.data.error
    }
}
