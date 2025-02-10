/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityWCL6} from "mutations/types.d.ts";
import findByIdWCL6 from "./findByIdWCL6";

// 2
const mutation = graphql`
  mutation updateWCL6Mutation($id: coida_claims_wcl_6_pk_columns_input!, $_set: coida_claims_wcl_6_set_input!) {
    update_coida_claims_wcl_6_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityWCL6) => {
    const {
        id,
    } = attrs;

    const item = await findByIdWCL6(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).
    then(res => res && findByIdWCL6(res.id));
};
