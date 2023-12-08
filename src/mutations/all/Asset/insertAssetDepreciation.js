/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import findByIdAssetDepreciation from "./findByIdAssetDepreciation";

// 2
const mutation = graphql`
    mutation insertAssetDepreciationMutation($object: asset_depreciation_insert_input!) {
        insert_asset_depreciation_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input) => {
	const {
		depreciation_method,
		asset_cost,
		salvage_value,
		depreciation_years,
		depreciation_factor,
		partial_year_depreciation,
	} = input;

	return await createMutationImpl({mutation, input}).
    then(res => res && findByIdAssetDepreciation(res.id));
};
