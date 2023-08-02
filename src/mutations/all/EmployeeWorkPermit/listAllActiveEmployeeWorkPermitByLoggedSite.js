/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeWorkPermitByLoggedSiteQuery($site_id: bigint) {
    hr_employees_docs_work_permits_connection(where: {removed: {_eq: false}, site_id: {_eq: $site_id}}) {
      edges {
        node {
          id
          created_at
          doc
          date
          expiry_date
          expiry_updated
          removed
          notes
          employee{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
          }
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
          site {
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
    listMutationImpl({ query, variables: {site_id: input} });
