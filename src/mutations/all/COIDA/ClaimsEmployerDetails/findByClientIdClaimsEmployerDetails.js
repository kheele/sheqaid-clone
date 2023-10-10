/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
  coida_claims_employer_details_fragment
} from "views/plugins/plugin_claim_management/01_Claim_Management_For_Companies/dialogs/ClaimsEmployerDetailsDialog/Query/Fragments";
import {orgs_no_project_and_site_fragment} from "graphql/Fragments";

export default async (input: number) => {
  return GQLClient
    .query({
      query: `
          query findByClientIdClaimsEmployerDetailsQuery {
            coida_claims_employer_details(where:{client_id: {_eq: ${input}}}) {
              ${coida_claims_employer_details_fragment}
              ${orgs_no_project_and_site_fragment}
            }
          }
      `,
    }).then(res => res && res[0]);
}
//"Error: [{"extensions":{"code":"validation-failed","path":"$.selectionSet.coida_claims_employer_details.selectionSet.project"},"message":"field 'project' not found in type: 'coida_claims_employer_details'"}]
//     at /app/src/sockets/controllers/general/graphql/index.js:138:23
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async EventManager.emit (/app/src/sockets/eventManager.js:38:13)
//     at async Socket.<anonymous> (/app/src/sockets/controllers/index.js:15:16)"
