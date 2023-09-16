
(() => {
	class Controller extends AEmployeeDocsController {
		constructor(events) {
			super(
				events,
				{singular: "Employee Medical", plural: "Employees Medicals"},
				"plugin_sheq_assist/employees/medicals/"
			);

			this.collectionGroup = "medical_list";
		}

		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client, project, site,
			department, job_position, supervisor,
			list,
		}) {
			return AEmployeeDocsController.prototype.export_excel(
				evt,
				'Medicals',
				({
					 id,
					 data: {
						 date,
						 annexture_3,
						 restrictions,
					 },
				 }) => {

					return {
						date: Dates.formatDate(date),
						annexture_3,
						restrictions,
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
					{header: 'Expiry Date', key: 'Expiry Date', width: 20},
					{header: 'Annexture 3?', key: 'Annexture 3?', width: 25},
					{header: 'Restrictions', key: 'Restrictions', width: 25},
					{header: 'Document', key: 'Document', width: 35}
				];

				const {
					fname, lname,

					employee_medical_list, sub_collection_keys: {
						employee_medical_list: {latest, id: ids}
					}
				} = employee.data;

				let list = Object.keys(employee_medical_list).map(id => {
					return {id, expiry_date: employee_medical_list[id].expiry_date || null};
				});
				list.sortBy('expiry_date', 'desc');
				list = list.map(({id, expiry_date}) => {
					return {id, data: employee_medical_list[id]};
				});

				console.log(evt, list)

				const rows = list.map(({
					                       id, data: {
						created_at, annexture_3, restrictions, expiry_date, doc
					}
				                       }) => {
					console.log('test medicals export doc', doc)
					const res = {
						"Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
						"Annexture 3?": annexture_3 || "N/A",
						"Restrictions": restrictions || "N/A",
						"Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
					};
					return res;
				});

				const name = lname + "-" + fname;
				const folder = "Medical-Fitness";
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
})();//181