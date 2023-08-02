/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityCompany} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdCompanyQuery($id: bigint) {
    default_companies_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          account_type
          address
          business_id
          consultant
          email
          name
          no_projects
          phone
          profile_pic
          sector_list {
            id
            sector {
              id
              name
            }
          }
          module_list {
            id
            price
            module {
              id
              borderColor
              desc
              discount
              faIconLeft
              faIconRight
              has_update
              hover
              key
              price
              sort
              status
              svgIconLeft
              svgIconRight
              title
            }
          }
          zone {
            id
            name
          }
          country {
            id
            name
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
