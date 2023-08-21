/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityJobCategory} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertJobCategoryMutation($object: default_job_categories_insert_input!) {
    insert_default_job_categories_one(
      object: $object
    ) {
      id
      created_at
      name
      job_category_owner
      job_position_list_aggregate{
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
export default async (input: EntityJobCategory) => {
  const {
    name,
    client_id
  } = input;

  const {company, user} = storage.loggedUser;
  input.user_id = user.id;
  input.company_id = company.id;

  return await createMutationImpl({mutation, input});
};
