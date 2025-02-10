/* eslint-disable camelcase */

import {updateEmployeeDocDocumentIDOrPassport, updateEmployeeDocDocumentPrDP} from "../update";

export const updateEmployeeDocDocument = async (data) => {
    const {type} = data;
    const type_funs = {
        'PrDP': updateEmployeeDocDocumentPrDP,
        'ID/Passport': updateEmployeeDocDocumentIDOrPassport,
    };
    const update = type_funs[type];
    return update(data);
};
