import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {chemical_product_details_fragment} from "../Fragments";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    name,
    manufacturer,
    type,
    category,
    physical_state,
    risk_level,
    is_stable,
    is_hazardous,
    is_combustible,
    is_flammable,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = true,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    name,
    manufacturer,
    type,
    category,
    physical_state,
    risk_level,
    is_stable,
    is_hazardous,
    is_combustible,
    is_flammable,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllInventoryProductsByLoggedQuery {
        sheq_chemical_products(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          order_by: {name: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${chemical_product_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
  });
};