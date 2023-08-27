import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {hira_taskbased_ra_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    expiry_date = 'ALL',
    expiry_range,
    mon, mon2, mon3,
    activity,
    risk_tolerance,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = true,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    expiry_date,
    expiry_range,
    mon, mon2, mon3,
    activity,
    risk_tolerance,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllTaskBaseRiskAssessmentByLoggedQuery {
        hira_taskbased_ra(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          order_by: {activity: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${hira_taskbased_ra_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
  });
};
