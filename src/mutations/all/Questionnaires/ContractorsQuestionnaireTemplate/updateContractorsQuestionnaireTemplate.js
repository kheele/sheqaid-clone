/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractorsQuestionnaireTemplate} from "mutations/types.d.ts";
import findByIdClient from "../../Client/findByIdClient";
import findByIdContractorsQuestionnaireTemplate from "./findByIdContractorsQuestionnaireTemplate";

// 2
const mutation = graphql`
  mutation updateContractorsQuestionnaireTemplateMutation($id: default_contractor_questionnaire_templates_pk_columns_input!, $_set: default_contractor_questionnaire_templates_set_input!) {
    update_default_contractor_questionnaire_templates_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityContractorsQuestionnaireTemplate) => {
    const {
        id,
        name,
        category,
        desc,
        doc_num,//delete from property
        doc,//delete from property
        expiry,//delete from property
        client_id,
        project_id,
        site_list,
    } = attrs;

    const item = await findByIdContractorsQuestionnaireTemplate(id);
    if(!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
