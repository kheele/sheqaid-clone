/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {Dates} from "utils/Dates";
import findByIdAssetPhoto from "./findByIdAssetPhoto";

// 2
const mutation = graphql`
    mutation updateAssetPhotoMutation($id: asset_photos_pk_columns_input!, $_set: asset_photos_set_input!) {
        update_asset_photos_by_pk(pk_columns: $id, _set: $_set) {
            id
            doc
            is_default
            asset_id
            asset{
                id
            }
        }
    }
`;

// 3
export default async (attrs) => {
	const {
		id,
		doc,
		is_default,
		asset_id,
	} = attrs;

	const item = await findByIdAssetPhoto(id);
	if (!item) return;

	if (doc && !doc.dlUrls) {
		const path = `assets/${asset_id}/photos`;
		const name = `document-${id}-${Dates.formatTimestamp(new Date())}`;
		const gcsUri = await workers.emit("files/upload", {
			file: doc,
			path,
			name,
		});
		console.log("gcsUri", gcsUri);

		attrs.doc = gcsUri;
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	});
};
