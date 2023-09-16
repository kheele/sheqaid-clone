(() => {
	class Controller extends AEmployeeDocsController {
		constructor(events) {
			super(
				events,
				{singular: "Employee Work Permit", plural: "Employees Work Permits"},
				"plugin_sheq_assist/employees/workpermits/"
			);

			this.collectionGroup = "work_permit_list";
		}

		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client, project, site,
			department, job_position, supervisor,
			list,
		}) {
			return AEmployeeDocsController.prototype.export_excel(
				evt,
				'WorkPermits',
				({
					 id,
					 data: {
						 date,
						 notes,
					 },
				 }) => {
					return {
						date: Dates.formatDate(date),
						notes,
					};
				},
				{
					client, project, site,
					department, job_position, supervisor,
					list,
				},
			);
		}

		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
		async export_excel_by_employee(evt, employee) {
			return Events.whenLoggedIn(async loggedUser => {
				const cols = [
					{header: 'Date', key: 'Date', width: 20},
					{header: 'Expiry Date', key: 'Expiry Date', width: 20},
					{header: 'Notes', key: 'Notes', width: 35},
					{header: 'Document Attachment', key: 'Document Attachment', width: 45}
				];

				const {
					fname, lname,
					employee_work_permit_list, sub_collection_keys: {
						employee_work_permit_list: {latest, id: ids}
					}
				} = employee.data;

				let list = Object.keys(employee_work_permit_list).map(id => {
					return {id, expiry_date: employee_work_permit_list[id].expiry_date || null};
				});
				list.sortBy('expiry_date', 'desc');
				list = list.map(({id, expiry_date}) => {
					return {id, data: employee_work_permit_list[id]};
				});

				console.log(evt, list)

				const rows = list.map(({
					                       id, data: {
						created_at, date, expiry_date, notes, doc
					}
				                       }) => {
					const res = {
						"Date": Dates.formatDate(date) || "N/A",
						"Expiry Date": Dates.formatDate(expiry_date) || "N/A",
						"Notes": notes || "N/A",
						"Document Attachment": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
					};
					return res;
				});

				const name = lname + "-" + fname;
				const folder = "WorkPermits";
				return await this.export_excel_impl(
					loggedUser,
					"Employee-Docs/Employees-Active/" + folder.replace(" ", "-"),
					name.replaceAll(" ", "-"),
					name + "-" + folder,
					cols,
					rows);
			});
		}

		// </editor-fold>

	}

	new Controller(events);
})();