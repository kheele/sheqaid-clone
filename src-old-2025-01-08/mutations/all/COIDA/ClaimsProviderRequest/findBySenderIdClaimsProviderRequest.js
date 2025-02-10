/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";

export default async ({sender_company_id}) => {
  return GQLClient
    .query({
      query: `
      query findBySenderIdClaimsProviderRequestQuery {
        coida_claims_coid_provider_requests(
          where: {
            company_id: {_eq: ${sender_company_id}},
            status: {_eq: "Accepted"}
          }
        ) {
          id
          created_at
          status
          receipient_coid_provider_id
          receipient_coid_provider{
            id
            name
          }
          client{
            id
            name
          }
          company{
            id
            name
          }
        }
      }
    `,
    }).then(res => res && res[0]);
}
