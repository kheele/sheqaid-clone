/* eslint-disable camelcase */

import findByIdAssetDetails from "./findByIdAssetDetails";
import updateAssetDetails from "./updateAssetDetails";
import insertAssetDetails from "./insertAssetDetails";

// 3
export default async (attrs) => {
	const {
		id,
		owning_company,
		name,
		asset_type,
		desc,
		manufacturer,
		model,
		reg_num,
		serial_num,
		location,
		toolkit,
		condition,
		barcode,
		qr_code,
		notes,
	} = attrs;

	if(id) {
		const item = await findByIdAssetDetails(id);
		if (!item) return;

		return updateAssetDetails(attrs, true);
	}

	delete attrs.id;

	return insertAssetDetails(attrs);
};
