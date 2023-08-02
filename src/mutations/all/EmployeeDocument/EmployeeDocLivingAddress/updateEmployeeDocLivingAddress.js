/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeDocLivingAddress} from "mutations/types.d.ts";
import updateMutationImpl from "mutations/updateMutationImpl";
import {Dates} from "utils/Dates";
import findByIdEmployeeDocLivingAddress from "./findByIdEmployeeDocLivingAddress";

// 2
const mutation = graphql`
  mutation updateEmployeeDocLivingAddressMutation($id: hr_employees_living_address_pk_columns_input!, $_set: hr_employees_living_address_set_input!) {
    update_hr_employees_living_address_by_pk(pk_columns: $id, _set: $_set) {
        id
        is_default
        doc
        local_address
        street_address
        employee_id
        employee{
            id
        }
        city{
            id
            name
        }
        zone{
            id
            name
        }
        country{
            id
            name
        }
    }
  }
`;

// 3
export default async (attrs: EntityEmployeeDocLivingAddress) => {
    const {
        id,
        street_address,
        local_address,
        city_id,//living_addr_city
        zone_id,//living_addr_province
        country_id,
        doc,
        is_default,
        employee_id,
    } = attrs;

    const item = await findByIdEmployeeDocLivingAddress(id);
    if (!item) return;

    if (doc && !doc.dlUrls) {
        const path = `employees/${employee_id}/docs`;
        const name = `living_address-${id}-${Dates.formatTimestamp(new Date())}`;
        const gcsUri = await workers.emit("files/upload", {
            file: doc,
            path,
            name,
        });
        console.log("gcsUri", gcsUri);

        attrs.doc = gcsUri;
    }

    return updateMutationImpl({
        mutation,
        id,
        attrs,
    });
};