// <editor-fold defaultstate="collapsed" desc="uploadDocsUpdate">
exports.uploadDocsUpdate = async (req, body) => {
	// await authorize();

	const data = getTriggeredEventsData(body, [
		"hr_employees_docs_competencies",
		"hr_employees_docs_contracts",
		"hr_employees_docs_counsellings",
		"hr_employees_docs_leaves",
		"hr_employees_docs_licenses",
		"hr_employees_docs_medicals",
		"hr_employees_docs_warnings",
		"hr_employees_docs_work_permits",
		"hr_employees_docs_job_appointments",
	]);

	if (!data) {
		return;
	}

	const {table_name, new_item} = data;

	let {id, employee_id, doc, job_profile_doc} = new_item;

	console.log('uploadDocsUpdate', new_item)

	const {
		[table_name]: {
			plural, name, operationName,
		}
	} = {
		'hr_employees_docs_competencies': {
			plural: 'competencies',
			name: 'Competency-Certificate',
			operationName: 'updateEmployeeCompetencyMutation',
		},
		'hr_employees_docs_contracts': {
			plural: 'contracts',
			name: 'Contract',
			operationName: 'updateEmployeeContractMutation',
		},
		'hr_employees_docs_counsellings': {
			plural: 'counsellings',
			name: 'Counselling',
			operationName: 'updateEmployeeCounsellingMutation',
		},
		'hr_employees_docs_leaves': {
			plural: 'leaves',
			name: 'Leave',
			operationName: 'updateEmployeeLeaveMutation',
		},
		'hr_employees_docs_licenses': {
			plural: 'licenses',
			name: 'License',
			operationName: 'updateEmployeeLicenseMutation',
		},
		'hr_employees_docs_medicals': {
			plural: 'medicals',
			name: 'Medical',
			operationName: 'updateEmployeeMedicalMutation',
		},
		'hr_employees_docs_warnings': {
			plural: 'warnings',
			name: 'Warning',
			operationName: 'updateEmployeeWarningMutation',
		},
		'hr_employees_docs_work_permits': {
			plural: 'work-permits',
			name: 'Work-Permit',
			operationName: 'updateEmployeeWorkPermitMutation',
		},
		'hr_employees_docs_job_appointments': {
			plural: 'job_appointments',
			name: 'Job-Appointment',
			operationName: 'updateEmployeeJobAppointmentMutation',
		},
	}[table_name];

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadDocsUpdate doc', table_name, path)

		const new_name = `employees/${employee_id}/docs/${plural}/${id}/${name}-doc-${Dates.formatTimestamp(new Date())}`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (job_profile_doc && job_profile_doc.path) {
		const {path} = job_profile_doc;
		console.log('uploadDocsUpdate job_profile_doc', table_name, path)

		const new_name = `employees/${employee_id}/docs/${plural}/${id}/${name}-job-profile-${Dates.formatTimestamp(new Date())}`;
		attrs.job_profile_doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateRelay({
			mutation: `
		    mutation ${operationName}($id: ${table_name}_pk_columns_input!, $_set: ${table_name}_set_input!) {
		      update_${table_name}_by_pk(pk_columns: $id, _set: $_set) {
		        id
		      }
		    }
		  `,
			operationName,
			id,
			attrs,
		});

		// const socket = SocketManager.findByIp(req.ip_address);
	}
};
// </editor-fold>
