/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAnnexture1} from "mutations/types.d.ts";
import findByIdAnnexture1 from "./findByIdAnnexture1";

// 2
const mutation = graphql`
  mutation updateAnnexture1Mutation($id: coida_claims_annexture_1_pk_columns_input!, $_set: coida_claims_annexture_1_set_input!) {
    update_coida_claims_annexture_1_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityAnnexture1) => {
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

    const item = await findByIdAnnexture1(id);
    if (!item) return;

    const promises = [];

    if(sector_list) {
        delete attrs.sector_list;
        promises.push(Promise.all(sector_list.map(async (v, n) => {
            if(v.id) {
                return updateProxySectorAnnexture1(v);
            } else {
                return insertProxySectorAnnexture1({...v, course_id: id});
            }
        })));
    }
    if(job_position_list) {
        delete attrs.job_position_list;
        promises.push(Promise.all(job_position_list.map(async (v, n) => {
            if(v.id) {
                return updateProxyJobPositionAnnexture1(v);
            } else {
                return insertProxyJobPositionAnnexture1({...v, job_position_id: id});
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
