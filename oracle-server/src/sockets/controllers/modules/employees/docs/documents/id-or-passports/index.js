const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

const {
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
const {findByIdEmployeeDashboardStats} = require("../../../../findByIdEmployeeDashboardStatsImpl");
const {findByIdEmployeeDateRangeDashboardStats} = require("../../../../findByIdEmployeeDateRangeDashboardStatsImpl");

eventManager.on("employees/documents/id-or-passports/findById", findByIdImpl);

eventManager.on("employees/documents/id-or-passports/listByLogged", listImpl);

eventManager.on(`employees/documents/id-or-passports/dashboard`, findByIdEmployeeDashboardStats({
	name: "IDOrPassport",
	listName: "document_list",
	type: "ID/Passport"
}));

eventManager.on(`employees/documents/id-or-passports/dashboard/date-range`, findByIdEmployeeDateRangeDashboardStats({
	name: "IDOrPassport",
	listName: "document_list",
	type: "ID/Passport"
}));

[
	{org: "company", fn: findByIdCompanyDashboardStats},
	{org: "client", fn: findByIdClientDashboardStats},
	{org: "project", fn: findByIdProjectDashboardStats},
	{org: "site", fn: findByIdSiteDashboardStats},
	{org: "contractor", fn: findByIdContractorDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/documents/id-or-passports/${org}/dashboard`, fn({
		name: "IDOrPassport",
		type: "ID/Passport"
	}));
});

[
	{org: "company", fn: findByIdCompanyHRDocumentsDateRangeDashboardStats},
	{org: "client", fn: findByIdClientHRDocumentsDateRangeDashboardStats},
	{org: "project", fn: findByIdProjectHRDocumentsDateRangeDashboardStats},
	{org: "site", fn: findByIdSiteHRDocumentsDateRangeDashboardStats},
	{org: "contractor", fn: findByIdContractorHRDocumentsDateRangeDashboardStats},
].forEach(({org, fn}) => {
	eventManager.on(`employees/documents/id-or-passports/${org}/dashboard/date-range`, fn({
		name: "IDOrPassport",
		type: "ID/Passport"
	}));
});
