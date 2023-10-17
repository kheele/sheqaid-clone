import GQLClient from "graphql/GQLClient";
import {orgs_contractor_fragment, user_personal_details_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
  {
    offset = 0,
    limit = 50,
    //
    removed = false,
    name,
    //
    exact_orgs = false,
  }
) => {
  const {filter} = getVariablesAndQueryConfig({
    name,
    //
    exact_orgs
  });

  return GQLClient
  .query({
    query: `
      query listAllActiveUserByLoggedQuery {
        default_contractor_users(
            where: {
                removed: {_eq: ${removed}},
                ${filter}
            },
            order_by: {lname: asc, fname: asc},
            offset: ${offset},
            limit: ${limit}
        ) {
              ${user_personal_details_fragment}
              ${orgs_contractor_fragment}
        }
      }
    `,
  });
};