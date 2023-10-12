
//<editor-fold desc="asset_basic_details_monitoring_plan_fragment">
import {asset_basic_details_fragment} from "../../../ToolsTab/Query/Fragments";

export const asset_basic_details_monitoring_plan_fragment = `
    ${asset_basic_details_fragment}
    monitoring_plan_list{
        id
        fuel_usage_list{
	        refilled_fuel
					current_hrs_or_km
					working_hrs_or_km
					date
					receipt
					cost
        }
        working_distance_or_time_list{
	        working_hrs_or_km_opening
					working_hrs_or_km_closing
					working_hrs_or_km
					date
        }
    }
`;
//</editor-fold>
