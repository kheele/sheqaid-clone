/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProxyEmployeeIncidentInvestigator} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyEmployeeIncidentInvestigatorMutation($id: proxy_incident__investigator_pk_columns_input!, $_set: proxy_incident__investigator_set_input!) {
    update_proxy_incident__investigator_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityProxyEmployeeIncidentInvestigator) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
