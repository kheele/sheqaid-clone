/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProject} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProjectMutation($object: default_projects_insert_input!) {
    insert_default_projects_one(
      object: $object
    ) {
      id
      created_at
      name
      address
      client{
        id
        name
      }
      site_list{
        id
        name
      }
      site_list_aggregate {
        aggregate {
          count
        }
      }
      contractor_list_aggregate {
        aggregate {
          count
        }
      }
      user_list_aggregate {
        aggregate {
          count
        }
      }
      employee_list_aggregate {
        aggregate {
          count
        }
      }
      team_list_aggregate {
        aggregate {
          count
        }
      }
      incident_list_aggregate {
        aggregate {
          count
        }
      }
      training_matrix_list_aggregate {
        aggregate {
          count
        }
      }
      asset_list_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

// 3
export default async (input: EntityProject) => {
  const {
    name,
    address,
    client_id
  } = input;

  const {company, user} = storage.loggedUser;
  input.user_id = user.id;
  input.company_id = company.id;

  return await createMutationImpl({mutation, input});
};
