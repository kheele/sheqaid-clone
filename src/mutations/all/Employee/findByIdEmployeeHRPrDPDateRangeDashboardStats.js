/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {Dates} from "utils/Dates";

// 2
const query = graphql`
    query findByIdEmployeeHRPrDPDateRangeDashboardStatsQuery($id: bigint, $dateStart: date, $dateEnd: date) {
        #document_list
        hr_employees_connection(where: {id: {_eq: $id}}) {
            edges {
                node {
                    id
                    #document_list
                    list_aggregate:document_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}, type: {_eq: "PrDP"}
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
export default async ({input, dates}) => await Promise.all(
    dates.map(async date => {
        const {start: dateStart, end: dateEnd} = date;
        const stats = await findOneMutationImpl({query, variables: {id: input, dateStart, dateEnd}});
        if (!stats) return {id: input, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};

        const {id, data: {list_aggregate: {aggregate: {count}}}} = stats;
        return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count};
    })
);

