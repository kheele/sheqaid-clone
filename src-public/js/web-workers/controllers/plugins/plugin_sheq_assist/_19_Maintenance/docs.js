(() => {
	class Controller extends AControllerAid {
		
		// <editor-fold defaultstate="collapsed" desc="constructor">
		constructor(events) {
			super(events, {
				singular: "Asset Document",
				plural: "Assets Documents"
			}, "plugin_sheq_assist/19_Maintenance/tools/docs/");
		}
		
		// </editor-fold>

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
								created_at,
								date,
								expiry,
								title,
								type,
								doc,
								asset: {
									company, client, project, site,
									status,
									written_off,
									profile_pic: profile_pic_list,
									photo_list,
									responsible_person,
									asset_detail: {
										owning_company,
										name,
										asset_type,
										desc,
										manufacturer,
										model,
										reg_num,
										serial_num,
										location,
										toolkit,
										condition,
										barcode,
										qr_code,
										notes,
									},
								},
							}
						} = item;
						
						client = client || company;

						return {
							idx: idx + 1,
							
							project: project && project.name,
							site: site && site.name,
							
							id,
							asset_type,
							name,
							manufacturer,
							responsible_person: responsible_person && responsible_person.full_name,
							reg_num,
							serial_num,
							date: Dates.formatDateSQL(date),
							expiry_date: Dates.formatDateSQL(expiry),
							// doc: doc && doc.dlUrls ? doc.dlUrls[0] : '',
							//
							title,
							type,
						};
					});
					
					const response = await fetch(
						`${self.locationRoot}/templates/xlsx/assets/Template-List-Asset-Documents.xlsx`.replace('//', '/')
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
