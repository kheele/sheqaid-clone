/* eslint-disable camelcase */

const list = path => async (args) => {
    try {
        const socket = sockets.of(path);
        return await socket.list(args);
    } catch (err) {
        throw err;
    }
};

export const listCountries = list("countries");
export const listZones = list("zones");
export const listCities = list("cities");