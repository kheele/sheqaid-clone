/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetDepreciationQuery {
        asset_depreciation(
          where: {id: {_eq: ${input}},},
        ) {
            id
            depreciation_method
            asset_cost
            salvage_value
            depreciation_years
            depreciation_factor
            partial_year_depreciation
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}