import {employee_personal_details_fragment} from "graphql/Fragments";

//<editor-fold desc="organogram_details_fragment">
export const organogram_details_fragment = `
    id
    created_at
    target
    type
    doc
    removed
    employee_list {
    	id
    	employee{
    		${employee_personal_details_fragment}
    	}
    	employee_reported_to{
    		${employee_personal_details_fragment}
    	}
    	team{
    		id
    		name
    		status
    		supervisor{
    			${employee_personal_details_fragment}
    		}
    		employee_list{
    			${employee_personal_details_fragment}
    		}
    	}
    	employee_list{
    		id
    		employee{
				${employee_personal_details_fragment}
			}
    	}
    }
`;
//</editor-fold>
