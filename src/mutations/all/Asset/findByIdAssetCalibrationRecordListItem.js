/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetCalibrationRecordListItemQuery {
        asset_calibration_record_list(
          where: {id: {_eq: ${input}},},
        ) {
            id
            calibration_record_id
            calibrating_company
            reference_standard
            certificate_num
            calibration_date
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}