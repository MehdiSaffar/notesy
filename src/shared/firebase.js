import axios from "axios"

export const notesEndpoint = "https://react-notesy.firebaseio.com/notes"
export const authStr = tokenId => "?auth=" + tokenId
export const getFirebaseVerifyPasswordUrl = apiKey =>
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
    apiKey

export const getFirebaseSignupNewUser = apiKey =>
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" +
    apiKey

export default new function() {
    this.loginUser = async (email, password, apiKey) => {
        try {
            const verifyPasswordUrl = getFirebaseVerifyPasswordUrl(apiKey)
            const { data } = await axios.post(verifyPasswordUrl, {
                email,
                password,
                returnSecureToken: true,
            })
            // console.info('data', data)
            return {
                tokenId: data.idToken,
                email: data.email,
                expiresIn: data.expiresIn,
                userId: data.localId,
            }
        } catch (error) {
            console.error("loginUser", error)
            throw error
        }
    }
    this.signupUser = async (email, password, apiKey) => {
        try {
            const signupUserUrl = getFirebaseSignupNewUser(apiKey)
            const { data } = await axios.post(signupUserUrl, {
                email,
                password,
                returnSecureToken: true,
            })
            return {
                tokenId: data.idToken,
                email: data.email,
                expiresIn: data.expiresIn,
                userId: data.localId,
            }
        } catch (error) {
            console.error("signupUser", error)
            throw error
        }
    }
    this.addNote = async (noteData, tokenId) => {
        try {
            const response = await axios.post(
                `${notesEndpoint}.json${authStr(tokenId)}`,
                noteData
            )
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.removeNote = async (noteId, tokenId) => {
        try {
            const response = await axios.delete(
                `${notesEndpoint}/${noteId}.json${authStr(tokenId)}`
            )
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.saveNote = async (noteData, noteId, tokenId) => {
        try {
            const response = await axios.patch(
                `${notesEndpoint}/${noteId}.json${authStr(tokenId)}`,
                noteData
            )
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.getNotes = async (userId, tokenId) => {
        try {
            const response = await axios.get(
                `${notesEndpoint}.json${authStr(tokenId)}`
            )
            // console.info('response', response)
            return Object.keys(response.data)
                .map(key => ({
                    id: key,
                    userId: response.data[key].userId,
                    title: response.data[key].title,
                    content: response.data[key].content,
                    tags: response.data[key].tags || [],
                }))
                .filter(el => el.userId === userId)
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.getTags = async (noteId, tokenId) => {
        try {
            const response = await axios.get(
                `${notesEndpoint}/${noteId}/tags.json${authStr(tokenId)}`
            )
            return response.data || []
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.addTags = async (tags, noteId, tokenId) => {
        try {
            const existingTags = await this.getTags(noteId, tokenId)
            const newTags = existingTags.concat(tags)
            await this.setTags(newTags, noteId, tokenId)
            return newTags
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.setTags = async (tags, noteId, tokenId) => {
        try {
            const response = await axios.patch(
                `${notesEndpoint}/${noteId}.json${authStr(tokenId)}`,
                {
                    tags,
                }
            )
            return response.data.tags || []
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    this.deleteTag = async (tag, noteId, tokenId) => {
        try {
            const existingTags = await this.getTags(noteId, tokenId)
            const filteredTags = existingTags.filter(t => t !== tag)
            const newTags = await this.setTags(filteredTags, noteId, tokenId)
            return newTags
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }
}()
