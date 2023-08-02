/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityChemicalProduct} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdChemicalProductQuery($id: bigint) {
    sheq_chemical_products_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
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
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
