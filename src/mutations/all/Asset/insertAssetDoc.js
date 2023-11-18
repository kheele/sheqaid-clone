/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {whenFileReady} from "utils/Utils";
import createMutationImpl from "mutations/createMutationImpl";
import updateAssetDoc from "./updateAssetDoc";
import findByIdAssetDoc from "./findByIdAssetDoc";

// 2
const mutation = graphql`
    mutation insertAssetDocMutation($object: asset_docs_insert_input!) {
        insert_asset_docs_one(
            object: $object
        ) {
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
export default async (input) => {
	const {
		doc,
        date,
		expiry,
		title,
		desc,
		type,
		asset_id,
	} = input;

	if (doc) {
		// delete input.doc;
		input.doc = {path: doc.path};
	}

	const item = await createMutationImpl({mutation, input});
    return whenFileReady(item, findByIdAssetDoc);
};
