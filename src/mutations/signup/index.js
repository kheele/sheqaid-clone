/* eslint-disable camelcase */

const signup = (path, crudUtils, onProcess) => async (input) => {
    try {
        crudUtils && crudUtils.injectCreate(input);
        onProcess && onProcess(input);

        const {signup} = sockets.of(path);
        return await signup(input);
    } catch (err) {
        throw err;
    }
};

export default signup;

export const signUp = async (data) => {
    const {customToken, username, password} = data;

    const _signUp = signup("users");
    return _signUp(data).then(async newUser => {
        if (newUser) {
            let userCredential;
            if (customToken) {
                return workers.emit("users/relogin/customToken", customToken);
            } else {
                return workers.emit("users/relogin/username", {username, password});
            }
        }
    });
};
export const signUpContractorUser = signup("contractors/users");
