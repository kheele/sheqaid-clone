/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractorsQuestionnaireTemplate} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
  mutation insertContractorsQuestionnaireTemplateMutation($object: default_contractor_questionnaire_templates_insert_input!) {
    insert_default_contractor_questionnaire_templates_one(
      object: $object
    ) {
      id
      created_at
      name
      category
      desc
      doc_version_list{
        id
        type
        doc_num
        doc
        expiry
      }
      latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}){
        id
        type
        doc_num
        doc
        expiry
      }
      contractor_site{
        id
        name
      }
      contractor {
        id
        name
      }
    }
  }
`;

// 3
export default async (input: EntityContractorsQuestionnaireTemplate) =>  {
  const {
    name,
    category,
    desc,
    doc_num,//delete from property
    doc,//delete from property
    expiry,//delete from property
    client_id,
    project_id,
    site_list,
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
    // return updateContractorsQuestionnaireTemplate({id, ...updateAttrs});
  }
};
