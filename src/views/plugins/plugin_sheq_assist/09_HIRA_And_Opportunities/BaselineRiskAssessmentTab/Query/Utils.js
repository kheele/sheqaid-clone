import {orgsFilter} from "graphql/Filters";
import {Dates} from "utils/Dates";

export const getVariablesAndQueryConfig = (
	{
		expiry_date = 'ALL',
		expiry_range,
		mon, mon2, mon3,
		activity,
		risk_tolerance,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgsFilter({site_id, project_id, client_id, exact_orgs,});

	if (expiry_date === null) {//expiry_no
		filter.push(`expiry_date: {_is_null: true}`);
	} else if (expiry_date === -1) {//expired
		filter.push(`expiry_date: {_lte: "now()"}`);
	} else if (expiry_date === 1) {//expired_1mon
		filter.push(`expiry_date: {_gt: "now()", _lte: "${mon}"}`);
	} else if (expiry_date === 2) {//expired_2mon
		filter.push(`expiry_date: {_gt: "${mon}", _lte: "${mon2}"}`);
	} else if (expiry_date === 3) {//expired_3mon
		filter.push(`expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}`);
	} else if (expiry_date === 4) {//expired_4mon
		filter.push(`expiry_date: {_gt: "${mon3}"}`);
	}

	if (activity) {
		filter.push(`activity: {_ilike: "%${activity}%"}`);
	}
	if (risk_tolerance) {
		filter.push(`risk_tolerance: {_eq: ${risk_tolerance}}`);
	}

	if (expiry_range) {
		const {start, end} = expiry_range;
		if(start && end) {
			filter.push(`expiry_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
		} else if(start) {
			filter.push(`expiry_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
		} else if(end) {
			filter.push(`expiry_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
		}
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};