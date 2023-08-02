/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySector} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertSectorMutation($object: default_sectors_insert_input!) {
    insert_default_sectors_one(
      object: $object
    ) {
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
export default async (input: EntitySector) =>
  createMutationImpl({ mutation, input });
