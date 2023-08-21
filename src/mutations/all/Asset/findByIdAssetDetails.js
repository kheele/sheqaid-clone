/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetDetailsQuery {
        asset_details(
          where: {id: {_eq: ${input}},},
        ) {
            id
            owning_company
            name
            asset_type
            desc
            manufacturer
            model
            reg_num
            serial_num
            location
            toolkit
            condition
            barcode
            qr_code
            notes
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}