require('./categories');

const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {document_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const exportExcelImpl = require("../exportExcelImpl");
const {asset_export_details_fragment} = require("../assets/commons");

const args = {
	name: "Documents",
	tbl: "sheq_documents",
	details_fragment,
};

eventManager.on("documents/findById", findByIdImpl(args));

eventManager.on("documents/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {title: asc}",
	getVariablesAndQueryConfig,
}));

eventManager.on("documents/dashboard", findByIdDashboardImpl);

eventManager.on("documents/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Record-And-Document-Control",
	listImpl: listImpl({
		...args,
		details_fragment,
		order_by: "order_by: {title: asc}",
		getVariablesAndQueryConfig,
	}),
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
				company, client, project, site,
				//
				removed,
				//1
				responsible_department,
				responsible_person,
				expiry,
				internal_or_external,
				category,
				desc,
//            doc_num, doc_rev_num
				//2
				type,
				title,
				doc,
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			
			project: project && project.name,
			site: site && site.name,
			
			id,
			responsible_department: responsible_department && responsible_department.name,
			responsible_person: responsible_person && responsible_person.full_name,
			expiry: Dates.formatDateSQL(expiry),
			internal_or_external,
			category,
			desc,
			type,
			title,
			
			doc: doc && doc.dlUrls ? doc.dlUrls[0] : '',
			
			status: removed ? "Inactive" : "Active",
		};
	},
}));
