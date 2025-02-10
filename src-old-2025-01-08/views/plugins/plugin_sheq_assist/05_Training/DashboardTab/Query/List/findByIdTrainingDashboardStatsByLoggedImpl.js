import GQLClient from "graphql/GQLClient";
import {
	training_plan_stats_frequency_vertical_bar_chart_fragment,
	training_plan_stats_top_counter_fragment,
	training_plan_stats_top_doughnut_chart_fragment
} from "../Fragments";

export default (
	{
		interval = 'Month',
		employee_view = 'active',
		range_start = '- All -',
		range_end = '- All -',
		org_props: {tbl, id},
	}
) => {
	const variables = {id};

	range_start = isString(range_start) && range_start.contains("All") ? null : range_start;
	range_end = isString(range_end) && range_end.contains("All") ? null : range_end;

	if (interval === "Month") {
		if (range_start || range_end) {
			{
				const {year, month, start, end} = range_start || {};
				start && (range_start = start);
				end && (range_end = end);
			}
			{
				const {year, month, start, end} = range_end || {};
				!range_start && start && (range_start = start);
				end && (range_end = end);
			}

			// monStart = new Date();
			// monEnd = monStart;
			// dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
		}
	} else if (interval === "Quarter") {
		if (range_start || range_end) {
			{
				const {year, quarter, start, end} = range_start || {};
				start && (range_start = start);
				end && (range_end = end);
			}
			{
				const {year, quarter, start, end} = range_end || {};
				!range_start && start && (range_start = start);
				end && (range_end = end);
			}

			// dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
		}
	} else if (interval === "Bi-Annual") {
		if (range_start || range_end) {
			{
				const {year, half, start, end} = range_start || {};
				start && (range_start = start);
				end && (range_end = end);
			}
			{
				const {year, half, start, end} = range_end || {};
				!range_start && start && (range_start = start);
				end && (range_end = end);
			}

			// dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
		}
	} else if (interval === "Annual") {
		if (range_start || range_end) {
			if (range_start && range_end) {
				range_start = `${range_start}-01-01`;
				range_end = `${range_end}-12-31`;
			} else if (range_start) {
				range_start = `${range_start}-01-01`;
				range_end = `${range_start}-12-31`;
			} else if (range_end) {
				range_start = `${range_end}-01-01`;
				range_end = `${range_end}-12-31`;
			}

			// const yearStart = `01-01-${new Date().getFullYear()}`;
			// monStart = Dates.parse(yearStart);
			// monEnd = Dates.parse(yearStart).addMonths(12);
			// dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
		}
	}

	if (employee_view === 'active') {
		return GQLClient
		.query({
			variables,
			multi_queries: true,
			query: `
        query findByIdTrainingDashboardStatsQuery(
            $id: bigint
        ) {
            stats_top_counter:${tbl}(where: {id: {_eq: $id}}) {
                ${training_plan_stats_top_counter_fragment({range_start, range_end})}
            }
            stats_top_doughnut_chart:${tbl}(where: {id: {_eq: $id}}) {
                ${training_plan_stats_top_doughnut_chart_fragment({range_start, range_end})}
            }
        }
      `,
		});
	} else {
		return GQLClient
		.query({
			variables,
			multi_queries: true,
			query: `
        query findByIdTrainingDashboardStatsQuery(
            $id: bigint
        ) {
            stats_top_counter:${tbl}(where: {id: {_eq: $id}}) {
                ${training_plan_stats_top_counter_fragment({range_start, range_end})}
            }
            stats_top_doughnut_chart:${tbl}(where: {id: {_eq: $id}}) {
                ${training_plan_stats_top_doughnut_chart_fragment({range_start, range_end})}
            }
        }
      `,
		});
	}
};
// frequency_vertical_bar_chart:${tbl}(where: {id: {_eq: $id}}) {
// 	${training_plan_stats_frequency_vertical_bar_chart_fragment(dates)}
// }