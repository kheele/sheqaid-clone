import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {ncr_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    expiry_date = 'ALL',
    mon, mon2, mon3,
    source,
    responsible_party_list,
    assigned_job_position_list,
    assigned_person_list,
    approving_person_list,
    type,
    priority,
    allocation,
    status_progress,
    status_acceptance,
    result,
    due_date_range,
    progress_date_range,
    completed_date_range,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = true,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    expiry_date,
    mon, mon2, mon3,
    source,
    responsible_party_list,
    assigned_job_position_list,
    assigned_person_list,
    approving_person_list,
    type,
    priority,
    allocation,
    status_progress,
    status_acceptance,
    result,
    due_date_range,
    progress_date_range,
    completed_date_range,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllNCRByLoggedQuery {
        sheq_non_conformances(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          order_by: {sort: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${ncr_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
  });
};
