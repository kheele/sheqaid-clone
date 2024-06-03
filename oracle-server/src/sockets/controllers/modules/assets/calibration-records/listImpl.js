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
		return viewByAsset({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
	} else if(view === 'Upcoming Calibrations') {
		return viewUpcomingCalibrations({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
  } else if(view === 'Past Calibrations') {
		return viewPastCalibrations({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
  } else if(view === 'Calibration History') {
		return viewCalibrationHistory({removed, filter, filterAsset, offset, limit, mon, mon2, mon3});
  }
}
//</editor-fold>

function viewByAsset({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
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

          calibration_last_completed_date

          upcoming_calibration_list:calibration_record_list(
            where: {
              removed: {_eq: false}, 
              next_calibration_date: {_gt: "now()"}, 
              is_completed:{_eq: false}
            }, 
            order_by: {next_calibration_date: desc_nulls_last}
          ){
            ${calibration_record_inc_fragment}
          }
          last_calibration_list:calibration_record_list(
            where: {removed: {_eq: false}, next_calibration_date: {_lte: "now()"}},
            order_by: {next_calibration_date: desc_nulls_last},
            limit: 1
          ){
            ${calibration_record_inc_fragment}
          }

          past_calibration_list_aggregate:calibration_record_list_aggregate(
            where: {removed: {_eq: false}, next_calibration_date: {_lte: "now()"}}
          ){
            aggregate{
              count
            }
          }
          past_completed_before_calibration_list_aggregate:calibration_record_list_aggregate(
            where: {
              removed: {_eq: false}, 
              next_calibration_date: {_lte: "now()"},
              is_completed_before: {_eq: true}
            }
          ){
            aggregate{
              count
            }
          }
          past_completed_after_calibration_list_aggregate:calibration_record_list_aggregate(
            where: {
              removed: {_eq: false}, 
              next_calibration_date: {_lte: "now()"},
              is_completed_after: {_eq: true}
            }
          ){
            aggregate{
              count
            }
          }

          ${orgs_fragment}
        }
      }
    `,
  });
}

function viewUpcomingCalibrations({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
  return listGraphQL({
    query: `
      query listAllUpcomingCalibrationsByLoggedQuery {
        asset_calibration_record(
          where: {
            removed: {_eq: ${removed}},
            next_calibration_date: {_gt: "now()"},
            is_completed:{_eq: false},
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
            calibration_record_list(where: {removed: {_eq: false}}){
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
}

function viewPastCalibrations({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
  return listGraphQL({
    query: `
      query listAllPastCalibrationsByLoggedQuery {
        asset_calibration_record(
          where: {
            removed: {_eq: ${removed}},
            next_calibration_date: {_lte: "now()"},
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

          is_completed
          is_completed_before
          is_completed_after
          completed_date
          completed_day_count

          calibration_list(where: {removed: {_eq: false}}, order_by: {calibration_date: desc}){
            id
            removed
            calibrating_company
            reference_standard
            certificate_num
            calibration_date
          }
          
          asset{
            ${asset_basic_details_fragment}
            calibration_record_list(where: {removed: {_eq: false}}){
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
}

function viewCalibrationHistory({removed, filter, filterAsset, offset, limit, mon, mon2, mon3}) {
  return listGraphQL({
    query: `
      query listAllCalibrationHistoryByLoggedQuery {
        asset_calibration_record_list(
          where: {
            removed: {_eq: ${removed}},
            ${filter},
            ${filterAsset}
          },
          order_by: {calibration_date: desc},
          offset: ${offset},
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          id
          removed
          calibrating_company
          reference_standard
          certificate_num
          calibration_date

          scheduled_date
          is_completed_after
          is_completed_before
          completed_day_count

          calibration_record_id
          calibration_record{
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
      }
    `,
  });
}