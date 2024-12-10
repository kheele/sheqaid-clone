/* eslint-disable camelcase */

const findBy = path => async (id) => {
    try {
        const {findBy} = sockets.of(path);
        return await findBy(id);
    } catch (err) {
        throw err;
    }
};

//HR
export const findByDepartment = findBy("departments");
export const findByJobCategory = findBy("job-categories");
export const findByJobPosition = findBy("job-positions");
export const findByTeam = findBy("teams");
