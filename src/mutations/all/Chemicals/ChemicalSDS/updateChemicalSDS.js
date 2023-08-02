/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityChemicalSDS} from "mutations/types.d.ts";
import findByIdChemicalSDS from "./findByIdChemicalSDS";

// 2
const mutation = graphql`
  mutation updateChemicalSDSMutation($id: sheq_chemical_sds_pk_columns_input!, $_set: sheq_chemical_sds_set_input!) {
    update_sheq_chemical_sds_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at

        product{
            id
            name
        }
        name
        common_names
        chemical_name
        empirical_formula
        un_num
        category
        date_identified
        application_or_use
        manufacturer
        manufacturer_addr
        manufacturer_phone_num
        manufacturer_email
        manufacturer_fax
        manufacturer_website
        emergency_phone_nums
        risk_level
        more_product_info

        composition_or_information_on_ingredients

        hazards_identification

        first_aid_measures_and_precautions

        firefighting_measures

        accidental_release_measures

        handling_and_storage_requirements

        exposure_controls_or_personal_protection

        physical_and_chemical_properties

        stability_and_reactivity

        toxicological_info

        ecological_info

        disposal_considerations

        transport_info

        regulatory_info

        other_info

        doc

        client {
            id
            name
        }
        project {
            id
            name
        }
        site {
            id
            name
        }
    }
  }
`;

// 3
export default async (attrs: EntityChemicalSDS) => {
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

    const item = await findByIdChemicalSDS(id);
    if (!item) return;

    const promises = [];

    if(sector_list) {
        delete attrs.sector_list;
        promises.push(Promise.all(sector_list.map(async (v, n) => {
            if(v.id) {
                return updateProxySectorChemicalSDS(v);
            } else {
                return insertProxySectorChemicalSDS({...v, course_id: id});
            }
        })));
    }
    if(job_position_list) {
        delete attrs.job_position_list;
        promises.push(Promise.all(job_position_list.map(async (v, n) => {
            if(v.id) {
                return updateProxyJobPositionChemicalSDS(v);
            } else {
                return insertProxyJobPositionChemicalSDS({...v, job_position_id: id});
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