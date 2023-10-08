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
      query findByIdClaimsEmployerDetailsQuery {
        coida_claims_employer_details_by_pk(id: ${input}) {
          ${coida_claims_employer_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
    });
}
