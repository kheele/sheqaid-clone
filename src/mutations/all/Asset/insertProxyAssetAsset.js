/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAsset} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
  mutation insertProxyAssetAssetMutation($object: proxy_asset__asset_insert_input!) {
    insert_proxy_asset__asset_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityAsset) => {
    const {
        child_asset,
        parent_asset,
    } = input;

    child_asset && crudUtils.injectCreate(child_asset);
    parent_asset && crudUtils.injectCreate(parent_asset);

    if (child_asset) {
        input.child_asset = {data: child_asset};
    }

    if (parent_asset) {
        input.parent_asset = {data: parent_asset};
    }

    const res = await createMutationImpl({mutation, input});
    // if(res) {
    //   return findByIdAsset(res.id);
    // }
    return res;
};
