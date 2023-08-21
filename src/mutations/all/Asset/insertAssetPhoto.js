/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
import createMutationImpl from "mutations/createMutationImpl";
import updateAssetPhoto from "./updateAssetPhoto";

// 2
const mutation = graphql`
    mutation insertAssetPhotoMutation($object: asset_photos_insert_input!) {
        insert_asset_photos_one(
            object: $object
        ) {
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
export default async (input) => {
	const {
		doc,
		is_default,
		asset_id,
	} = input;

	if (doc) {
		delete input.doc;
	}

	const res = await createMutationImpl({mutation, input});
	if (res) {
		if (doc) {
			const id = convertIdToBigint(res.id);

			const path = `assets/${asset_id}/photos`;
			const name = `document-${id}-${Dates.formatTimestamp(new Date())}`;
			const gcsUri = await workers.emit("files/upload", {
				file: doc,
				path,
				name,
			});
			console.log("gcsUri", gcsUri);

			return updateAssetPhoto({id, doc: gcsUri});
		}
	}

	return res;
};
