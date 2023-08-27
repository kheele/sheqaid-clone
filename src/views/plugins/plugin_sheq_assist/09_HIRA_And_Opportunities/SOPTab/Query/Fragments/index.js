import {employee_personal_details_fragment} from "graphql/Fragments";

//<editor-fold desc="hira_sop_details_fragment">
export const hira_sop_details_fragment = `
    id
    created_at
		date_created
		date_revised
		category
		location
		risk_level
		other
		doc
		close_down_list
		custom_safety_pre_requesite_list
		key_point_list
		operation_list
		procedure_list
		risk_list
		safety_pre_requesite_list
		prepared_by{
			${employee_personal_details_fragment}
		}
`;
//</editor-fold>
