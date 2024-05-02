/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import crudUtils from "../CRUDUtils/CRUDUtils";
import updatePPEItem from "./updatePPEItem";
import findByIdPPEItem from "./findByIdPPEItem";

// 2
const mutation = graphql`
    mutation insertPPEItemMutation($object: ppe_items_insert_input!) {
        insert_ppe_items_one(
            object: $object
        ) {
            id
            removed
            created_at
            notes
            profile_pic
            serial_num
            purchase_date
            condition
            ppe_type{
                id
            }
        }
    }
`;

// 3
export default async (input) => {
	const {
		ppe_type,
		serial_num,
		purchase_date,
		condition,
		notes,
		profile_pic,
	} = input;

	if (profile_pic) {
		delete input.profile_pic;
	}

	crudUtils.injectCreate(input, true);

	const newItem = await createMutationImpl({mutation, input});

	if (newItem) {
		if (profile_pic) {
			try {
				const path = `ppes/ppe-items/${newItem.id}`;
				const name = "ppe-item-doc";
				const gcsUri = await workers.emit("files/upload", {
					file: profile_pic,
					path,
					name,
				});
				console.log("gcsUri", gcsUri);

				if (gcsUri) {
					return updatePPEItem({
						id: newItem.id,
						profile_pic: gcsUri,
					});
				}
			} catch (err) {
				console.log('insertPPEItem error', err)
			}
		}
		return findByIdPPEItem(newItem.id);
	}
	return newItem;
};
