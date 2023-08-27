/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";
import {
    hira_taskbased_ra_list_details_fragment
} from "views/plugins/plugin_sheq_assist/09_HIRA_And_Opportunities/TaskBaseRiskAssessmentTab/Query/Fragments";

export default async (input: number) => {

    //<editor-fold desc="ByEach">
    return GQLClient
    .query({
        query: `
      query findByIdTaskbasedRAListItemQuery {
        hira_taskbased_ra_list(
          where: {id: {_eq: ${input}},},
        ) {
            ${hira_taskbased_ra_list_details_fragment}
        }
      }
    `,
    }).then(res => res[0]);//.then(fillNullLists);
    //</editor-fold>
}