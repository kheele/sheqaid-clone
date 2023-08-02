/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeDocDocument} from "mutations/types.d.ts";
import updateMutationImpl from "mutations/updateMutationImpl";
import {Dates} from "utils/Dates";
import findByIdEmployeeDocDocument from "./findByIdEmployeeDocDocument";

// 2
const mutation = graphql`
  mutation updateEmployeeDocDocumentMutation($id: hr_employees_documents_pk_columns_input!, $_set: hr_employees_documents_set_input!) {
    update_hr_employees_documents_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityEmployeeDocDocument) => {
    const {
        id,
        type,
        desc,
        doc,
        expiry_date,
        employee_id,
    } = attrs;

    const item = await findByIdEmployeeDocDocument(id);
    if (!item) return;

    if (doc && !doc.dlUrls) {
        const path = `employees/${employee_id}/docs`;
        const name = `document-${id}-${Dates.formatTimestamp(new Date())}`;
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
