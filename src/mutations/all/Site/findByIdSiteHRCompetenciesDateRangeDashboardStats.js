/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntitySite} from "mutations/types.d.ts";
import {Dates} from "../../../utils/Dates";

// 2
const query = graphql`
    query findByIdSiteHRCompetenciesDateRangeDashboardStatsQuery($id: bigint, $dateStart: date, $dateEnd: date) {
        default_sites_connection(where: {id: {_eq: $id}}) {
            edges {
                node {
                    id
                    #                   competency_list
                    list_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}
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

