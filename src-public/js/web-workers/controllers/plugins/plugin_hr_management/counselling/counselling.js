(() => {
	class Controller extends AEmployeeDocsController {

		constructor(events) {
			super(
				events,
				{singular: "Employee Counseling", plural: "Employees Counselings"},
				"plugin_sheq_assist/employees/counselling/"
			);

			this.collectionGroup = "counselling_list";
		}

		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client, project, site,
			department, job_position, supervisor,
			list,
		}) {
			return AEmployeeDocsController.prototype.export_excel(
				evt,
				'Counsellings',
				({
					 id,
					 data: {
						 responsible_person,
						 //2
						 types,
						 reasons,
						 incident_desc,
						 corrective_actions,
						 counselling_hrs_to_complete,
						 witness_list,
					 },
				 }) => {

					return {
						responsible_person: responsible_person && responsible_person.full_name,
						types: types && types.join(', '),
						reasons: reasons && reasons.join(', '),
						incident_desc,
						corrective_actions,
						counselling_hrs_to_complete,
						witness_list: witness_list && witness_list.map(v => (v.witness || v.witness_other).full_name).join(', '),
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
					{header: 'Responsible Person', key: 'Responsible Person', width: 25},
					{header: 'Counselling Types', key: 'Counselling Types', width: 25},
					{header: 'Reasons For Counseling', key: 'Reasons For Counseling', width: 25},
					{header: 'Description Of Incident', key: 'Description Of Incident', width: 35},
					{header: "Corrective Actions", key: "Corrective Actions", width: 35},
					{header: "Counselling Hours To Complete", key: "Counselling Hours To Complete", width: 35},
					{header: 'Completion Date', key: 'Completion Date', width: 20},
					{header: 'Witness List', key: 'Witness List', width: 35},
					{header: 'Document', key: 'Document', width: 35}
				];

				const {
					fname, lname,
					employee_counselling_list, sub_collection_keys: {
						employee_counselling_list: {latest, id: ids}
					}
				} = employee.data;

				let list = Object.keys(employee_counselling_list).map(id => {
					return {id, expiry_date: employee_counselling_list[id].expiry_date || null};
				});
				list.sortBy('expiry_date', 'desc');
				list = list.map(({id, expiry_date}) => {
					return {id, data: employee_counselling_list[id]};
				});

				console.log(evt, list)

				const rows = list.map(({
					                       id,
					                       data: {
						                       created_at,
						                       //1
						                       employee,
						                       responsible_person,
						                       //2
						                       types,
						                       reasons,
						                       incident_desc,
						                       corrective_actions,
						                       counselling_hrs_to_complete,
						                       expiry_date,
						                       witness_list,
						                       //3
						                       doc
					                       }
				                       }) => {
					console.log('test leaves export doc', doc)

					const person_mapper = (v) => {
						if (!v)
							return 'N/A';
						const {id, lname, fname, data} = v;
						return (lname || data.lname) + ' ' + (fname || data.fname);
					};

					const res = {
						"Responsible Person": person_mapper(responsible_person),
						"Counselling Types": types ? types.map(v => v).join(', ') : 'N/A',
						"Reasons For Counseling": reasons ? reasons.map(v => v).join(', ') : 'N/A',
						"Description Of Incident": incident_desc || 'N/A',
						"Corrective Actions": corrective_actions || "N/A",
						"Counselling Hours To Complete": counselling_hrs_to_complete || "N/A",
						"Completion Date": expiry_date ? new Date(expiry_date) : "N/A",
						"Witness List": witness_list ? witness_list.map(person_mapper).join(', ') : "N/A",
						"Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
					};
					return res;
				});

				const name = lname + "-" + fname;
				const folder = "Counseling";
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