/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";
import updateAssetDoc from "./updateAssetDoc";

// 2
const mutation = graphql`
    mutation insertAssetDocMutation($object: asset_docs_insert_input!) {
        insert_asset_docs_one(
            object: $object
        ) {
            id
            created_at
            doc
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
export default async (input) => {
	const {
		doc,
		expiry,
		title,
		desc,
		type,
		asset_id,
	} = input;

	if (doc) {
		delete input.doc;
	}

	const res = await createMutationImpl({mutation, input});
	if (res) {
		if (doc) {
			const id = convertIdToBigint(res.id);

			const path = `assets/${asset_id}/docs`;
			const name = `document-${id}-${Dates.formatTimestamp(new Date())}`;
			const gcsUri = await workers.emit("files/upload", {
				file: doc,
				path,
				name,
			});
			console.log("gcsUri", gcsUri);

			return updateAssetDoc({id, doc: gcsUri});
		}
	}

	return res;
};
