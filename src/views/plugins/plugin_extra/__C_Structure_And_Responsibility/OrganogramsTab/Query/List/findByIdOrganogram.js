import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {organogram_details_fragment} from "../Fragments";

export default (id) => {
	return GQLClient
	.query({
		query: `
      query findByIdOrganogramQuery {
        sheq_organograms(
          where: {
            id: {_eq: ${id}}
          }
        ) {
          ${organogram_details_fragment}
          ${orgs_fragment}
        }
      }
    `,
	}).then(res => res && res[0]);
};