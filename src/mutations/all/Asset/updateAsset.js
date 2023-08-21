/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAsset} from "mutations/types.d.ts";
import findByIdAsset from "./findByIdAsset";
import updateAssetDoc from "./updateAssetDoc";
import insertAssetDoc from "./insertAssetDoc";
import updateAssetPhoto from "./updateAssetPhoto";
import insertAssetPhoto from "./insertAssetPhoto";

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
		photo_list,
		doc_list,
	} = attrs;

	const item = await findByIdAsset(id);
	if (!item) return;

	const promises = [];

	if(photo_list && photo_list.isNotEmpty()) {
		delete attrs.photo_list;
		promises.push(Promise.all(photo_list.map(async (v, n) => {
			if(v.id) {
				return updateAssetPhoto(v);
			} else {
				return insertAssetPhoto({...v, asset_id: id});
			}
		})));
	}

	if(doc_list && doc_list.isNotEmpty()) {
		delete attrs.doc_list;
		promises.push(Promise.all(doc_list.map(async (v, n) => {
			if(v.id) {
				return updateAssetDoc(v);
			} else {
				return insertAssetDoc({...v, asset_id: id});
			}
		})));
	}

	await Promise.all(promises);

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdAsset(res.id));
};
