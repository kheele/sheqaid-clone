/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityBaselineRA} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdBaselineRA from "./findByIdBaselineRA";

// 2
const mutation = graphql`
    mutation insertBaselineRAMutation($object: hira_baseline_ra_insert_input!) {
        insert_hira_baseline_ra_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityBaselineRA) => {
	const {
		client_id,
		project_id,
		site_id,
		activity,
		risk_tolerance,
		expiry_date,
		list,
	} = input;

	crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input}).then(res => res && findByIdBaselineRA(res.id));
};
