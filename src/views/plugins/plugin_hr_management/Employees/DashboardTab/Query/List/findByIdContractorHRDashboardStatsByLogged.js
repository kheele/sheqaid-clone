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
      query findByIdContractorHRDashboardStatsQuery {
        default_contractors(where: {id: {_eq: ${loggedContractor.id}}, ${whereOrg}}) {
                    id
                    employee_active_list_aggregate:employee_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    employee_removed_list_aggregate:employee_list_aggregate(where: {removed: {_eq: true}}){
                        aggregate{
                            count
                        }
                    }
                    supervisor_list_aggregate:employee_list_aggregate(where: {
                        removed: {_eq: false}, supervisor_employee_list_aggregate: {count: {filter: {removed: {_gt: false}}, predicate: {_gt: 0}}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    
#                    competency_list
                    competency_list_active_aggregate:competency_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    competency_list_no_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_expired_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_2mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_3mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_4mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    contract_list
                    contract_list_active_aggregate:contract_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    contract_list_no_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_is_null: true}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_expired_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_lte: "now()"}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: "now()", _lte: "${mon}"}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_2mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: "${mon}", _lte: "${mon2}"}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_3mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_4mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: "${mon3}"}}
                    }){
                        aggregate{
                            count
                        }
                    }

                    #job_appointment_list
                    job_appointment_list_active_aggregate:job_appointment_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_no_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_expired_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_2mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_3mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_4mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    counselling_list
                    counselling_list_active_aggregate:counselling_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_no_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_expired_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_2mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_3mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_4mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    leave_list
                    leave_list_active_aggregate:leave_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    leave_list_no_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_expired_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_2mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_3mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_4mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    license_list
                    license_list_active_aggregate:license_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    license_list_no_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_expired_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_2mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_3mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_4mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    medical_list
                    medical_list_active_aggregate:medical_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    medical_list_no_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_expired_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_2mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_3mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_4mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    warning_list
                    warning_list_active_aggregate:warning_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    warning_list_no_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_expired_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_2mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_3mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_4mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    work_permit_list
                    work_permit_list_active_aggregate:work_permit_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_no_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_expired_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_2mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_3mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_4mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "${mon3}"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    
                    team_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    department_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    job_category_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    job_position_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                }
            }
    `,
	}).then(res => res && res[0]);
};