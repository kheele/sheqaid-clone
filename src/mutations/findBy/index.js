/* eslint-disable camelcase */

const findBy = path => async (data) => {
    try {
        const {findBy} = sockets.of(path);
        return await findBy(data);
    } catch (err) {
        throw err;
    }
};

//General
export const findByOTPContractor = findBy("contractors/otp");

//User
export const checkExistByUsername = async (data) => {
    const {username, access_type} = data;
    const type_paths = {
        'User': "users",
        'ContractorUser': "contractors/users",
        'Staff': "employees",
    };
    const path = type_paths[access_type];
    const checkExistByUsername = findBy(`${path}/checkExistByUsername`);
    return checkExistByUsername(username).then(res => {

    });
};
export const findByUsernameUserSetupBiometric = async (data) => {
    const {username, access_type} = data;
    const type_paths = {
        'User': "users",
        'Contractor': "contractors/users",
        'Staff': "employees",
    };
    const path = type_paths[access_type];
    const findByUsername = findBy(`${path}/findByUsernameUserSetupBiometric`);
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
    const loginUserStep1 = findBy(`${path}/loginUserStep1ByUsername`);
    return loginUserStep1(username);
};

//HR
export const findByDepartment = findBy("departments");
export const findByJobCategory = findBy("job-categories");
export const findByJobPosition = findBy("job-positions");
export const findByTeam = findBy("teams");
