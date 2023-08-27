import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {hira_sop_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    category,
    risk_level,
    location,
    task,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = true,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    category,
    risk_level,
    location,
    task,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllSOPByLoggedQuery {
        hira_sop(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          #order_by: {sort: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${hira_sop_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
  });
};
