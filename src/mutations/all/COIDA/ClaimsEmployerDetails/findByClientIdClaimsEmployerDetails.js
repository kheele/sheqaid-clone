/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
  coida_claims_employer_details_fragment
} from "views/plugins/plugin_claim_management/01_Claim_Management_For_Companies/dialogs/ClaimsEmployerDetailsDialog/Query/Fragments";
import {orgs_fragment} from "graphql/Fragments";

export default async (input: number) => {
  return GQLClient
    .query({
      query: `
      query findByClientIdClaimsEmployerDetailsQuery {
        coida_claims_employer_details(where:{client_id: ${input}}) {
          ${coida_claims_employer_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
    }).then(res => res && res[0]);
}
