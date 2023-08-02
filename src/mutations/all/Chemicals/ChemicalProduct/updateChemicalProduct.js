/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityChemicalProduct} from "mutations/types.d.ts";
import findByIdChemicalProduct from "./findByIdChemicalProduct";

// 2
const mutation = graphql`
  mutation updateChemicalProductMutation($id: sheq_chemical_products_pk_columns_input!, $_set: sheq_chemical_products_set_input!) {
    update_sheq_chemical_products_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at

        name
        common_names
        chemical_name
        empirical_formula
        un_num
        cas_num
        concentration
        category
        physical_state
        type
        application_or_use
        manufacturer
        manufacturer_addr
        manufacturer_phone_num
        manufacturer_email
        manufacturer_fax
        manufacturer_website
        emergency_phone_nums

        location_where_product_is_used
        process_where_product_is_used
        is_stable
        is_cool_well_ventilated_area
        heat_sparks_static_flames
        spillage_control
        other_special_info

        compatible_with_list
        incompatible_with_list

        risk_level

        is_combustible
        is_flammable
        flammability_combustibility_class

        fire_fighting_foam
        fire_fighting_dcp
        fire_fighting_co2
        fire_fighting_sand
        fire_fighting_water
        fire_fighting_other

        is_hazardous
        hazard_class_list

        has_sds
        sds{
            id
        }
        sds_doc
        sds_date

        has_hazchem_sheet
        hazchem_sheet{
            id
        }
        hazchem_sheet_doc
        hazchem_sheet_date

        has_risk_assessment
        risk_assessment_doc
        risk_assessment_date

        ppe_list {
            ppe{
                id
                name
            }
        }

        action_or_comments

        chemical_stock_list {
            is_clearly_labeled
            storage_location
            unit
            qty
            date_received
            expiry_date
        }

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
export default async (attrs: EntityChemicalProduct) => {
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

    const item = await findByIdChemicalProduct(id);
    if (!item) return;

    const promises = [];

    if(sector_list) {
        delete attrs.sector_list;
        promises.push(Promise.all(sector_list.map(async (v, n) => {
            if(v.id) {
                return updateProxySectorChemicalProduct(v);
            } else {
                return insertProxySectorChemicalProduct({...v, course_id: id});
            }
        })));
    }
    if(job_position_list) {
        delete attrs.job_position_list;
        promises.push(Promise.all(job_position_list.map(async (v, n) => {
            if(v.id) {
                return updateProxyJobPositionChemicalProduct(v);
            } else {
                return insertProxyJobPositionChemicalProduct({...v, job_position_id: id});
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