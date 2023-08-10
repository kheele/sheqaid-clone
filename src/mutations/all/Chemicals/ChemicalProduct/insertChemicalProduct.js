/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityChemicalProduct} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertChemicalProductMutation($object: sheq_chemical_products_insert_input!) {
        insert_sheq_chemical_products_one(
            object: $object
        ) {
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
            has_sds_view
            sds{
                id
            }
            sds_doc
            sds_date

            has_hazchem_sheet
            has_hazchem_sheet_view
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
export default async (input: EntityChemicalProduct) => {
    const {
        company_id,
        contractor_id,
        contractor_site_id,
        contractor_user_id,
        //0
        client_id,
        project_id,
        site_id,
        //1
        name,
        common_names,
        chemical_name,
        empirical_formula,
        un_num,
        cas_num,
        concentration,
        category,
        physical_state,
        type,
        application_or_use,
        manufacturer,
        manufacturer_addr,
        manufacturer_phone_num,
        manufacturer_email,
        manufacturer_fax,
        manufacturer_website,
        emergency_phone_nums,
        //2
        location_where_product_is_used,
        process_where_product_is_used,
        is_stable,
        is_cool_well_ventilated_area,
        heat_sparks_static_flames,
        spillage_control,
        other_special_info,
        //3
        compatible_with_list,
        incompatible_with_list,
        //4
        risk_level,
        //5
        is_combustible,
        is_flammable,
        flammability_combustibility_class,
        //6
        fire_fighting_foam,
        fire_fighting_dcp,
        fire_fighting_co2,
        fire_fighting_sand,
        fire_fighting_water,
        fire_fighting_other,
        //7
        is_hazardous,
        hazard_class_list,
        //8
        has_sds,
        sds_id,
        sds_doc,
        sds_date,
        //9
        has_hazchem_sheet,
        hazchem_sheet_id,
        hazchem_sheet_doc,
        hazchem_sheet_date,
        //10
        has_risk_assessment,
        risk_assessment_doc,
        risk_assessment_date,
        //11
        ppe_list,
        //12
        action_or_comments,
        //13
        chemical_stock_list
    } = input;

    crudUtils.injectCreate(input);

    return await createMutationImpl({mutation, input});
};
