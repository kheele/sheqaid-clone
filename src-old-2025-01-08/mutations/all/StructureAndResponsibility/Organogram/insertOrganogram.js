/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityOrganogram} from "mutations/types.d.ts";
import findByIdOrganogram
	from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/OrganogramsTab/Query/List/findByIdOrganogram";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import updateOrganogram from "./updateOrganogram";

// 2
const mutation = graphql`
    mutation insertOrganogramMutation($object: sheq_organograms_insert_input!) {
        insert_sheq_organograms_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityOrganogram) => {
	const {
		target, client, project, site, type, doc, employee_list
	} = input;

	crudUtils.injectCreate(input);

	if (doc) {
		delete input.doc;
	}

	const newItem = await createMutationImpl({mutation, input});

	if (newItem) {
		if (doc) {
			try {
				const path = `organograms/${newItem.id}`;
				const name = "organogram-doc";
				const gcsUri = await workers.emit("files/upload", {
					file: doc,
					path,
					name,
				});
				console.log("gcsUri", gcsUri);

				if (gcsUri) {
					return updateOrganogram({
						id: newItem.id,
						doc: gcsUri,
					});
				}
			} catch (err) {
				console.log('insertOrganogram error', err)
			}
		}
	}
	return newItem && findByIdOrganogram(newItem.id);
};
