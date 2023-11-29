/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityCompany} from "mutations/types.d.ts";
import {Dates} from "../../../utils/Dates";
import GQLClient from "../../../graphql/GQLClient";

// 2
const query = `
    query findByIdClientHRPrDPDateRangeDashboardStatsQuery($id: bigint, $dateStart: date, $dateEnd: date) {
        #doc_list
        list_aggregate:hr_employees_documents_aggregate(where: {
            employee: {client_id: {_eq: $id}},
            removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}, type: {_eq: "PrDP"}
        }){
            aggregate{
                count
            }
        }
    }
`;

// 3
export default async ({input, dates}) => await Promise.all(
    dates.map(async date => {
        const {start: dateStart, end: dateEnd} = date;
        const stats = await GQLClient.query({
            multi_queries: true,
            query,
            variables: {id: input, dateStart, dateEnd},
        });
        if (!stats) return {id: input, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};

        const {data: {list_aggregate: {aggregate: {count}}}} = stats;
        return {id: input, month_year: Dates.parse(dateStart).formatMonthYear(), count};
    })
);

