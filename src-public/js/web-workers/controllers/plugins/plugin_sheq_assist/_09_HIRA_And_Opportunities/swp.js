(() => {
	class Controller extends AControllerAid {
		//title, sec1
		constructor(events) {
			super(events, {
				singular: "Written Safe Work Procedure",
				plural: "Written Safe Work Procedures"
			}, "plugin_sheq_assist/09_HIRA_And_Opportunities/swp/", "plugin_sheq_assist_09_HIRA_And_Opportunities_swp");
			
			this.filter = this.filter.bind(this);
			this.list_categories = this.list_categories.bind(this);
			this.list_locations = this.list_locations.bind(this);
			const {addAction, filter, list_categories, list_locations} = this;
			
			addAction("list/filter", filter);
			addAction("category/list", list_categories);
			addAction("location/list", list_locations);
		}
		
		async create(evt, data) {
			return Events.whenLoggedIn(async loggedUser => {
				this.injectSavable(evt, loggedUser, data);
				const {user_id, company_id, created_at} = data;
				
				const {department} = data;
				if (department && typeof department === 'string') {
					const _data = {name: department, user_id, company_id, created_at};
					const department_doc_ref = await this.getDB().collection('plugin_sheq_assist_departments').add(_data);//Promise < DocumentReference < T > >
					const department_doc_snapshot = await department_doc_ref.get();//Promise < DocumentSnapshot < T > >
					data.department = {id: department_doc_snapshot.id, name: department_doc_snapshot.data().name};
				}
				return this.createAndUploadIfFile(evt, data, "photo");
			});
		}
		
		async remove(evt, id) {
			return this.removeWithFile(evt, id, async ({data: {photo}}) => {
				photo && await files.remove(photo);
			});
		}
		
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
								removed,
								company, client, project, site,
								//1 done
								category,
								work_task,
								date_created,
								location,
								department,
								person_approving_procedure,
								expiry,
								sign_sheet_notes,
								//2
								doc,
								//3
								potential_hazard_and_possible_cause_list,
								//4
								ppe_required_list,
								//5
								steps_to_perform_task_list,
								//6
								notes,
								//7
								training_requirement_list,
								//8
								sign_sheet_employee_list,
							}
						} = item;
						
						client = client || company;
						
						return {
							idx: idx + 1,
							
							project: project && project.name,
							site: site && site.name,
							
							category,
							work_task,
							date_created: Dates.formatDateSQL(date_created),
							location,
							department: department && department.name,
							person_approving_procedure: person_approving_procedure && person_approving_procedure.full_name,
							expiry: Dates.formatDateSQL(expiry),
							sign_sheet_notes,
							doc: doc && doc.dlUrls[0],
							potential_hazard_and_possible_cause_list: (potential_hazard_and_possible_cause_list || []).map(({cause, hazard, rating}) => `(${cause}: ${hazard})`).join(', '),
							ppe_required_list: (ppe_required_list || []).map(({ppe}) => ppe.name).join(', '),
							steps_to_perform_task_list: (steps_to_perform_task_list || []).map(({text}) => text).join(', '),
							notes,
							training_requirement_list: (training_requirement_list || []).map(({text}) => text).join(', '),
							sign_sheet_employee_list: (sign_sheet_employee_list || []).map(({employee}) => employee.full_name).join(', '),
							status: removed ? "Inactive" : "Active",
						};
					});
					
					const response = await fetch(
						`${self.locationRoot}/templates/xlsx/assets/Template-List-WSWP.xlsx`.replace('//', '/')
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
		
		async filter(evt, search_val) {
			return Events.whenLoggedIn(async loggedUser => {
				const {created_at, title} = search_val;
				const q = [
					{key: 'title', comp: 'LIKE', val: title},
					{key: 'created_at', comp: '=', val: created_at}
				];
				return this.filter_impl(evt, q);
			});
		}
		
		async list_categories(evt) {
			return Events.whenLoggedIn(async loggedUser => {
				let list = await this.list(evt);
				list = list.filter(({data: {category}}) => !!category).map(({data: {category}}) => category).distinct();
				return list;
			});
		}
		
		async list_locations(evt) {
			return Events.whenLoggedIn(async loggedUser => {
				let list = await this.list(evt);
				list = list.filter(({data: {location}}) => !!location).map(({data: {location}}) => location).distinct();
				return list;
			});
		}
	}
	
	new Controller(events);
})();
