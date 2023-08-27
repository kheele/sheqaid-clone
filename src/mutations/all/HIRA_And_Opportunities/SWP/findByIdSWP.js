/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {
	hira_swp_details_fragment
} from "views/plugins/plugin_sheq_assist/09_HIRA_And_Opportunities/SWPTab/Query/Fragments";

export default async (input: number) => {

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query findByIdSWPQuery {
        hira_swp(
          where: {id: {_eq: ${input}},},
        ) {
            ${hira_swp_details_fragment}
            ${orgs_fragment}
        }
      }
    `,
	}).then(res => res[0]);//.then(fillNullLists);
	//</editor-fold>
}