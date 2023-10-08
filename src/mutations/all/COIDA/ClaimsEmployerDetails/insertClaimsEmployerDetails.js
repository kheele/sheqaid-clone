/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityClaimsEmployerDetails} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import {Dates} from "../../../../utils/Dates";

// 2
const mutation = graphql`
  mutation insertClaimsEmployerDetailsMutation($object: coida_claims_employer_details_insert_input!) {
    insert_coida_claims_employer_details_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityClaimsEmployerDetails) => {
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
      product_id,
      name,
      common_names,
      chemical_name,
      empirical_formula,
      un_num,
      category,
      date_identified,
      application_or_use,
      manufacturer,
      manufacturer_addr,
      manufacturer_phone_num,
      manufacturer_email,
      manufacturer_fax,
      manufacturer_website,
      emergency_phone_nums,
//            emergency_phone, //replaced with emergency_phone_nums
      risk_level,//other added
      more_product_info,
      //2
      composition_or_information_on_ingredients,
      //3
      hazards_identification,
      //4
      first_aid_measures_and_precautions,
      //5
      firefighting_measures,
      //6
      accidental_release_measures,
      //7
      handling_and_storage_requirements,
      //8
      exposure_controls_or_personal_protection,
      //9
      physical_and_chemical_properties,
      //10
      stability_and_reactivity,
      //11
      toxicological_info,
      //12
      ecological_info,
      //13
      disposal_considerations,
      //14
      transport_info,
      //15
      regulatory_info,
      //16
      other_info,
      //17
      doc
  } = input;

  if(doc) {
    // delete input.doc;
  }

  crudUtils.injectCreate(input);

  return await createMutationImpl({mutation, input});
};
