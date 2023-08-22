/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetMaintenancePlanListItemQuery {
        asset_maintenance_plan_list(
          where: {id: {_eq: ${input}},},
        ) {
            id
            maintenance_plan_id
            reason_for_service
            service
            service_hrs_or_km
            service_date
            cost
            receipt
            parts_used_list{
              id
              plan_list_id
              qty
              part{
                id
                asset_id
                asset_type
                name
              }
            }
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}