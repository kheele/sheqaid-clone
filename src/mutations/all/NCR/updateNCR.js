/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityNCR} from "mutations/types.d.ts";
import updateNCRProgress from "../NCRProgress/updateNCRProgress";
import insertNCRProgress from "../NCRProgress/insertNCRProgress";
import findByIdNCR from "./findByIdNCR";

// 2
const mutation = graphql`
  mutation updateNCRMutation($id: sheq_non_conformances_pk_columns_input!, $_set: sheq_non_conformances_set_input!) {
    update_sheq_non_conformances_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        comments
        completed_date
        desc
        due_date
        process
        remarks
        type
        source
        priority
        allocation
        additional_notes
        status_acceptance
        status_progress
        result
        document_list(where: {type: {_eq: "Document Incident"}}){
            id
            doc
        }
        document_proof_list:document_list(where: {type: {_eq: "Document Proof"}}){
            id
            doc
        }
        progress_list{
            id
            outstanding
            notes
            date
        }
        responsible_party_list {
            id
            value
        }
        assigned_job_position_list {
            id
            job_position{
                id
                name
            }
        }
        assigned_person_list {
            id
            employee{
                id
                fname
                lname
                full_name
                email
                phone
                id_num
                passport_num
            }
        }
        approving_person{
            id
            lname
            fname
            email
            phone
        }
        #            responsible_person{
        #                id
        #                lname
        #                fname
        #                email
        #                phone
        #            }
        selected_source_site {
            id
            name
            project{
                id
                name
            }
            client{
                id
                name
            }
        }
        selected_source_incident {
            id
        }
        selected_source_inspection {
            id
        }
        selected_source_compliance_audit {
            id
        }

        client {
            id
            name
        }
        project {
            id
            name
        }
        site {
            id
            name
        }
    }
  }
`;

// 3
export default async (attrs: EntityNCR) => {
    const {
        id,
        //0
        site_id,
        project_id,
        client_id,
        //1
        type,
        priority,
        allocation,
        source,
        //2
        desc,
        process,
        //3
        due_date,
        // responsible_person_id,
        responsible_party_list,
        assigned_job_position_list,
        assigned_person_list,
        assigned_person_other_list,
        approving_person_id,
        //4
        document_list,
        document_proof_list,
        //5
        comments,
        remarks,
        //6
        progress_list,
        //7
        status_acceptance,
        status,
        result,
        completed_date,
        additional_notes
    } = attrs;

    if (progress_list) {
        delete attrs.progress_list;
        await Promise.all(progress_list.data.map(async (v, n) => {
            if (v.id) {
                return updateNCRProgress(v);
            } else {
                return insertNCRProgress({...v, non_conformance_id: id});
            }
        }));
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).then(res => res && findByIdNCR(res.id));
};
