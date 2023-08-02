export const getVariablesAndQueryConfig = (
	{
		client_name,
		site_name,
		name,
		username,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
	const {selectedClient, selectedProject, selectedSite,} = storage.selected;
	const {hasProjects, isConsultant,} = storage.is;

	const company_id = sess_company_id;
	client_id = selectedClient && selectedClient.id;
	project_id = selectedProject && selectedProject.id;
	site_id = selectedSite && selectedSite.id;

	let filter = [];
	let filterSite = [];

	if(company_id) {
		filterSite.push(`company_id: {_eq: ${company_id}}`);
	}

	const site_id_fn = (site_id) => {
		if (site_id) {
			if (sess_my_site_id || exact_orgs) {
				return `, site_id: {_eq: ${site_id}}`;
			} else {
				return `, _or: [
					{site_id: {_eq: ${site_id}}}, 
					{site_id: {_is_null: true}}
				]`;
			}
		}
		return ``;
	};
	const project_id_fn = (project_id) => {
		if (project_id) {
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
	};

	if (isConsultant) {
		if (client_id) {
			if (sess_my_client_id || exact_orgs) {
				filterSite.push(`_or: [
	        {
	          client_id: {_eq: ${client_id}},
	          ${project_id_fn(project_id)}
	        }
	      ]`);
			} else {
				filterSite.push(`_or: [
	        {
	          client_id: {_eq: ${client_id}},
	          ${project_id_fn(project_id)}
	        }, 
	        client_id: {_is_null: true}}
	      ]`);
			}
		}
	} else {
		if (hasProjects) {
			filterSite.push(`_or: [
				${project_id_fn(project_id).replace(', _or', '_or')}
	    ]`);
		}
	}

	if (client_name) {
		filterSite.push(`client: {name: {_ilike: "%${client_name}%"}}`);
	}
	if (site_name) {
		filterSite.push(`name: {_ilike: "%${site_name}%"}`);
	}

	if(filterSite.isNotEmpty()) {
		filter.push(`site_list: {site: {${filterSite.join(',')}}}`);
	}

	if (name) {
		filter.push(`name: {_ilike: "%${name}%"}`);
	}
	if (username) {
		filter.push(`username: {_ilike: "%${username}%"}`);
	}

	filter = filter.join(',');
	//</editor-fold>

	return {filter};
};