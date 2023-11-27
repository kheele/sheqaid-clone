/* eslint-disable camelcase */

import GQLClient from "../../../graphql/GQLClient";

// 2
const query = `
    query findByIdCompanyHRPrDPDashboardStatsQuery($id: bigint, $mon: date, $mon2: date, $mon3: date) {
        #hr_employees_documents
        list_active_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}
        }){
            aggregate{
                count
            }
        }
        list_removed_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}
        }){
            aggregate{
                count
            }
        }
        list_no_expiry_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}, expiry_date: {_is_null: true}
        }){
            aggregate{
                count
            }
        }
        list_expired_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}, expiry_date: {_lte: "now()"}
        }){
            aggregate{
                count
            }
        }
        list_mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
        }){
            aggregate{
                count
            }
        }
        list_2mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
        }){
            aggregate{
                count
            }
        }
        list_3mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
        }){
            aggregate{
                count
            }
        }
        list_4mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
            employee: {company_id: {_eq: $id}},
            type: {_eq: "PrDP"},
            removed: {_eq: false}, expiry_date: {_gt: $mon3}
        }){
            aggregate{
                count
            }
        }
    }
`;

// 3
export default async ({input, mon, mon2, mon3}) =>
    GQLClient.query({query, variables: {id: input, mon, mon2, mon3}});
