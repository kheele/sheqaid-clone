/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityChemicalSDS} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdChemicalSDSQuery($id: bigint) {
    sheq_chemical_sds_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
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
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
