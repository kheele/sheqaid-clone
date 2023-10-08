/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityClaimsProviderRequest} from "mutations/types.d.ts";
import GQLClient from "../../../../graphql/GQLClient";
import {
  coida_claims_employer_details_fragment
} from "../../../../views/plugins/plugin_claim_management/01_Claim_Management_For_Companies/dialogs/ClaimsEmployerDetailsDialog/Query/Fragments";
import {orgs_fragment} from "../../../../graphql/Fragments";

// 2
const query = graphql`
  query findByIdClaimsProviderRequestQuery($id: bigint) {
    coida_claims_coid_provider_requests_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
            id
            created_at
            status
            receipient_coid_provider{
              id
              name
            }
            user{
              id
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
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });

export default async (input: number) => {
  return GQLClient
    .query({
      query: `
      query findByIdClaimsEmployerDetailsQuery {
        coida_claims_employer_details_by_pk(id: ${input}) {
          ${coida_claims_employer_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
    });
}
