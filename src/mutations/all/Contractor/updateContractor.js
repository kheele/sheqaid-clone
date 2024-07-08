/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityContractor} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation updateContractorMutation($id: default_contractors_pk_columns_input!, $_set: default_contractors_set_input!) {
        update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {
            
            company {
                id
                name
            }
            client {
                id
                name
            }
            project {
                id
                name
            }
        }
    }
`;

// 3
export default async (attrs: EntityContractor) => {

};
