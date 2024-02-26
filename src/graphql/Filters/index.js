export const orgsFilter = (orgs) => {
	const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
	const {selectedClient, selectedProject, selectedSite,} = storage.selected;
	const {selectedContractorClient, selectedContractorSite} = storage.selected;
	const {loggedContractor} = storage;
	const {hasProjects, isConsultant, isContractor} = storage.is;

	let {
		site_id,
		project_id,
		client_id,
		incContractors = false,
		excContractors = false,
		exact_orgs = false,
		exact_orgs_company = false,
		contractor_site_id_key = "site_id",
	} = orgs || {};

	const company_id = sess_company_id;
	client_id = client_id ? client_id : selectedClient && selectedClient.id;
	project_id = project_id ? project_id : selectedProject && selectedProject.id;
	site_id = site_id ? site_id : selectedSite && selectedSite.id;

	//<editor-fold desc="variables, filters">
	const filter = [];
	if (isContractor) {
		if (loggedContractor) {
			filter.push(`contractor_id: {_eq: ${loggedContractor.id}}`);
		}
		if (selectedContractorSite) {
			filter.push(`contractor_site_id: {_eq: ${selectedContractorSite.id}}`);
		} else if (selectedContractorClient) {
			filter.push(`contractor_site: {client_id: {_eq: ${selectedContractorClient.id}}}`);
		}
		return filter;
	} else {
		if (!excContractors && (loggedContractor || selectedContractorSite)) {
			if (loggedContractor) {
				filter.push(`contractor_id: {_eq: ${loggedContractor.id}}`);
			}
			if (selectedContractorSite) {
				filter.push(`contractor_site_id: {_eq: ${selectedContractorSite.id}}`);
			} else if (selectedContractorClient) {
				filter.push(`contractor_site: {client_id: {_eq: ${selectedContractorClient.id}}}`);
			}
			return filter;
		}
	}

	if (company_id) {
		filter.push(`company_id: {_eq: ${company_id}}`);
	}

	let qIncContractors;
	if (incContractors) {
		let q = '';
		if (client_id) {
			q = `, client_id: {_eq: ${client_id}}`;
		}
		qIncContractors = `{contractor: {company_id: {_eq: ${sess_company_id}}${q}}},`;
	}

	const site_id_fn = (site_id) => {
		if (site_id && !exact_orgs_company) {
			if (sess_my_site_id || exact_orgs) {
				return `, ${contractor_site_id_key}: {_eq: ${site_id}}`;
			} else {
				return `, _or: [
					{${contractor_site_id_key}: {_eq: ${site_id}}},
					{${contractor_site_id_key}: {_is_null: true}}
				]`;
			}
		}
		return ``;
	};
	const project_id_fn = (project_id, isConsultant) => {
		if (isConsultant) {
			if (project_id && !exact_orgs_company) {
				if (sess_my_project_id || exact_orgs) {
					return `, _or: [
					{
						project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				  }
				]`;
				} else {
					return `, _or: [
           {
            project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				   },
				   {project_id: {_is_null: true}}
        ]`;
				}
			}
			return ``;
		}

		if (sess_my_project_id || exact_orgs) {
			return `, {
						project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				}`;
		} else {
			return `, {
					_or: [
            {
              project_id: {_eq: ${project_id}} 
							${site_id_fn(site_id)}
				  	},
				  	{project_id: {_is_null: true}}
				  ]
        }`;
		}
	};

	if (isConsultant) {
		if (client_id) {
			if (sess_my_client_id || exact_orgs) {
				filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id, isConsultant)}
					}
				]`);
			} else {
				filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id, isConsultant)}
					}, 
					{client_id: {_is_null: true}}
				]`);
			}
		}
	} else {
		if (hasProjects) {
			if (project_id && !exact_orgs_company) {
				filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					${project_id_fn(project_id, isConsultant).replace(', _or', '_or')}
		    ]`);
			}
		} else if (qIncContractors) {
			filter.push(`_or: [
				${qIncContractors}
	    	]`);
		}
	}
	//</editor-fold>

	return filter;
};
