/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityEmployeeDocBankingDetail} from "mutations/types.d.ts";
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";
import updateMutationImpl from "mutations/updateMutationImpl";
import updateEmployeeDocBankingDetail from "./updateEmployeeDocBankingDetail";

// 2
const mutation = graphql`
    mutation insertEmployeeDocBankingDetailMutation($object: hr_employees_banking_details_insert_input!) {
        insert_hr_employees_banking_details_one(
            object: $object
        ) {
            id
            created_at
            is_default
            name

            account_num
            branch
            code
            doc
            employee_id
            employee{
                id
            }
        }
    }
`;

// 3
export default async (input: EntityEmployeeDocBankingDetail) => {
    const {
        name,
        branch,
        code,
        account_num,
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
            const name = `banking_detail-${id}-${Dates.formatTimestamp(new Date())}`;
            const gcsUri = await workers.emit("files/upload", {
                file: doc,
                path,
                name,
            });
            console.log("gcsUri", gcsUri);

            return updateEmployeeDocBankingDetail({id, doc: gcsUri});
        }
    }

    return res;
};
