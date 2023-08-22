/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetMonitoringPlanFuelUsageListItemQuery {
        asset_monitoring_plan_fuel_usage(
          where: {id: {_eq: ${input}},},
        ) {
            id
            monitoring_plan_id
            refilled_fuel
            current_hrs_or_km
            working_hrs_or_km
            date
            receipt
            cost
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}