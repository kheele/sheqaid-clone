/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAnnexture1} from "mutations/types.d.ts";
import findByIdAnnexture1 from "./findByIdAnnexture1";

// 2
const mutation = graphql`
    mutation insertAnnexture1Mutation($object: coida_claims_annexture_1_insert_input!) {
        insert_coida_claims_annexture_1_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityAnnexture1) => {
    const {
    } = input;

    return await createMutationImpl({mutation, input}).
    then(res => res && findByIdAnnexture1(res.id));
};
