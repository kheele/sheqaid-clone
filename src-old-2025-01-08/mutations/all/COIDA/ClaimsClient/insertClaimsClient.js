/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityClaimsClient} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdClaimsClient from "./findByIdClaimsClient";

// 2
const mutation = graphql`
    mutation insertClaimsClientMutation($object: coida_claims_insert_input!) {
        insert_coida_claims_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityClaimsClient) => {
    const {
    
    } = input;

    crudUtils.injectCreate(input);

    return await createMutationImpl({mutation, input}).
    then(res => res && findByIdClaimsClient(res.id));
};
