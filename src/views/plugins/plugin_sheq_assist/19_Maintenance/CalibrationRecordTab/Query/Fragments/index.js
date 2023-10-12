import {asset_basic_details_fragment} from "../../../ToolsTab/Query/Fragments";

//<editor-fold desc="asset_details_fragment">
export const asset_details_calibration_record_fragment = `
    ${asset_basic_details_fragment}
    calibration_record_list{
        id
        next_calibration_interval
				next_calibration_date
        calibration_list{
          calibrating_company
					reference_standard
					certificate_num
					calibration_date
        }
    }
`;
//</editor-fold>
