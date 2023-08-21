/* eslint-disable camelcase */

import findByIdAssetPurchaseInfo from "./findByIdAssetPurchaseInfo";
import updateAssetPurchaseInfo from "./updateAssetPurchaseInfo";
import insertAssetPurchaseInfo from "./insertAssetPurchaseInfo";

// 3
export default async (attrs) => {
	const {
		id,
		acquisition_date,
		vendor,
		acquisition_value,
		warranty_expiry,
		reference_num,
		warranty_certificate,
	} = attrs;

	if(id) {
		const item = await findByIdAssetPurchaseInfo(id);
		if (!item) return;

		return updateAssetPurchaseInfo(attrs, true);
	}

	delete attrs.id;

	return insertAssetPurchaseInfo(attrs);
};
