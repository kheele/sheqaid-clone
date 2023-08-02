/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityEmployeeDocLivingAddress} from "mutations/types.d.ts";
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";
import updateMutationImpl from "mutations/updateMutationImpl";
import updateEmployeeDocLivingAddress from "./updateEmployeeDocLivingAddress";

// 2
const mutation = graphql`
    mutation insertEmployeeDocLivingAddressMutation($object: hr_employees_living_address_insert_input!) {
        insert_hr_employees_living_address_one(
            object: $object
        ) {
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
export default async (input: EntityEmployeeDocLivingAddress) => {
    const {
        street_address,
        local_address,
        city_id,//living_addr_city
        zone_id,//living_addr_province
        country_id,
        doc,
        is_default,
        employee_id,
    } = input;

    if (doc) {
        delete input.doc;
    }

    const res = await createMutationImpl({mutation, input});
    if (res) {
        if (doc) {
            const id = convertIdToBigint(res.id);

            const path = `employees/${employee_id}/docs`;
            const name = `living_address-${id}-${Dates.formatTimestamp(new Date())}`;
            const gcsUri = await workers.emit("files/upload", {
                file: doc,
                path,
                name,
            });
            console.log("gcsUri", gcsUri);

            return updateEmployeeDocLivingAddress({id, doc: gcsUri});
        }
    }

    return res;
};
