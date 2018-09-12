export const getFirebaseVerifyPasswordUrl = apiKey =>
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
    apiKey

export const getFirebaseSignupNewUser = apiKey =>
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" +
    apiKey
