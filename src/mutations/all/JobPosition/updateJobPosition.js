/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityJobPosition} from "mutations/types.d.ts";
import findByIdJobPosition from "./findByIdJobPosition";

// 2
const mutation = graphql`
  mutation updateJobPositionMutation($id: default_job_positions_pk_columns_input!, $_set: default_job_positions_set_input!) {
    update_default_job_positions_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        name
        desc
        doc
        job_position_owner
        employee_list_aggregate{
            aggregate{
                count
            }
        }
        employee_external_list_aggregate{
            aggregate{
                count
            }
        }
        ppe_type_list_aggregate{
            aggregate{
                count
            }
        }
        toolbox_talk_list_aggregate{
            aggregate{
                count
            }
        }
        training_plan_list_aggregate{
            aggregate{
                count
            }
        }
        job_category {
            id
            name
        }
        company{
            id
            name
        }
        client{
            id
            name
        }
        project{
            id
            name
        }
        site{
            id
            name
        }
    }
  }
`;

// 3
export default async (attrs: EntityJobPosition) => {
    const {
        id,
        name,
        desc,
        doc,
        job_category_id,
        client_id,
    } = attrs;

    const existingItem = await findByIdJobPosition(id);
    if(!existingItem) {
        return "NOT_FOUND";
    }

    if(doc && !doc.dlUrls) {
        delete attrs.doc;

        const path = `job-positions/${id}`;
        const name = "job-position-doc";
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
        id: attrs.id,
        attrs,
    });
};
