/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityWCL2} from "mutations/types.d.ts";
import findByIdWCL2 from "./findByIdWCL2";

// 2
const mutation = graphql`
  mutation updateWCL2Mutation($id: coida_claims_wcl_2_pk_columns_input!, $_set: coida_claims_wcl_2_set_input!) {
    update_coida_claims_wcl_2_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityWCL2) => {
    const {
        id,
    } = attrs;

    const item = await findByIdWCL2(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).
    then(res => res && findByIdWCL2(res.id));
};
