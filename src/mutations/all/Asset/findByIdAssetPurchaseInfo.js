/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetPurchaseInfoQuery {
        asset_purchase_info(
          where: {id: {_eq: ${input}},},
        ) {
            id
            acquisition_date
            vendor
            acquisition_value
            warranty_expiry
            reference_num
            warranty_certificate
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}