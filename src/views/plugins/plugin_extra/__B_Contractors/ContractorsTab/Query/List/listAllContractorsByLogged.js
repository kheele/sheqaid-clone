import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_no_site_fragment} from "graphql/Fragments";
import {contractor_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    site_name,
    name,
    username,
    //
    site_id, project_id, client_id,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    site_name,
    name,
    username,
    //
    site_id, project_id, client_id,
  });

  return GQLClient
  .query({
    query: `
      query listAllContractorsByLoggedQuery {
        default_contractors(
          where: {
            ${filter}
          },
          order_by: {name: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${contractor_details_fragment()}
        }
      }
    `,
  });
};