/* eslint-disable camelcase */

const send = (name, path) => async (data) => {
    try {
        const {send} = sockets.of(path);
        return await send(name, data);
    } catch (err) {
        throw err;
    }
};

//User
export const checkExistByUsername = async (data) => {
    const {username, access_type} = data;
    const type_paths = {
        'User': "users",
        'ContractorUser': "contractors/users",
        'Staff': "employees",
    };
    const path = type_paths[access_type];
    const checkExistByUsername = send('checkExistByUsername', path);
    return checkExistByUsername(username);
};
export const findByUsernameUserSetupBiometric = async (data) => {
    const {username, access_type} = data;
    const type_paths = {
        'User': "users",
        'Contractor': "contractors/users",
        'Staff': "employees",
    };
    const path = type_paths[access_type];
    const findByUsername = send('findByUsernameUserSetupBiometric', path);
    return findByUsername(username);
};
export const loginUserStep1ByUsername = async (data) => {
    const {username, access_type} = data;
    const type_paths = {
        'User': "users",
        'Contractor': "contractors/users",
        'Staff': "employees",
    };
    const path = type_paths[access_type];
    const loginUserStep1 = send('loginUserStep1ByUsername', path);
    return loginUserStep1(username);
};

//HR
export const processEmployeeFileImport = send('processFileImport', "employees");