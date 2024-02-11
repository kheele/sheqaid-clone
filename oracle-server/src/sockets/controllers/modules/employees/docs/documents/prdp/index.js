const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

const {
	findByIdEmployeeDashboardStats,
	//
	findByIdCompanyDashboardStats,
	findByIdClientDashboardStats,
	findByIdProjectDashboardStats,
	findByIdSiteDashboardStats,
	findByIdContractorDashboardStats
} = require("../dashboardImpl");

const {
	findByIdCompanyHRDocumentsDateRangeDashboardStats,
	findByIdClientHRDocumentsDateRangeDashboardStats,
	findByIdProjectHRDocumentsDateRangeDashboardStats,
	findByIdSiteHRDocumentsDateRangeDashboardStats,
	findByIdContractorHRDocumentsDateRangeDashboardStats,
} = require("../dateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../../findByIdEmployeeDateRangeDashboardStatsImpl");

eventManager.on("employees/documents/prdp/findById", findByIdImpl);

eventManager.on("employees/documents/prdp/listByLogged", listImpl);

eventManager.on(`employees/documents/prdp/dashboard`, findByIdEmployeeDashboardStats({
	name: "PrDP",
	listName: "document_list",
	type: "PrDP"
}));

eventManager.on(`employees/documents/prdp/dashboard/date-range`, findByIdEmployeeDateRangeDashboardStats({
	name: "PrDP",
	listName: "document_list",
	type: "PrDP"
}));

[
	{org: "company", fn: findByIdCompanyDashboardStats},
	{org: "client", fn: findByIdClientDashboardStats},
	{org: "project", fn: findByIdProjectDashboardStats},
	{org: "site", fn: findByIdSiteDashboardStats},
	{org: "contractor", fn: findByIdContractorDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/documents/prdp/${org}/dashboard`, fn({
		name: "PrDP",
		type: "PrDP"
	}));
});

[
	{org: "company", fn: findByIdCompanyHRDocumentsDateRangeDashboardStats},
	{org: "client", fn: findByIdClientHRDocumentsDateRangeDashboardStats},
	{org: "project", fn: findByIdProjectHRDocumentsDateRangeDashboardStats},
	{org: "site", fn: findByIdSiteHRDocumentsDateRangeDashboardStats},
	{org: "contractor", fn: findByIdContractorHRDocumentsDateRangeDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/documents/prdp/${org}/dashboard/date-range`, fn({
		name: "PrDP",
		type: "PrDP"
	}));
});
