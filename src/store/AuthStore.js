import { computed, observable, action } from "mobx"

export default class NoteStore {
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
        ].every(el => el !== null)
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
        return today.getTime() <= this.expirationDate.getTime()
    }

    @action
    storeAuthInLocalStorage() {
        // TODO: make util func
        window.localStorage.setItem("tokenId", this.tokenId)
        window.localStorage.setItem("userId", this.userId)
        window.localStorage.setItem("email", this.email)
        window.localStorage.setItem("expirationDate", this.expirationDate)
    }

    @action
    loginFromLocalStorage() {
        const tokenId = window.localStorage.getItem("tokenId")
        const userId = window.localStorage.getItem("userId")
        const email = window.localStorage.getItem("email")
        const expirationDate = window.localStorage.getItem("expirationDate")
        if (this.isLoggedInLocalStorage) {
            this.tokenId = tokenId
            this.userId = userId
            this.email = email
            this.expirationDate = expirationDate
        }
    }

    @computed
    get isLoggedInLocalStorage() {
        const tokenId = window.localStorage.getItem("tokenId")
        if (tokenId) {
            if (this.isTokenStillValid) {
                console.log("Found ", tokenId)
                return true
            }
        } else {
            console.log("Token found expired")
            // TODO: make util func
            window.localStorage.removeItem("tokenId")
            window.localStorage.removeItem("userId")
            window.localStorage.removeItem("email")
            window.localStorage.removeItem("expirationDate")
            return false
        }
        return false
    }

    @action
    loginUser(email, tokenId, userId, expiresIn) {
        this.email = email
        this.tokenId = tokenId
        this.userId = userId
        this.expirationDate = new Date(Date.now() + expiresIn * 1000)

        window.localStorage.setItem("tokenId", this.tokenId)
        window.localStorage.setItem("userId", this.userId)
        window.localStorage.setItem("email", this.email)
        window.localStorage.setItem("expirationDate", this.expirationDate)
    }

    @action
    logoutUser() {
        this.email = null
        this.tokenId = null
        this.userId = null
        this.expirationDate = null
        window.localStorage.removeItem("tokenId")
        window.localStorage.removeItem("userId")
        window.localStorage.removeItem("email")
        window.localStorage.removeItem("expirationDate")
    }
}
