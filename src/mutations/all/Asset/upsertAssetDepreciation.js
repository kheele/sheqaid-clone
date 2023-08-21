/* eslint-disable camelcase */

import findByIdAssetDepreciation from "./findByIdAssetDepreciation";
import updateAssetDepreciation from "./updateAssetDepreciation";
import insertAssetDepreciation from "./insertAssetDepreciation";

// 3
export default async (attrs) => {
	const {
		id,
		depreciation_method,
		asset_cost,
		salvage_value,
		depreciation_years,
		depreciation_factor,
		partial_year_depreciation,
	} = attrs;

	if(id) {
		const item = await findByIdAssetDepreciation(id);
		if (!item) return;

		return updateAssetDepreciation(attrs, true);
	}

	delete attrs.id;

	return insertAssetDepreciation(attrs);
};
