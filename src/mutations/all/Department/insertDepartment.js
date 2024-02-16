/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityDepartment} from "mutations/types.d.ts";
import updateMutationImpl from "../../updateMutationImpl";

// 2
const mutation = graphql`
  mutation insertDepartmentMutation($object: default_departments_insert_input!) {
    insert_default_departments_one(
      object: $object
    ) {
      id
      created_at
      name
      ppe_type_list_aggregate{
        aggregate{
          count
        }
      }
      employee_list_aggregate{
        aggregate{
          count
        }
      }
      responsible_document_list_aggregate{
        aggregate{
          count
        }
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
export default async (input: EntityDepartment) => {
  const {
    name,
    client_id
  } = input;

  const {company, user} = storage.loggedUser;
  input.user_id = user.id;
  input.company_id = company.id;

  return await createMutationImpl({mutation, input});
};
