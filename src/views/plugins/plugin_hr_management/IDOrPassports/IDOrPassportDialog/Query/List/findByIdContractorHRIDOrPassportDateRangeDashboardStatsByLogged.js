import GQLClient from "graphql/GQLClient";
import {Dates} from "utils/Dates";
import findOneMutationImpl from "../../../../../../../mutations/findOneMutationImpl";

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
					query findByIdContractorHRIDOrPassportDateRangeDashboardStatsQuery($dateStart: date, $dateEnd: date) {
						list_aggregate:hr_employees_documents_aggregate(where: {
							employee: {contractor: {id: {_eq: ${loggedContractor.id}}, ${whereOrg}}},
							removed: {_eq: false}, expiry_date: {_gte: "${dateStart}", _lte: "${dateEnd}"}, type: {_eq: "ID/Passport"}
						}){
							aggregate{
								count
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