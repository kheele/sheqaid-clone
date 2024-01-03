/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";

// 2
const query = graphql`
    query findByIdEmployeeHRPrDPDashboardStatsQuery($id: bigint, $mon: date, $mon2: date, $mon3: date) {
        hr_employees_connection(where: {id: {_eq: $id}}) {
            edges {
                node {
                    id

                    #document_list
                    list_active_aggregate:document_list_aggregate(where: {removed: {_eq: false}, type: {_eq: "PrDP"}}){
                        aggregate{
                            count
                        }
                    }
                    list_removed_aggregate:document_list_aggregate(where: {removed: {_eq: true}, type: {_eq: "PrDP"}}){
                        aggregate{
                            count
                        }
                    }
                    list_no_expiry_aggregate:document_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}, type: {_eq: "PrDP"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    list_expired_aggregate:document_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}, type: {_eq: "PrDP"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    list_mon_expiry_aggregate:document_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}, type: {_eq: "PrDP"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    list_2mon_expiry_aggregate:document_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}, type: {_eq: "PrDP"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    list_3mon_expiry_aggregate:document_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}, type: {_eq: "PrDP"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    list_4mon_expiry_aggregate:document_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}, type: {_eq: "PrDP"}
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
