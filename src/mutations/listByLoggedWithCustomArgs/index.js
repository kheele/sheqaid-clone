/* eslint-disable camelcase */
import listByLogged from '../listByLogged';

export const listByIdsActiveEmployee = async (id_list) => {
    const findByIds = listByLogged("employees");
    return findByIds({id_list, removed: false});
};
export const listByIdsInactiveEmployee = async (id_list) => {
    const findByIds = listByLogged("employees");
    return findByIds({id_list, removed: true});
};