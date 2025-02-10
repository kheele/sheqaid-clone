/* eslint-disable camelcase */

import {EntityIncident} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

export default async (input: EntityIncident) => {
    try{
        crudUtils.injectCreate(input);//

        const {create} = sockets.of("incidents");
        return await create(input);
    } catch(err) {
        throw err;
    }
};