/* eslint-disable camelcase */

const findBy = path => async (id) => {
    try {
        const {findBy} = sockets.of(path);
        return await findBy(id);
    } catch (err) {
        throw err;
    }
};

export const findByNameZone = findById("zone");
