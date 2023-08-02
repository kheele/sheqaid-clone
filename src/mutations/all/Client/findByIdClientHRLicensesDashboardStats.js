/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityClient} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdClientHRLicensesDashboardStatsQuery($id: bigint, $mon: date, $mon2: date, $mon3: date) {
    default_clients_connection(where: {id: {_eq: $id}}) {
      edges {
          node {
              id

              #                    license_list
              list_active_aggregate:license_list_aggregate(where: {removed: {_eq: false}}){
                  aggregate{
                      count
                  }
              }
              list_removed_aggregate:license_list_aggregate(where: {removed: {_eq: true}}){
                  aggregate{
                      count
                  }
              }
              list_no_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_is_null: true}
              }){
                  aggregate{
                      count
                  }
              }
              list_expired_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_lte: "now()"}
              }){
                  aggregate{
                      count
                  }
              }
              list_mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
              }){
                  aggregate{
                      count
                  }
              }
              list_2mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
              }){
                  aggregate{
                      count
                  }
              }
              list_3mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
              }){
                  aggregate{
                      count
                  }
              }
              list_4mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: $mon3}
              }){
                  aggregate{
                      count
                  }
              }
          }
      }
    }
  }
`;
// 3
export default async ({input, mon, mon2, mon3}) =>
    findOneMutationImpl({query, variables: {id: input, mon, mon2, mon3}});
