/* eslint-disable camelcase */

import findByIdAssetMonitoringPlanWorkingHrsOrKmListItem from "./findByIdAssetMonitoringPlanWorkingHrsOrKmListItem";
import updateAssetMonitoringPlanWorkingHrsOrKmListItem from "./updateAssetMonitoringPlanWorkingHrsOrKmListItem";
import insertAssetMonitoringPlanWorkingHrsOrKmListItem from "./insertAssetMonitoringPlanWorkingHrsOrKmListItem";

// 3
export default async (attrs) => {
	const {
		id,
		working_hrs_or_km_opening,
		working_hrs_or_km_closing,
		// working_hrs_or_km,
		date,
		monitoring_plan_id,
	} = attrs;

	if (id) {
		const item = await findByIdAssetMonitoringPlanWorkingHrsOrKmListItem(id);
		if (!item) return;

		return updateAssetMonitoringPlanWorkingHrsOrKmListItem(attrs, true);
	}

	delete attrs.id;

	return insertAssetMonitoringPlanWorkingHrsOrKmListItem(attrs);
};
