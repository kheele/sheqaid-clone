/* eslint-disable camelcase */

const __signup = (path) => async (input) => {
    try {
        const {signup} = sockets.of(path);
        return await signup(input);
    } catch (err) {
        throw err;
    }
};

export const signUp = async (data) => {
    const {customToken, username, password} = data;

    const _signUp = __signup("users");
    return _signUp(data).then(async newUser => {
        if (newUser) {
            let userCredential;
            if (customToken) {
                return workers.emit("users/accounts/relogin/customToken", customToken);
            } else {
                return workers.emit("users/accounts/relogin/username", {username, password});
            }
        }
    });
};


export default __signup;

export const signUpContractorUser = __signup("contractors/users");
