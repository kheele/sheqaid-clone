(() => {
	class Controller extends AControllerAid {
		//date, type, auditor, company, representative, scope, definition_list, list
		constructor(events) {
			super(events, {
				singular: "Internal Audit",
				plural: "Internal Audits"
			}, "plugin_sheq_assist/21_Internal_Audit/audit/", "plugin_sheq_assist_21_Internal_Audit_audit");
		}
		
		// async list_elements(evt) {
		// 	return list_only_keys.call(this, evt, 'element');
		// }
		//
		// async list_sub_elements(evt) {
		// 	return list_only_keys.call(this, evt, 'sub_element');
		// }
		
		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, {
			client: _client, project: _project, site: _site,
			list,
		}) {
			return Events.whenLoggedIn(async loggedUser => {
				if (isArray(list)) {
					const rows = list.map((item, idx) => {
						let {
							id,
							data: {
								created_at, removed,
								company, client, project, site,
								
								scope,
								date,
								type,
								//2
								representative_list,
								//3
								auditor_list,
								//4
								definition_list,
								//5
								list,
							}
						} = item;
						
						client = client || company;
						
						return {
							idx: idx + 1,
							id,
							
							project: project && project.name,
							site: site && site.name,
							
							scope,
							type,
							date: Dates.formatDateSQL(date),
							representative_list: (representative_list || []).map((
								{
									employee,
									other_person
								}
							) => (employee || other_person).full_name).join(', '),
							auditor_list: (auditor_list || []).map((
								{
									employee,
									other_person
								}
							) => (employee || other_person).full_name).join(', '),
							definition_list: (definition_list || []).map(({title, desc}, n) => `${n+1}) ${title}: ${desc}`).join(', '),
							
							status: removed ? "Inactive" : "Active",
						};
					});
					
					const response = await fetch(
						`${self.locationRoot}/templates/xlsx/Audits/Audits.xlsx`.replace('//', '/')
					);
					const arrayBuffer = await response.arrayBuffer();
					const data = new Map();
					
					data.set('date', new Date().formatDate());
					
					data.set('company', _client ? _client.name || _client.data.name : "ANY");
					data.set('project', _project ? _project.name || _project.data.name : "ANY");
					data.set('site', _site ? _site.name || _site.data.name : "ANY");
					
					data.set("rows", rows);
					return await Events.emit("excelTemplate", {arrayBuffer, data});
					// return await this.export_excel_impl(loggedUser, "Training-Toolbox-Talks-Docs", "Attendance-Register", "Attendance-Register List", cols, rows);
				}
				return list;
			});
		}
		
		// </editor-fold>
	}
	
	new Controller(events);
})();
