/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityDocument} from "mutations/types.d.ts";
import findByIdDocument from "./findByIdDocument";
import crudUtils from "../CRUDUtils/CRUDUtils";
import updateMutationImpl from "../../updateMutationImpl";
import {Dates} from "../../../utils/Dates";

// 2
const mutation = graphql`
    mutation insertDocumentMutation($object: sheq_documents_insert_input!) {
        insert_sheq_documents_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityDocument) => {
	const {
		doc_type,
		//0
		client_id,
		project_id,
		site_id,
		//1
		responsible_department_id,
		responsible_person_id,
		expiry,
		internal_or_external,
		category_id,
		desc,
		//2
		title,
		doc_version_list,//[{type,expiry,doc,doc_docs_id,doc_num}]
	} = input;

	crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input}).then(res => res && findByIdDocument(res.id));
};