/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPPE} from "mutations/types.d.ts";
import findByIdPPE from "./findByIdPPE";

// 2
const mutation = graphql`
  mutation updatePPEMutation($id: ppe_types_pk_columns_input!, $_set: ppe_types_set_input!) {
    update_ppe_types_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityPPE) => {
  const {
    id,
    profile_pic,
  } = attrs;
  
  const has_doc = profile_pic && !profile_pic.dlUrls;
  if (has_doc) {
    try {
      const gcsUri = await workers.emit("files/upload", {
        file: profile_pic,
        path: `ppes/${id}`,
        name: "ppe-doc",
      });
      console.log("gcsUri", gcsUri);
      
      if (gcsUri) {
        attrs.profile_pic = gcsUri;
      }
    } catch (err) {
      console.log('updatePPE error', err)
    }
  }
  
  return updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  }).then(res => res && findByIdPPE(res.id));
};
