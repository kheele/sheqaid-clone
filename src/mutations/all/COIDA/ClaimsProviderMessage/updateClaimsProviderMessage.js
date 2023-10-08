/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityClaimsProviderMessage} from "mutations/types.d.ts";
import findByIdClaimsProviderMessage from "./findByIdClaimsProviderMessage";

// 2
const mutation = graphql`
  mutation updateClaimsProviderMessageMutation($id: coida_claims_coid_provider_messages_pk_columns_input!, $_set: coida_claims_coid_provider_messages_set_input!) {
    update_coida_claims_coid_provider_messages_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityClaimsProviderMessage) => {
    const {
        id,
        name,
        frequency,
        sector_list,
        provider,
        job_position_list,
        unit_standard,
        unit_standard_desc,
        client_id, project_id, site_id,
    } = attrs;

    const item = await findByIdClaimsProviderMessage(id);
    if (!item) return;

    const promises = [];

    if(sector_list) {
        delete attrs.sector_list;
        promises.push(Promise.all(sector_list.map(async (v, n) => {
            if(v.id) {
                return updateProxySectorClaimsProviderMessage(v);
            } else {
                return insertProxySectorClaimsProviderMessage({...v, course_id: id});
            }
        })));
    }
    if(job_position_list) {
        delete attrs.job_position_list;
        promises.push(Promise.all(job_position_list.map(async (v, n) => {
            if(v.id) {
                return updateProxyJobPositionClaimsProviderMessage(v);
            } else {
                return insertProxyJobPositionClaimsProviderMessage({...v, job_position_id: id});
            }
        })));
    }

    await Promise.all(promises);

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
