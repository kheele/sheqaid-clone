import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {hira_swp_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    //
    category,
    work_task,
    location,
    department,
    person_approving_procedure,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = true,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    category,
    work_task,
    location,
    department,
    person_approving_procedure,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllSWPByLoggedQuery {
        hira_swp(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          order_by: {work_task: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${hira_swp_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
  });
};
