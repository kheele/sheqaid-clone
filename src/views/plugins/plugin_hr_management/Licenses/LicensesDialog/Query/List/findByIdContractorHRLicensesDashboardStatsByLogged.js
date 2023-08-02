import GQLClient from "graphql/GQLClient";
import {Dates} from "utils/Dates";

export default () => {
	const {isConsultant, isNoProjects, isContractor, isContractorViewVisited} = storage.is;
	const {selectedContractorClient, selectedContractorSite} = storage.selected;

	let whereOrg = '';
	if (selectedContractorSite) {
		whereOrg = `site_list: {site_id: {_eq: ${selectedContractorSite.id}}}`;
	} else if (selectedContractorClient) {
		whereOrg = `site_list: {site: {client_id: {_eq: ${selectedContractorClient.id}}}}`;
	}

	if (isContractorViewVisited) {//To complete
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		if (selectedClient) {
			whereOrg = `site_list: {site: {client_id: {_eq: ${selectedClient.id}}}}`;
		}
	}

	const {loggedContractor} = storage;

	const mon = Dates.formatDateSQL(new Date().addMonths(1));
	const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
	const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

	return GQLClient
	.query({
		query: `
      query findByIdContractorHRLicensesDashboardStatsByLoggedQuery {
        default_contractors(where: {id: {_eq: ${loggedContractor.id}}, ${whereOrg}}) {
          id

              #                    license_list
              list_active_aggregate:license_list_aggregate(where: {removed: {_eq: false}}){
                  aggregate{
                      count
                  }
              }
              list_removed_aggregate:license_list_aggregate(where: {removed: {_eq: true}}){
                  aggregate{
                      count
                  }
              }
              list_no_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_is_null: true}
              }){
                  aggregate{
                      count
                  }
              }
              list_expired_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_lte: "now()"}
              }){
                  aggregate{
                      count
                  }
              }
              list_mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
              }){
                  aggregate{
                      count
                  }
              }
              list_2mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
              }){
                  aggregate{
                      count
                  }
              }
              list_3mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
              }){
                  aggregate{
                      count
                  }
              }
              list_4mon_expiry_aggregate:license_list_aggregate(where: {
                  removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
              }){
                  aggregate{
                      count
                  }
              }         
        }
      }
    `,
	}).then(res => res && res[0]);
};