/* eslint-disable camelcase */

import findByIdAssetMaintenancePlanListItem from "./findByIdAssetMaintenancePlanListItem";
import updateAssetMaintenancePlanListItem from "./updateAssetMaintenancePlanListItem";
import insertAssetMaintenancePlanListItem from "./insertAssetMaintenancePlanListItem";

// 3
export default async (attrs) => {
	const {
		id,
		reason_for_service,
		service,
		service_hrs_or_km,
		service_date,
		parts_used,
		cost,
		receipt,
		maintenance_plan_id,
	} = attrs;

	if (id) {
		const item = await findByIdAssetMaintenancePlanListItem(id);
		if (!item) return;

		return updateAssetMaintenancePlanListItem(attrs, true);
	}

	delete attrs.id;

	return insertAssetMaintenancePlanListItem(attrs);
};
