/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityChemicalHazchemsheet} from "mutations/types.d.ts";
import findByIdChemicalHazchemsheet from "./findByIdChemicalHazchemsheet";

// 2
const mutation = graphql`
  mutation updateChemicalHazchemsheetMutation($id: sheq_chemical_hazchem_sheets_pk_columns_input!, $_set: sheq_chemical_hazchem_sheets_set_input!) {
    update_sheq_chemical_hazchem_sheets_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at

        name
        physical_state
        type
        product{
            id
        }
        sds{
            id
        }

        contacts_emergency_name
        contacts_emergency_num
        contacts_manufacturer_name
        contacts_manufacturer_num

        doc

        precaution_photo_concentrate_list:precaution_photo_list(where: {type: {_eq: "Concentrate"}}){
            id
            doc
            type
        }
        precaution_photo_application_list:precaution_photo_list(where: {type: {_eq: "Application"}}){
            id
            doc
            type
        }

        active_ingredient_list:list(where: {group: {_eq: "Active Ingredient"}}){
            value
            group
        }

        hazard_identification_physical_list:list(where: {group: {_eq: "Hazard Identification"}, type: {_eq: "Physical"}}){
            value
            group
            type
        }
        hazard_identification_reproductive_list:list(where: {group: {_eq: "Hazard Identification"}, type: {_eq: "Reproductive"}}){
            value
            group
            type
        }
        hazard_identification_biological_list:list(where: {group: {_eq: "Hazard Identification"}, type: {_eq: "Biological"}}){
            value
            group
            type
        }

        first_aid_procedure_splashes_in_eyes_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Splashes In Eyes"}}){
            value
            group
            type
        }
        first_aid_procedure_contact_with_skin_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Contact with Skin"}}){
            value
            group
            type
        }
        first_aid_procedure_mouth_contact_or_eaten_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Mouth Contact or Eaten"}}){
            value
            group
            type
        }
        first_aid_procedure_fumes_breathed_in_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Fumes Breathed In"}}){
            value
            group
            type
        }

        emergency_action_for_spills_small_list:list(where: {group: {_eq: "Emergency Action For Spills"}, type: {_eq: "Small Spills"}}){
            value
            group
            type
        }
        emergency_action_for_spills_large_list:list(where: {group: {_eq: "Emergency Action For Spills"}, type: {_eq: "Large Spills"}}){
            value
            group
            type
        }

        disposal_used_container_list:list(where: {group: {_eq: "Disposal"}, type: {_eq: "Used Containers"}}){
            value
            group
            type
        }
        disposal_unused_product_list:list(where: {group: {_eq: "Disposal"}, type: {_eq: "Unused Product"}}){
            value
            group
            type
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
export default async (attrs: EntityChemicalHazchemsheet) => {
    const {
        id,
        client_id, project_id, site_id,
    } = attrs;

    const item = await findByIdChemicalHazchemsheet(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
