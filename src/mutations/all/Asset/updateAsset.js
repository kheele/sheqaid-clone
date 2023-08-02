/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAsset} from "mutations/types.d.ts";
import findByIdAsset from "./findByIdAsset";

// 2
const mutation = graphql`
    mutation updateAssetMutation($id: assets_pk_columns_input!, $_set: assets_set_input!) {
        update_assets_by_pk(pk_columns: $id, _set: $_set) {
            id
            #        created_at

        }
    }
`;

// 3
export default async (attrs: EntityAsset) => {
	const {
		id,
	} = attrs;

	const item = await findByIdAsset(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdAsset(res.id));
};
