/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntitySector} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateSectorMutation($id: default_sectors_pk_columns_input!, $_set: default_sectors_set_input!) {
    update_default_sectors_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        name
        desc
        sector_owner
        training_course_list_aggregate{
            aggregate{
                count
            }
        }
        company_list_aggregate{
            aggregate{
                count
            }
        }
        client_list_aggregate{
            aggregate{
                count
            }
        }
        company {
            id
            name
        }
        client {
            id
            name
        }
    }
  }
`;

// 3
export default async (attrs: EntitySector) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
