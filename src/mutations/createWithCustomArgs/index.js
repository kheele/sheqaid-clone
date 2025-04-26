/* eslint-disable camelcase */

import {insertEmployeeDocDocumentIDOrPassport, insertEmployeeDocDocumentPrDP} from "../create";

export const insertEmployeeDocDocument = async (data) => {
    const {formData: {type}} = data;
    const type_funs = {
        'PrDP': insertEmployeeDocDocumentPrDP,
        'ID/Passport': insertEmployeeDocDocumentIDOrPassport,
    };
    const insert = type_funs[type];
    return insert(data);
};
