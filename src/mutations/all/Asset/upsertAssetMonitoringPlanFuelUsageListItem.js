/* eslint-disable camelcase */

import findByIdAssetMonitoringPlanFuelUsageListItem from "./findByIdAssetMonitoringPlanFuelUsageListItem";
import updateAssetMonitoringPlanFuelUsageListItem from "./updateAssetMonitoringPlanFuelUsageListItem";
import insertAssetMonitoringPlanFuelUsageListItem from "./insertAssetMonitoringPlanFuelUsageListItem";

// 3
export default async (attrs) => {
	const {
		id,
		refilled_fuel,
		current_hrs_or_km,
		working_hrs_or_km,
		date,
		receipt,
		cost,
		monitoring_plan_id,
	} = attrs;

	if (id) {
		const item = await findByIdAssetMonitoringPlanFuelUsageListItem(id);
		if (!item) return;

		return updateAssetMonitoringPlanFuelUsageListItem(attrs, true);
	}

	delete attrs.id;

	return insertAssetMonitoringPlanFuelUsageListItem(attrs);
};
