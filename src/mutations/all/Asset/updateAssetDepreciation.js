/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetDepreciation from "./findByIdAssetDepreciation";

// 2
const mutation = graphql`
    mutation updateAssetDepreciationMutation($id: asset_depreciation_pk_columns_input!, $_set: asset_depreciation_set_input!) {
        update_asset_depreciation_by_pk(pk_columns: $id, _set: $_set) {
            id
            depreciation_method
            asset_cost
            salvage_value
            depreciation_years
            depreciation_factor
            partial_year_depreciation
        }
    }
`;

// 3
export default async (attrs, exists = false) => {
	const {
		id,
		depreciation_method,
		asset_cost,
		salvage_value,
		depreciation_years,
		depreciation_factor,
		partial_year_depreciation,
	} = attrs;

	if(!exists && id) {
		const item = await findByIdAssetDepreciation(id);
		if (!item) return;
	}

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	});
};
