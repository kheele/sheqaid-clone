(() => {
	class Controller extends AEmployeeDocsController {
		//date, expiry_date, type, notes, employee, department
		constructor(events) {
			super(
				events,
				{singular: "Employee Leave", plural: "Employees Leaves"},
				"plugin_sheq_assist/employees/leaves/"
			);

			this.collectionGroup = "leave_list";
		}

		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client, project, site,
			department, job_position, supervisor,
			list,
		}) {
			return AEmployeeDocsController.prototype.export_excel(
				evt,
				'Leaves',
				({
					 id,
					 data: {
						 date,
						 due_to,
						 days_booked,
						 reason,
						 employee_comments,
						 notes,
						 type,
					 },
				 }) => {

					return {
						date: Dates.formatDate(date),
						due_to,
						days_booked,
						reason,
						employee_comments,
						type,
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
					{header: 'Leave Due To', key: 'Leave Due To', width: 25},
					{header: 'Leave Type', key: 'Leave Type', width: 25},
					{header: 'Leave Start Date', key: 'Leave Start Date', width: 25},
					{header: 'Leave Expiry Date', key: 'Leave Expiry Date', width: 20},
					{header: 'No. Of Days Booked', key: 'No. Of Days Booked', width: 35},
					{header: "Reason Of Leave", key: "Reason Of Leave", width: 35},
					{header: "Employee's Comments", key: "Employee's Comments", width: 35},
					{header: 'Notes', key: 'Notes', width: 35},
					{header: 'Proof Of Sick Note', key: 'Proof Of Sick Note', width: 35}
				];

				const {
					fname, lname,
					employee_leave_list, sub_collection_keys: {
						employee_leave_list: {latest, id: ids}
					}
				} = employee.data;

				let list = Object.keys(employee_leave_list).map(id => {
					return {id, expiry_date: employee_leave_list[id].expiry_date || null};
				});
				list.sortBy('expiry_date', 'desc');
				list = list.map(({id, expiry_date}) => {
					return {id, data: employee_leave_list[id]};
				});

				console.log(evt, list)

				const rows = list.map(({
					                       id, data: {
						created_at, doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes
					}
				                       }) => {
					console.log('test leaves export doc', doc)
					const res = {
						"Leave Due To": due_to || 'N/A',
						"Leave Type": type,
						"Leave Start Date": date ? new Date(date) : "N/A",
						"Leave Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
						"No. Of Days Booked": days_booked || 0,
						"Reason Of Leave": reason || "N/A",
						"Employee's Comments": employee_comments || "N/A",
						"Notes": notes || "N/A",
						"Proof Of Sick Note": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
					};
					return res;
				});

				const name = lname + "-" + fname;
				const folder = "Leaves";
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