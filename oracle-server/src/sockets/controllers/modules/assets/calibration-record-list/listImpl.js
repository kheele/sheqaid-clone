const {orgs_fragment, asset_basic_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="calibration_record_inc_fragment">
const calibration_record_inc_fragment = `
    id
    removed
    next_calibration_interval
    next_calibration_date
    asset{
        id
        ${orgs_fragment}
    }
`;
//</editor-fold>

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		view = 'Asset',
		mon, mon2, mon3,
		expiry_date = 'ALL',
		date_range,
		written_off = false,
		written_off: removed = false,
		//
		asset_id,
		responsible_person_list,
		//
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter, filterAsset} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		view,
		mon, mon2, mon3,
		expiry_date,
		date_range,
		//
		asset_id,
		responsible_person_list,
		//
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	
	if (view === 'Asset') {
		//<editor-fold desc="ByGroup">
		return listGraphQL({
			query: `
                query listAllByGroupAssetCalibrationRecordByLoggedQuery {
                  assets(
                    where: {
                      calibration_record_list_aggregate: {
                        count: {
                          predicate: {_gt: 0},
                          filter: {removed: {_eq: ${removed}}${filter}}
                        }
                      }, 
                      calibration_record_list: {removed: {_eq: ${removed}}${filter}}
                      ${filterAsset}
                    }
                    order_by: {asset_detail:{name: asc}},
                    offset: ${offset},
                    ${limit > 0 ? `,limit: ${limit}` : ''}
                  ) {
                    ${asset_basic_details_fragment}
                    calibration_record_list(where: {removed: {_eq: ${removed}}}, order_by: {next_calibration_date: desc_nulls_last}){
                      ${calibration_record_inc_fragment}
                    }
                    calibration_record_list_no_expiry_aggregate:calibration_record_list_aggregate(where: {
                      removed: {_eq: ${removed}}, next_calibration_date: {_is_null: true}
                    }){
                      aggregate{
                        count
                      }
                    }
                    calibration_record_list_expired_aggregate:calibration_record_list_aggregate(where: {
                      removed: {_eq: ${removed}}, next_calibration_date: {_lte: "now()"}
                    }){
                      aggregate{
                        count
                      }
                    }
                    calibration_record_list_mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                      removed: {_eq: ${removed}}, next_calibration_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                      aggregate{
                        count
                      }
                    }
                    calibration_record_list_2mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                      removed: {_eq: ${removed}}, next_calibration_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                      aggregate{
                        count
                      }
                    }
                    calibration_record_list_3mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                      removed: {_eq: ${removed}}, next_calibration_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                      aggregate{
                        count
                      }
                    }
                    calibration_record_list_4mon_expiry_aggregate:calibration_record_list_aggregate(where: {
                      removed: {_eq: ${removed}}, next_calibration_date: {_gt: "${mon3}"}
                    }){
                      aggregate{
                        count
                      }
                    }
                    ${orgs_fragment}
                  }
                }
            `,
		});
		//</editor-fold>
	} else {
		//<editor-fold desc="ByEach">
		return listGraphQL({
			query: `
                query listAllByEachAssetCalibrationRecordByLoggedQuery {
                  asset_calibration_record(
                    where: {
                      removed: {_eq: ${removed}},
                      ${filter},
                      ${filterAsset}
                    },
                    order_by: {next_calibration_date: asc},
                    offset: ${offset},
                    ${limit > 0 ? `,limit: ${limit}` : ''}
                  ) {
                    id
                    removed
                    next_calibration_interval
                    next_calibration_date
                    
                    asset{
                      ${asset_basic_details_fragment}
                      calibration_record_list(where: {removed: {_eq: ${removed}}}){
                        id
                        next_calibration_interval
                        next_calibration_date
                      }
                      ${orgs_fragment}
                    }
                  }
                }
            `,
		});
		//</editor-fold>
	}
}
//</editor-fold>
