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

//HR
export const findByDepartment = findBy("departments");
export const findByJobCategory = findBy("job-categories");
export const findByJobPosition = findBy("job-positions");
export const findByTeam = findBy("teams");
