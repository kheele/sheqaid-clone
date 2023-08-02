/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";
import {
  asset_details_fragment
} from "views/plugins/plugin_sheq_assist/19_Maintenance/ToolsTab/Query/Fragments";
import {orgs_fragment,} from "graphql/Fragments";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetQuery {
        assets(
          where: {id: {_eq: ${input}},},
        ) {
            ${asset_details_fragment}
            ${orgs_fragment}
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}