import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {chemical_hazchem_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    name,
    category,
    manufacturer,
    physical_state,
    type,
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
    physical_state,
    type,
    risk_level,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllHazchemSheetsByLoggedQuery {
        sheq_chemical_hazchem_sheets(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          order_by: {name: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${chemical_hazchem_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
  });
};
