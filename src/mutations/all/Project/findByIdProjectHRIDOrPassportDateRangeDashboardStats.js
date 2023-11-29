/* eslint-disable camelcase */

import {Dates} from "utils/Dates";
import GQLClient from "graphql/GQLClient";

// 2
const query = `
    query findByIdProjectHRIDOrPassportDateRangeDashboardStatsQuery($id: bigint, $dateStart: date, $dateEnd: date) {
        #doc_list
        list_aggregate:hr_employees_documents_aggregate(where: {
            employee: {project_id: {_eq: $id}},
            removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}, type: {_eq: "ID/Passport"}
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

