const {
	employee_personal_details_fragment,
	personal_details_other_fragment,
} = require("../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		representative_list,
		representative_id,
		auditor,
		type,
		scope,
		date_range,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if(representative_list) {
			filter.push(`representative_list: {employee_id:{_in: [${representative_list.map(v => v.id).join(', ')}]}}`);
		}
		if(representative_id) {
			filter.push(`representative_list: {employee_id:{_eq: ${representative_id}}}`);
		}
		if(auditor) {
			filter.push(`
				auditor_list:{
	        _or:{
	          employee:{
	            _or:{
	              fname: {_ilike: "%${auditor}%"},
	              lname: {_ilike: "%${auditor}%"}
	            }
	          },
	          other_person:{
	            _or:{
	              fname: {_ilike: "%${auditor}%"},
	              lname: {_ilike: "%${auditor}%"}
	            }
	          }
	        }
	      }
      `);
		}
		
		if(type) {
			filter.push(`type: {_ilike: "%${type}%"}`);
		}
		if(scope) {
			filter.push(`scope: {_ilike: "%${scope}%"}`);
		}
		
		if (date_range) {
			const {start, end} = date_range;
			if (start && end) {
				filter.push(`date: {_gte: "${start}", _lte: "${end}"}`);
			} else if (start) {
				filter.push(`date: {_gte: "${start}"}`);
			} else if (end) {
				filter.push(`date: {_lte: "${end}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="asset_basic_details_fragment">
const asset_basic_details_fragment = `
    id
    created_at
    status
    written_off
    profile_pic:photo_list(where: {removed: {_eq: false}, is_default: {_eq: true}}){
        id
        doc
        is_default
        removed
    }
    photo_list(where: {removed: {_eq: false}}){
        id
        doc
        is_default
        removed
    }
    responsible_person{
        id
        fname
        lname
        full_name
        email
        phone
        job_position{
            id
            name
        }
    }
    asset_detail{
    	id
        owning_company
        name
        asset_type
        desc
        manufacturer
        model
        reg_num
        serial_num
        location
        toolkit
        condition
        barcode
        qr_code
        notes
    }
`;
exports.asset_basic_details_fragment = asset_basic_details_fragment;
//</editor-fold>

//<editor-fold desc="asset_export_details_fragment">
exports.asset_export_details_fragment = `
    ${asset_basic_details_fragment}
    purchase_info{
        id
        created_at
        acquisition_date
        acquisition_value
        vendor
        warranty_expiry
        reference_num
        warranty_certificate
    }
    doc_list{
        id
        created_at
        doc
        expiry
        title
        desc
        type
    }
    depreciation{
        id
        depreciation_method
        asset_cost
        salvage_value
        depreciation_years
        depreciation_factor
        partial_year_depreciation
    }
    job_card_list{
        id
    }
    part_list{
        id
    }
    calibration_record_list{
        id
        next_calibration_interval
		next_calibration_date
        calibration_list{
          id
          calibrating_company
		  reference_standard
		  certificate_num
		  calibration_date
        }
    }
    maintenance_plan_list{
        id
        next_service_hrs_or_km
        plan_list{
        	id
          	reason_for_service
			service_date
			service_hrs_or_km
        }
    }
    monitoring_plan_list{
        id
        fuel_usage_list{
        	id
	        refilled_fuel
			current_hrs_or_km
			working_hrs_or_km
			date
			receipt
			cost
        }
        working_distance_or_time_list{
        	id
	        working_hrs_or_km_opening
			working_hrs_or_km_closing
			working_hrs_or_km
			date
        }
    }
`;
//</editor-fold>

//<editor-fold desc="asset_details_fragment">
exports.asset_details_fragment = `
  ${asset_basic_details_fragment}
    purchase_info{
        id
        created_at
        acquisition_date
        acquisition_value
        vendor
        warranty_expiry
        reference_num
        warranty_certificate
    }
    doc_list(where: {removed: {_eq: false}}){
        id
        created_at
        doc
        expiry
        title
        desc
        type
    }
    asset_children_list_aggregate{
      aggregate{
        count
      }
    }
    asset_parent_list_aggregate{
      aggregate{
        count
      }
    }
    #inspection_template_list: inspection_and_template_list(where: {is_template: {_eq: true}}){
      #\${/*inspection_fragment()*/}
    #}
    #inspection_list: inspection_and_template_list(where: {is_template: {_eq: false}}){
      #\${/*inspection_fragment()*/}
    #}
    #inspection_scheduled_list: inspection_and_template_list(where: {is_template: {_eq: false}, schedule_list: {completed: {_eq: false}}}){
      #\${/*inspection_fragment()*/}
    #}
    #inspection_history_list: inspection_and_template_list(where: {is_template: {_eq: false}, schedule_list: {completed: {_eq: true}}}){
      #\${/*inspection_fragment()*/}
    #}
    depreciation{
        id
        depreciation_method
        asset_cost
        salvage_value
        depreciation_years
        depreciation_factor
        partial_year_depreciation
    }
    job_card_list{
        id
    }
    part_list{
        id
    }
    calibration_record_list{
        id
        next_calibration_interval
		next_calibration_date
        calibration_list{
        	id
          	calibrating_company
			reference_standard
			certificate_num
			calibration_date
        }
    }
    maintenance_plan_list{
        id
        next_service_hrs_or_km
        plan_list{
        	id
          	reason_for_service
			service_date
			service_hrs_or_km
        }
    }
    monitoring_plan_list{
        id
        fuel_usage_list{
        	id
	        refilled_fuel
			current_hrs_or_km
			working_hrs_or_km
			date
			receipt
			cost
        }
        working_distance_or_time_list{
        	id
	        working_hrs_or_km_opening
			working_hrs_or_km_closing
			working_hrs_or_km
			date
        }
    }
  
  contractor_site{
    id
    name
  }
  contractor {
    id
    name
  }
`;
//</editor-fold>
