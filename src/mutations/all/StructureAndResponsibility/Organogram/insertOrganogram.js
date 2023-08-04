/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityOrganogram} from "mutations/types.d.ts";
import findByIdOrganogram
    from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/OrganogramsTab/Query/List/findByIdOrganogram";

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

    // crudUtils.injectCreate(input);

    return await createMutationImpl({mutation, input}).
    then(res => res && findByIdOrganogram(res.id));
};
