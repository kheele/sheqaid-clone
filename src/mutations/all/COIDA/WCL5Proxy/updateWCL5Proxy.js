/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityWCL5Proxy} from "mutations/types.d.ts";
import findByIdWCL5Proxy from "./findByIdWCL5Proxy";

// 2
const mutation = graphql`
  mutation updateWCL5ProxyMutation($id: proxy_coida_claims__wcl_5_pk_columns_input!, $_set: proxy_coida_claims__wcl_5_set_input!) {
    update_proxy_coida_claims__wcl_5_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityWCL5Proxy) => {
    const {
        id,
    } = attrs;

    const item = await findByIdWCL5Proxy(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
