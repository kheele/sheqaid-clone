/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAsset} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";
import findByIdAsset from "./findByIdAsset";

// 2
const mutation = graphql`
  mutation insertAssetMutation($object: assets_insert_input!) {
    insert_assets_one(
      object: $object
    ) {
      id
#      created_at
      
    }
  }
`;

// 3
export default async (input: EntityAsset) =>  {
  const {
  //   //0
  //   client_id: client && client.id,
  //   project_id: project && project.id,
  //   site_id: site && site.id,
  //   //1 done
  //   asset_detail: {
  //   data: {
  //     owning_company,
  //       name,
  //       asset_type,
  //       desc,
  //       manufacturer,
  //       model,
  //       reg_num,
  //       serial_num,
  //       location,
  //       toolkit,
  //       condition,
  //       barcode,
  //       qr_code,
  //       notes,
  //   },
  // },
  // //2 done
  // photo_list: photo_list && {data: await Promise.all(photo_list.map(async ({path}) => ({doc: {path: await Utils.toDataURI(path)}})))},
  //   //3 done
  //   responsible_person_id: responsible_person && responsible_person.id,
  //   //4 done
  //   doc_list: {
  //   data: await Promise.all((doc_list || []).map(async ({expiry, doc, ...others}) => ({
  //     ...others,
  //     expiry: Dates.formatDateSQL(expiry),
  //     doc: doc ? {path: await Utils.toDataURI(doc.path)} : null,
  //   }))),
  // },
  // //5 done
  // purchase_info: (
  //   vendor || Dates.formatDateSQL(acquisition_date) || acquisition_value ||
  //   Dates.formatDateSQL(warranty_expiry) || reference_num || warranty_certificate
  // ) && {
  //   data: {
  //     vendor,
  //     acquisition_date: Dates.formatDateSQL(acquisition_date),
  //     acquisition_value,
  //     warranty_expiry: Dates.formatDateSQL(warranty_expiry),
  //     reference_num,
  //     warranty_certificate: warranty_certificate ? {path: await Utils.toDataURI(warranty_certificate.path)} : null,
  //   }
  // },
  //   //6 done
  //   depreciation: (depreciation_method ||
  //   asset_cost ||
  //   salvage_value ||
  //   depreciation_years ||
  //   depreciation_factor ||
  //   partial_year_depreciation
  // ) && {
  //   data: {
  //     depreciation_method,
  //     asset_cost,
  //     salvage_value,
  //     depreciation_years,
  //     depreciation_factor,
  //     partial_year_depreciation,
  //   }
  // },
  //   //7 done
  //   monitoring_plan_list: (
  //   (monitoring_plan_working_distance_or_time_list || []).isNotEmpty() ||
  //   (monitoring_plan_fuel_usage_list || []).isNotEmpty()
  // ) && {
  //   data: {
  //     fuel_usage_list: {
  //       data: (await Promise.all((monitoring_plan_fuel_usage_list || []).map(async (
  //         {
  //           refilled_fuel,
  //           current_hrs_or_km,
  //           working_hrs_or_km,
  //           date,
  //           receipt,
  //           cost,
  //         }
  //       ) => (
  //         {
  //           refilled_fuel,
  //           current_hrs_or_km,
  //           working_hrs_or_km,
  //           date: Dates.formatDateSQL(date),
  //           receipt: receipt ? {path: await Utils.toDataURI(receipt.path)} : null,
  //           cost,
  //         }
  //       )))).filter(v => !!v)
  //     },
  //     working_distance_or_time_list: {
  //       data: (monitoring_plan_working_distance_or_time_list || []).map((
  //         {
  //           working_hrs_or_km_opening,
  //           working_hrs_or_km_closing,
  //           working_hrs_or_km,
  //           date
  //         }
  //       ) => (
  //         {
  //           working_hrs_or_km_opening,
  //           working_hrs_or_km_closing,
  //           working_hrs_or_km,
  //           date: Dates.formatDateSQL(date),
  //         }
  //       )).filter(v => !!v)
  //     },
  //   },
  // },
  //   //8 done
  //   maintenance_plan_list: ((maintenance_plan_list || []).isNotEmpty() || next_service_hrs_or_km) && {
  //   data: [
  //     {
  //       plan_list: {
  //         data: (maintenance_plan_list || []).map((
  //           {
  //             reason_for_service,
  //             service,
  //             service_date,
  //             service_hrs_or_km,
  //             parts_used,
  //             cost_and_receipt
  //           }
  //         ) => ({
  //           reason_for_service,
  //           service,
  //           service_date: Dates.formatDateSQL(service_date),
  //           service_hrs_or_km,
  //           parts_used,
  //           cost_and_receipt,
  //         })),
  //       },
  //       next_service_hrs_or_km,
  //     }
  //   ].filter(v => !!v),
  // },
  //   //9 done
  //   calibration_record_list: ((calibration_record_list || []).isNotEmpty() || next_calibration_interval || Dates.formatDateSQL(next_calibration_date)) && {
  //   data: [
  //     {
  //       calibration_list: {
  //         data: (calibration_record_list || []).map((
  //           {
  //             calibrating_company,
  //             reference_standard,
  //             certificate_num,
  //             calibration_date
  //           }
  //         ) => ({
  //           calibrating_company,
  //           reference_standard,
  //           certificate_num,
  //           calibration_date: Dates.formatDateSQL(calibration_date),
  //         })),
  //       },
  //       next_calibration_interval,
  //       next_calibration_date: Dates.formatDateSQL(next_calibration_date),
  //     }
  //   ].filter(v => !!v),
  // }
  } = input;

  crudUtils.injectCreate(input);

  const res = await createMutationImpl({mutation, input});
  if(res) {
    return findByIdAsset(res.id);
  }
  return res;
};
