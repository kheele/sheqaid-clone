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
          query findByClientIdClaimsEmployerDetailsQuery($id: bigint) {
            coida_claims_employer_details(where:{client_id: $id}) {
              ${coida_claims_employer_details_fragment}
              ${orgs_fragment}
            }
          }
      `,
      variables: {id: input},
    }).then(res => res && res[0]);
}
