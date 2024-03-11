import React from 'react';
/* eslint-disable camelcase */

export default async (input) => {
	const {
		error,
		errorInfo,
	} = input;
	
	const data = {
		message: error.message || "",
		stack: error.stack || "",
		error_info: errorInfo && errorInfo.componentStack || "",
	};
	
	const {is: {isLoggedIn, isConsultant}} = storage;
	if (isLoggedIn) {
		const {loggedUser = {}, selected = {}, loggedContractor} = storage;
		const {access_type, company = {}, user = {}} = loggedUser;
		const {data: user_data = {}} = user;
		
		const {client, project, site, contractor} = user_data;
		
		const {selectedClient, selectedProject, selectedSite, selectedContractorSite} = selected;
		
		data.access_type = access_type;
		
		data.company_id = company.id;
		if (isConsultant) {
			data.client_id = client && client.id;
			data.project_id = project && project.id;
			data.site_id = site && site.id;
			
			data.selected_client_id = selectedClient && selectedClient.id;
			data.selected_project_id = selectedProject && selectedProject.id;
			data.selected_site_id = selectedSite && selectedSite.id;
		}
		data.contractor_id = contractor && contractor.id;
		data.logged_contractor_id = loggedContractor && loggedContractor.id;
		data.selected_contractor_site_id = selectedContractorSite && selectedContractorSite.id;
		
		data.user_id = user && user.id;
	}
	
	const onCreate = sockets.of('error-reporting').fn("onCreate");
	
	return onCreate(data).then(res => {
		infoDialog.open(<>
			<p>Problem successfully reported!</p>
			<p>We will fix it as soon as possible.</p>
		</>);
		infoDialog.close(5000);
	});
};
