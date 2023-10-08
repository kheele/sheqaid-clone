/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityClaimsProviderRequest} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertClaimsProviderRequestMutation($object: coida_claims_coid_provider_requests_insert_input!) {
        insert_coida_claims_coid_provider_requests_one(
            object: $object
        ) {
            id
            created_at
            status
            receipient_coid_provider{
                id
                name
            }
            user{
                id
            }
            company {
                id
                name
            }
            client {
                id
                name
            }
        }
    }
`;

// 3
export default async (input: EntityClaimsProviderRequest) => {
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
