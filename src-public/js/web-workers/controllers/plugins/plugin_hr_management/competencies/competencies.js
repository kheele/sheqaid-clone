(() => {
	class Controller extends AEmployeeDocsController {
		constructor(events) {
			super(
				events,
				{singular: "Employee Competency", plural: "Employees Competencies"},
				"plugin_sheq_assist/employees/competencies/"
			);

			this.collectionGroup = "competency_list";
		}

		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client, project, site,
			department, job_position, supervisor,
			list,
		}) {
			return AEmployeeDocsController.prototype.export_excel(
				evt,
				'Competencies',
				({
					 id,
					 data: {
						 accreditation_num,
						 competency_type,
						 type,
						 issued_date,
						 training = {},
					 },
				 }) => {

					const {course} = training || {};

					return {
						issued_date: Dates.formatDate(issued_date),
						accreditation_num,
						competency_type,
						type,
						course: course && course.name,
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
					{header: 'Certificate Type', key: 'Certificate Type', width: 25},
					{header: 'Competency Type', key: 'Competency Type', width: 25},
					{header: 'Accreditation Number', key: 'Accreditation Number', width: 25},
					{header: 'Training Type', key: 'Training Type', width: 25},
					{header: 'Course / Module', key: 'Course / Module', width: 25},
					{header: 'Date Of Issue', key: 'Date Of Issue', width: 25},
					{header: 'Expiry Date', key: 'Expiry Date', width: 20},
					{header: 'Document', key: 'Document', width: 35}
				];

				const {
					fname, lname,
					employee_competency_list, sub_collection_keys: {
						employee_competency_list: {latest, id: ids}
					}
				} = employee.data;

				let list = Object.keys(employee_competency_list).map(id => {
					return {id, expiry_date: employee_competency_list[id].expiry_date || null};
				});
				list.sortBy('expiry_date', 'desc');
				list = list.map(({id, expiry_date}) => {
					return {id, data: employee_competency_list[id]};
				});

				console.log(evt, list)

				const rows = list.map(({
					                       id, data: {
						created_at, type, competency_type, accreditation_num, issued_date, expiry_date, training, doc
					}
				                       }) => {
					console.log('test competencies export doc', doc)
					const res = {
						"Certificate Type": type || "N/A",
						"Competency Type": competency_type || "N/A",
						"Accreditation Number": accreditation_num || "N/A",
						"Date Of Issue": Dates.formatDate(issued_date) || "N/A",
						"Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
						"Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
					};
					if (training) {
						const {type: training_type, course_or_module, job_title} = training;
						res["Training Type"] = training_type || "N/A";
						res["Course / Module"] = course_or_module ? (isString(course_or_module) ? course_or_module : (course_or_module.name || course_or_module.data.name)) : "N/A";
					}
					return res;
				});

				const name = lname + "-" + fname;
				const folder = "Competency-Certificates";
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