/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {
	hira_sop_details_fragment
} from "views/plugins/plugin_sheq_assist/09_HIRA_And_Opportunities/SOPTab/Query/Fragments";

export default async (input: number) => {

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query findByIdSOPQuery {
        hira_sop(
          where: {id: {_eq: ${input}},},
        ) {
            ${hira_sop_details_fragment}
            ${orgs_fragment}
        }
      }
    `,
	}).then(res => res[0]);//.then(fillNullLists);
	//</editor-fold>
}