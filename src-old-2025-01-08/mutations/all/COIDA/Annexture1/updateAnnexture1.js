/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAnnexture1} from "mutations/types.d.ts";
import findByIdAnnexture1 from "./findByIdAnnexture1";

// 2
const mutation = graphql`
  mutation updateAnnexture1Mutation($id: coida_claims_annexture_1_pk_columns_input!, $_set: coida_claims_annexture_1_set_input!) {
    update_coida_claims_annexture_1_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityAnnexture1) => {
    const {
        id,
    } = attrs;

    const item = await findByIdAnnexture1(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).then(res => res && findByIdAnnexture1(res.id));
};
