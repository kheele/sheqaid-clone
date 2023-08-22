/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetMonitoringPlanWorkingHrsOrKmListItemQuery {
        asset_monitoring_plan_working_distance_or_time(
          where: {id: {_eq: ${input}},},
        ) {
            id
            monitoring_plan_id
            working_hrs_or_km_opening
            working_hrs_or_km_closing
            working_hrs_or_km
            date
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}