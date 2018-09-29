import { computed, observable, action, runInAction } from "mobx"
import firebase from "../shared/firebase"

export default class AuthStore {
    constructor(_root) {
        this.root = _root
    }

    @observable
    apiKey = "AIzaSyC24AMwY0KYc03315eO2BW28UcUOKtMe5Y"
    @computed
    get isLoggedIn() {
        return [
            this.email,
            this.tokenId,
            this.userId,
            this.expirationDate,
        ].every(x => x !== null) && this.isTokenStillValid
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

    getUserData = async (tokenId) => {
        const userData = await firebase.getUserData(tokenId || this.tokenId, this.apiKey)
        return userData
    }

    isEmailVerified = async (tokenId) => {
        const userData = await this.getUserData(tokenId)
        return userData.emailVerified
    }

    sendVerificationEmail = async (tokenId) => {
        await firebase.sendVerificationEmail(tokenId, this.apiKey)
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

    getTokenId = async (email, password) => {
        try {
            const authData = await firebase.loginUser(
                email,
                password,
                this.apiKey
            )

            return authData.tokenId
        } catch (error) {
            console.error("getTokenId", error)
            throw error
        }
    }

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
        this.removeAuthDataFromLocalStorage()
    }
    @action
    signupUser = async (email, password) => {
        try {
            const authData = await firebase.signupUser(
                email,
                password,
                this.apiKey
            )
            return authData
            // runInAction(() => {
            //     this.tokenId = authData.tokenId
            //     this.email = authData.email
            //     this.expirationDate = new Date(
            //         new Date().getTime() + authData.expiresIn * 1000
            //     )
            //     this.userId = authData.userId
            //     this.storeAuthInLocalStorage()
            // })
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
