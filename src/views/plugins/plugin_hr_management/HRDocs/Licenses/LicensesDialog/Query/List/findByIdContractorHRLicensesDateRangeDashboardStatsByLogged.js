import GQLClient from "graphql/GQLClient";
import {Dates} from "utils/Dates";
import findOneMutationImpl from "../../../../../../../../mutations/findOneMutationImpl";

export default async () => {
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

	const monStart = new Date().addMonths(-4);
	const monEnd = new Date().addMonths(12);

	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

	return await Promise.all(
		dates.map(async date => {
			const {start: dateStart, end: dateEnd} = date;

			const stats = await GQLClient
			.query({
				query: `
					query findByIdContractorHRLicensesDateRangeDashboardStatsQuery($dateStart: date, $dateEnd: date) {
            default_contractors(where: {id: {_eq: ${loggedContractor.id}}, ${whereOrg}}) {
                    id
                    #                   license_list
                    list_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gte: "${dateStart}", _lte: "${dateEnd}"}
                    }){
                        aggregate{
                            count
                        }
                    }
            }
          }
        `,
			}).then(res => res && res[0]);

			if (!stats) return {id: loggedContractor.id, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};

			const {id, data: {list_aggregate: {aggregate: {count}}}} = stats;
			return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count};
		})
	);
};