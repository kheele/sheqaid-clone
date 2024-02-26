/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPPE} from "mutations/types.d.ts";
import findByIdPPEItem from "./findByIdPPEItem";

// 2
const mutation = graphql`
    mutation updatePPEItemMutation($id: ppe_items_pk_columns_input!, $_set: ppe_items_set_input!) {
        update_ppe_items_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityPPE) => {
	const {
		id,
		profile_pic,
	} = attrs;
	
	const has_doc = profile_pic && !profile_pic.dlUrls;
	if (has_doc) {
		try {
			const gcsUri = await workers.emit("files/upload", {
				file: profile_pic.buffer,
				path: `ppes/ppe-items/${id}`,
				name: "ppe-item-doc",
			});
			console.log("gcsUri", gcsUri);
			
			if (gcsUri) {
				attrs.profile_pic = gcsUri;
			}
		} catch (err) {
			console.log('updatePPE error', err)
		}
	}
	
	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then((res) => res && findByIdPPEItem(res.id));
};
