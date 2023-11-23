const {
	orgs_id_fragment,
	employee_personal_details_fragment,
	personal_details_other_fragment,
	user_personal_details_fragment,
} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getALVVariablesAndQueryConfig">
exports.getALVVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		
		
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (client_id) {
		filter.push(`client_id: {_eq: ${client_id}}`);
	}
	if (project_id) {
		filter.push(`project_id: {_eq: ${project_id}}`);
	}
	if (site_id) {
		filter.push(`site_id: {_eq: ${site_id}}`);
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="getRLVVariablesAndQueryConfig">
exports.getRLVVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		
		
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (client_id) {
		filter.push(`client_id: {_eq: ${client_id}}`);
	}
	if (project_id) {
		filter.push(`project_id: {_eq: ${project_id}}`);
	}
	if (site_id) {
		filter.push(`site_id: {_eq: ${site_id}}`);
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="getNCOVariablesAndQueryConfig">
exports.getNCOVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		
		
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (client_id) {
		filter.push(`client_id: {_eq: ${client_id}}`);
	}
	if (project_id) {
		filter.push(`project_id: {_eq: ${project_id}}`);
	}
	if (site_id) {
		filter.push(`site_id: {_eq: ${site_id}}`);
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="personal_details_fragment">
const personal_details_fragment = `
  id
  
`;
//</editor-fold>

//<editor-fold desc="address_details_fragment">
const address_details_fragment = `
  id
  
`;
//</editor-fold>

//<editor-fold desc="vehicle_details_fragment">
const vehicle_details_fragment = `
  id
  
`;
//</editor-fold>

//<editor-fold desc="declaration_details_fragment">
const declaration_details_fragment = `
  id
  
`;
//</editor-fold>

//<editor-fold desc="alv_details_fragment">
exports.alv_details_fragment = `
  id
  
  #a
  particulars_of_owner_personal_details{
    ${personal_details_fragment}
  }
  particulars_of_owner_address{
    ${address_details_fragment}
  }
  #b
  organisation_proxy{
    ${personal_details_fragment}
  }
  #c
  organisation_representative{
    ${personal_details_fragment}
  }
  #d
  vehicle_identification{
    ${vehicle_details_fragment}
  }
  #e
  vehicle_declaration{
    ${declaration_details_fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="rlv_details_fragment">
exports.rlv_details_fragment = `
  id
  
  
  #a
  particulars_of_title_holder_personal_details{
    ${personal_details_fragment}
  }
  particulars_of_title_holder_address{
    ${address_details_fragment}
  }
  
  #b
  organisation_proxy{
    ${address_details_fragment}
  }
  
  #c
  organisation_representative{
    ${address_details_fragment}
  }
  organisation_representative_declaration{
    ${declaration_details_fragment}
  }
  buyer_executor{
    ${declaration_details_fragment}
  }
  
  
  
  
  particulars_of_owner_personal_details{
    ${personal_details_fragment}
  }
  particulars_of_owner_address{
    ${address_details_fragment}
  }
  #b
  organisation_proxy{
    ${personal_details_fragment}
  }
  #c
  organisation_representative{
    ${personal_details_fragment}
  }
  #d
  vehicle_identification{
    ${vehicle_details_fragment}
  }
  #e
  vehicle_declaration{
    ${declaration_details_fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="nco_details_fragment">
exports.nco_details_fragment = `
  id
  
  a_particulars_of_seller_or_owner_personal_details{
    ${personal_details_fragment}
  }
  a_executor_or_organisation_proxy_or_representative{
    ${personal_details_fragment}
  }
  a_executor_or_org_proxy_or_representative_declaration{
    ${declaration_details_fragment}
  }
  b_particulars_of_buyer_personal_details{
    ${personal_details_fragment}
  }
  b_particulars_of_buyer_address{
    ${address_details_fragment}
  }
  b_executor_or_organisation_proxy_or_representative{
    ${personal_details_fragment}
  }
  b_executor_or_org_proxy_or_representative_declaration{
    ${declaration_details_fragment}
  }
`;
//</editor-fold>
