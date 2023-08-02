/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityNCR} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";
import updateUser from "../User/updateUser";
import {Dates} from "../../../utils/Dates";
import updateEmployee from "../Employee/updateEmployee";
import updateNCR from "./updateNCR";

// 2
const mutation = graphql`
    mutation insertNCRMutation($object: sheq_non_conformances_insert_input!) {
        insert_sheq_non_conformances_one(
            object: $object
        ) {
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
export default async (input: EntityNCR) => {
    const {
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
        responsible_person_id,
        responsible_party_list,
        assigned_job_position_list,
        assigned_person_list,
        approving_person_id,
        //4
        document_list,
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
    } = input;

    crudUtils.injectCreate(input);

    // let document_list_doc;
    // if (document_list && document_list.data && document_list.data.anyMatch(v => !!v.doc)) {
    //     document_list_doc = true;
    //     delete input.document_list;
    // }

    const res = await createMutationImpl({mutation, input});
    // if (res) {
        // if (document_list_doc) {
            // const id = convertIdToBigint(res.id);
            // const updateAttrs = {};
            //
            // const updoad = async ({key, doc, name}) => {
            //     const path = `employees/${id}/docs`;
            //     const gcsUri = await workers.emit("files/upload", {
            //         file: doc,
            //         path,
            //         name,
            //     });
            //     console.log("gcsUri", gcsUri);
            //     if (key) {
            //         updateAttrs[key] = gcsUri;
            //     } else {
            //         return gcsUri;
            //     }
            // };

            // const promises = [];
            // promises.push(Promise.all(document_list.data.map(async (v, n) => {
            //     const name = `document-${n}-${Dates.formatTimestamp(new Date())}`;
            //     const gcsUri = await updoad({
            //         doc: v.doc,
            //         name,
            //     });
            //     v.doc = gcsUri;
            //     return v;
            // })).then(list => {
            //     updateAttrs.document_list = {data: list};
            // }));
            //
            // await Promise.all(promises);
            //
            // return updateNCR({id, ...updateAttrs});
        // }
    // }

    return res;
};
