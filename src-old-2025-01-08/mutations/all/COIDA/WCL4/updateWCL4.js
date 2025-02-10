/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityWCL4} from "mutations/types.d.ts";
import findByIdWCL4 from "./findByIdWCL4";

// 2
const mutation = graphql`
  mutation updateWCL4Mutation($id: coida_claims_wcl_4_pk_columns_input!, $_set: coida_claims_wcl_4_set_input!) {
    update_coida_claims_wcl_4_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityWCL4) => {
    const {
        id,
    } = attrs;

    const item = await findByIdWCL4(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).
    then(res => res && findByIdWCL4(res.id));
};
