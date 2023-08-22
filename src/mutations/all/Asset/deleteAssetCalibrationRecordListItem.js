/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAssetCalibrationRecordListItem from "./findByIdAssetCalibrationRecordListItem";

// 2
const mutation = graphql`
    mutation deleteAssetCalibrationRecordListItemMutation($id: bigint!) {
        delete_asset_calibration_record_list_by_pk(id: $id) {
            id
        }
    }
`;

// 3
export default async (id) => {
	const item = await findByIdAssetCalibrationRecordListItem(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id,
	});
};
