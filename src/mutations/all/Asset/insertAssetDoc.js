/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {Dates} from "utils/Dates";
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
		// delete input.doc;
		input.doc = {path: doc.path};
	}

	const res = await createMutationImpl({mutation, input});
    return Promise((resolve, reject) => {
        sockets.on('insertAssetDoc', () => {
            console.log('insertAssetDoc');
            resolve(findByIdAssetDoc(res.id));
        });
    });
};
