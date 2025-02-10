/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import updateAudit from "./updateAudit";
import findByIdAudit from "./findByIdAudit";

// 2
const mutation = graphql`
  mutation insertAuditMutation($object: sheq_compliance_audits_insert_input!) {
    insert_sheq_compliance_audits_one(
      object: $object
    ) {
      id
      created_at
      
    }
  }
`;

// 3
export default async (input: EntityAudit) =>  {
  const {
    //0
    client_id,
    project_id,
    site_id,
    //1
    scope,
    date,
    type,
    //2
    representative_list,
    //3
    auditor_list,
    //4
    definition_list,//[{title, desc}]
    //5
    list
  } = input;

  // delete input.doc_num;
  // delete input.doc;
  // delete input.expiry;

  crudUtils.injectCreate(input);

  const res = await createMutationImpl({mutation, input});
  if(res) {
    // const id = convertIdToBigint(res.id);
    // const path = `contractors/questionnaire-templates/${id}`;
    // const name = `name-${Dates.formatTimestamp(new Date())}`;
    // const gcsUri = await workers.emit("files/upload", {
    //   file: doc,
    //   path,
    //   name,
    // });
    // console.log("gcsUri", gcsUri);
    //
    // const doc_version_list = {
    //   data: [{doc_num, doc: gcsUri, expiry}]
    // };
    // const updateAttrs = {doc_version_list};
    //
    // return updateAudit({id, ...updateAttrs});
   return findByIdAudit(res.id);
  }
};
