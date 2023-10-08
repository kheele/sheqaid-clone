/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
  coida_claims_fragment
} from "views/plugins/plugin_claim_management/01_Claim_Management_For_Companies/ClaimsClientTab/Query/Fragments";
import {orgs_fragment} from "graphql/Fragments";

export default async (input: number) => {
  return GQLClient
    .query({
      query: `
      query findByIdClaimsClientQuery {
        coida_claims_by_pk(id: ${input}) {
          ${coida_claims_fragment}
          ${orgs_fragment}
        }
      }
    `,
    });
}
