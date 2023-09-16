(() => {
	class Controller extends AEmployeeDocsController {
		//date, expiry_date, type, notes, employee, department
		constructor(events) {
			super(
				events,
				{singular: "Employee Warning", plural: "Employees Warnings"},
				"plugin_sheq_assist/employees/warnings/"
			);

			this.collectionGroup = "warning_list";
		}

		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client, project, site,
			department, job_position, supervisor,
			list,
		}) {
			return AEmployeeDocsController.prototype.export_excel(
				evt,
				'Warnings',
				({
					 id,
					 data, data: {
						 issued_by,
						 type,
						 details,
						 employee_comments,
						 notes,
						 witness_list,
						 date,
					 },
				 }) => {

					witness_list = (witness_list || []).map((
						{
							witness,
							witness_other,
						}
					) => witness ? witness.full_name : witness_other.full_name).join(', ');

					return {
						date: Dates.formatDate(date),
						issued_by: issued_by && issued_by.full_name,
						details,
						type,
						employee_comments,
						notes,
						witness_list,
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
					{header: 'Issued By', key: 'Issued By', width: 25},
					{header: 'Warning Type', key: 'Warning Type', width: 25},
					{header: 'Warning Date', key: 'Warning Date', width: 25},
					{header: 'Expiry Date', key: 'Expiry Date', width: 20},
					{header: 'Details Of Misconduct', key: 'Details Of Misconduct', width: 35},
					{header: "Employee's Comments", key: "Employee's Comments", width: 35},
					{header: 'Notes', key: 'Notes', width: 35},
					{header: 'Document', key: 'Document', width: 35}
				];

				const {
					fname, lname,
					employee_warning_list, sub_collection_keys: {
						employee_warning_list: {latest, id: ids}
					}
				} = employee.data;

				let list = Object.keys(employee_warning_list).map(id => {
					return {id, expiry_date: employee_warning_list[id].expiry_date || null};
				});
				list.sortBy('expiry_date', 'desc');
				list = list.map(({id, expiry_date}) => {
					return {id, data: employee_warning_list[id]};
				});

				console.log(evt, list)

				const rows = list.map(({
					                       id, data: {
						created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, doc
					}
				                       }) => {
					console.log('test wargings export doc', doc)
					const res = {
						"Issued By": issued_by ? (issued_by.lname + ' ' + issued_by.fname) : 'N/A',
						"Warning Type": type,
						"Warning Date": date ? new Date(date) : "N/A",
						"Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
						"Details Of Misconduct": details || "N/A",
						"Employee's Comments": employee_comments || "N/A",
						"Notes": notes || "N/A",
						"Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
					};
					return res;
				});

				const name = lname + "-" + fname;
				const folder = "Warnings";
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