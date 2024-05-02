/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAsset} from "mutations/types.d.ts";
import findByIdAsset from "./findByIdAsset";
import updateAssetPhoto from "./updateAssetPhoto";
import insertAssetPhoto from "./insertAssetPhoto";

export default async (attrs: EntityAsset) => {
	const {
		store_keeper_signature,
		manager_signature,
		comments,
		list
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

	await Promise.all(promises);

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdAsset(res.id));
};
