import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {chemical_sds_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    name,
    category,
    manufacturer,
    risk_level,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = true,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    name,
    category,
    manufacturer,
    risk_level,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllSDSByLoggedQuery {
        sheq_chemical_sds(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          order_by: {lname: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${chemical_sds_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
  });
};
