/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {Dates} from "utils/Dates";
import findByIdAssetDoc from "./findByIdAssetDoc";

// 2
const mutation = graphql`
    mutation updateAssetDocMutation($id: asset_docs_pk_columns_input!, $_set: asset_docs_set_input!) {
        update_asset_docs_by_pk(pk_columns: $id, _set: $_set) {
            id
            created_at
            doc
			date
            expiry
            title
            desc
            type
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
		date,
		expiry,
		title,
		desc,
		type,
		asset_id,
	} = attrs;

	const item = await findByIdAssetDoc(id);
	if (!item) return;

	if (doc && !doc.dlUrls) {
		const path = `assets/${asset_id}/docs`;
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
