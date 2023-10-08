/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";

export default async ({receipient_coid_provider_id}) => {
  let {
    company: {id: sender_company_id},
    client_id, project_id, site_id
  } = storage.loggedUser;
  
  sender_company_id = client_id || sender_company_id;
  
  return GQLClient
    .query({
      query: `
      query findByReceipientCOIDAProviderIdClaimsProviderRequestQuery {
        coida_claims_coid_provider_requests(
          where: {
            company_id: {_eq: ${sender_company_id}},
            receipient_coid_provider_id: {_eq: ${receipient_coid_provider_id}}
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
