
//<editor-fold desc="asset_basic_details_maintenance_plan_fragment">
import {asset_basic_details_fragment} from "../../../ToolsTab/Query/Fragments";

export const asset_basic_details_maintenance_plan_fragment = `
    ${asset_basic_details_fragment}
    maintenance_plan_list{
        id
        next_service_hrs_or_km
        plan_list{
          reason_for_service
          service
          service_hrs_or_km
					service_date
        }
    }
`;
//</editor-fold>
