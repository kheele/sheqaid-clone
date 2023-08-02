/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeDocBankingDetail} from "mutations/types.d.ts";
import {Dates} from "utils/Dates";
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdEmployeeDocBankingDetail from "./findByIdEmployeeDocBankingDetail";

// 2
const mutation = graphql`
  mutation updateEmployeeDocBankingDetailMutation($id: hr_employees_banking_details_pk_columns_input!, $_set: hr_employees_banking_details_set_input!) {
    update_hr_employees_banking_details_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityEmployeeDocBankingDetail) => {
    const {
        id,
        name,
        branch,
        code,
        account_num,
        doc,
        is_default,
        employee_id,
    } = attrs;

    const item = await findByIdEmployeeDocBankingDetail(id);
    if (!item) return;

    if (doc && !doc.dlUrls) {
        const path = `employees/${employee_id}/docs`;
        const name = `banking_detail-${id}-${Dates.formatTimestamp(new Date())}`;
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
