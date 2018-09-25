import { computed, observable, action, runInAction } from "mobx"
import firebase from "../shared/firebase"

export default class AuthStore {
    @observable
    apiKey = "AIzaSyC24AMwY0KYc03315eO2BW28UcUOKtMe5Y"
    @computed
    get isLoggedIn() {
        return [
            this.apiKey,
            this.email,
            this.tokenId,
            this.userId,
            this.expirationDate,
        ].every(el => el !== null) && this.isTokenStillValid
    }

    @observable
    email = null
    @observable
    tokenId = null
    @observable
    userId = null
    @observable
    expirationDate = null

    // Check if token is still valid (according to its expiration datae)
    @computed
    get isTokenStillValid() {
        const today = new Date()
        return (
            this.expirationDate !== null &&
            today.getTime() <= this.expirationDate.getTime()
        )
    }

    @action
    storeAuthInLocalStorage = () => {
        // TODO: make util func
        window.localStorage.setItem("tokenId", this.tokenId)
        window.localStorage.setItem("userId", this.userId)
        window.localStorage.setItem("email", this.email)
        window.localStorage.setItem("expirationDate", this.expirationDate)
    }

    @action
    loginFromLocalStorage = () => {
        if (this.isLoggedInLocalStorage) {
            const {
                tokenId,
                userId,
                email,
                expirationDate,
            } = this.getAuthDataFromLocalStorage()

            this.tokenId = tokenId
            this.userId = userId
            this.email = email
            this.expirationDate = new Date(expirationDate)
        }
    }

    isLoggedInLocalStorage = () => {
        const authData = this.getAuthDataFromLocalStorage()
        const missingKeys = [
            "userId",
            "tokenId",
            "email",
            "expirationDate",
        ].reduce((array, current) => {
            if (!authData[current]) array.push(current)
        })

        if (missingKeys.length > 0) {
            this.removeAuthDataFromLocalStorage()
            return false
        }

        if (authData.tokenId && authData.expirationDate) {
            if (
                new Date().getTime() <=
                new Date(authData.expirationDate).getTime()
            ) {
                return true
            }
        } else {
            this.removeAuthDataFromLocalStorage()
        }
        return false
    }

    getAuthDataFromLocalStorage = () => ({
        tokenId: window.localStorage.getItem("tokenId"),
        userId: window.localStorage.getItem("userId"),
        email: window.localStorage.getItem("email"),
        expirationDate: window.localStorage.getItem("expirationDate"),
    })

    removeAuthDataFromLocalStorage = () => {
        window.localStorage.removeItem("tokenId")
        window.localStorage.removeItem("userId")
        window.localStorage.removeItem("email")
        window.localStorage.removeItem("expirationDate")
    }

    // @computed
    // get isLoggedInLocalStorage() {
    //     // console.info("isLoggedInLocalStorage")
    //     const tokenId = window.localStorage.getItem("tokenId")
    //     const expirationDate = window.localStorage.getItem("expirationDate")
    //     if (tokenId) {
    //         if (new Date().getTime() <= new Date(expirationDate).getTime()) {
    //             // console.log("Found ", tokenId)
    //             return true
    //         }
    //     } else {
    //         // console.log("Token found expired")
    //         // TODO: make util func
    //         this.removeAuthDataFromLocalStorage()
    //         return false
    //     }
    //     // console.log("No token found")
    //     return false
    // }

    @action
    loginUser = async (email, password) => {
        try {
            const authData = await firebase.loginUser(
                email,
                password,
                this.apiKey
            )
            // console.info(authData)
            runInAction(() => {
                this.tokenId = authData.tokenId
                this.email = authData.email
                this.expirationDate = new Date(
                    new Date().getTime() + authData.expiresIn * 1000
                )
                this.userId = authData.userId
                window.localStorage.setItem("tokenId", this.tokenId)
                window.localStorage.setItem("userId", this.userId)
                window.localStorage.setItem("email", this.email)
                window.localStorage.setItem(
                    "expirationDate",
                    this.expirationDate
                )
            })
        } catch (error) {
            console.error("loginUser", error)
            throw error
        }
    }

    @action
    logoutUser = () => {
        this.email = null
        this.tokenId = null
        this.userId = null
        this.expirationDate = null
        window.localStorage.removeItem("tokenId")
        window.localStorage.removeItem("userId")
        window.localStorage.removeItem("email")
        window.localStorage.removeItem("expirationDate")
    }
    @action
    signupUser = async (email, password) => {
        try {
            const authData = await firebase.signupUser(
                email,
                password,
                this.apiKey
            )
            runInAction(() => {
                this.tokenId = authData.tokenId
                this.email = authData.email
                this.expirationDate = new Date(
                    new Date().getTime() + authData.expiresIn * 1000
                )
                this.userId = authData.userId
                window.localStorage.setItem("tokenId", this.tokenId)
                window.localStorage.setItem("userId", this.userId)
                window.localStorage.setItem("email", this.email)
                window.localStorage.setItem(
                    "expirationDate",
                    this.expirationDate
                )
            })
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
