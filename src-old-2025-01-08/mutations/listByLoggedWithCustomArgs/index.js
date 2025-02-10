/* eslint-disable camelcase */
import listByLogged from '../listByLogged';

//HR
export const listByIdsActiveEmployee = async (id_list) => {
    const findByIds = listByLogged("employees");
    return findByIds({id_list, removed: false});
};
export const listByIdsInactiveEmployee = async (id_list) => {
    const findByIds = listByLogged("employees");
    return findByIds({id_list, removed: true});
};

export const listTeamBySupervisorId = async id => {
    try {
        const socket = sockets.of("structure-and-responsibility/organograms");
        return await socket.send("listTeamBySupervisorId", id);
    } catch (err) {
        throw err;
    }
};
