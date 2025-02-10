/* eslint-disable camelcase */

import {EntityNCR} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

export default async (input: EntityNCR) => {
    try{
        crudUtils.injectCreate(input);

        const {create} = sockets.of("ncr");
        return await create(input);
    } catch(err) {
        throw err;
    }
};
