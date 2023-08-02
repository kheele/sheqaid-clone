/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityEmployeeWorkPermit} from "mutations/types.d.ts";
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";
import updateMutationImpl from "mutations/updateMutationImpl";
import updateEmployeeDocDocument from "./updateEmployeeDocDocument";

// 2
const mutation = graphql`
    mutation insertEmployeeDocDocumentMutation($object: hr_employees_documents_insert_input!) {
        insert_hr_employees_documents_one(
            object: $object
        ) {
            id
            created_at
            doc
            type
            desc
            expiry_date
            employee_id
            employee{
                id
            }
        }
    }
`;

// 3
export default async (input: EntityEmployeeWorkPermit) => {
    const {
        type,
        desc,
        doc,
        expiry_date,
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
            const name = `document-${id}-${Dates.formatTimestamp(new Date())}`;
            const gcsUri = await workers.emit("files/upload", {
                file: doc,
                path,
                name,
            });
            console.log("gcsUri", gcsUri);

            return updateEmployeeDocDocument({id, doc: gcsUri});
        }
    }

    return res;
};
