(() => {
	class Controller extends AControllerAid {
		// <editor-fold defaultstate="collapsed" desc="constructor">
		constructor(events) {
			super(events, {
				singular: "Toolbox Talk Attendance Register",
				plural: "Toolbox Talk Attendance Registers"
			}, "plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/", "plugin_sheq_assist_05_Training_toolbox_talks_attendance_registers");
			
			const {addAction} = this;
			
			addAction("list/search_by_name", this.search_by_name.bind(this));
			addAction("list/filter", this.filter.bind(this));
			
			this.setQueryWhere(company_id => {
				return [['company_id', '==', company_id]];
			});
		}
		
		// </editor-fold>
		
		getDB() {
			return db;
		}
		
		// <editor-fold defaultstate="collapsed" desc="create">
		async create(evt, data) {
			return Events.whenLoggedIn(async loggedUser => {
				const {client, project, site, course_or_module, date, employee_list, attendance_register_list} = data;
				
				data.keywords = this.generateKeywords([course_or_module]);
				const item = await AControllerAid.prototype.create.call(this, evt, data);
				if (item) {
					const path = await this.export_excel(evt, item);
					return {path, item};
				}
				return item;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="update">
		async update(evt, id, updateAttrs) {
			return Events.whenLoggedIn(async loggedUser => {
				const {
					client,
					project,
					site,
					course_or_module,
					date,
					employee_list,
					attendance_register_list
				} = updateAttrs;
				
				if (course_or_module) {
					updateAttrs.keywords = this.generateKeywords([course_or_module]);
				}
				const updateItem = await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
				if (updateItem) {
					const item = {id, data: updateItem};
					const path = await this.export_excel(evt, item);
					return {path, item};
				}
				return updateItem;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="remove">
		async remove(evt, ids) {
			if (!isArray(ids)) {
				ids = [ids];
			}
			const res = await Promise.all(ids.map(async id => {
				return await AControllerAid.prototype.remove.call(this, evt, id);
			}));
			return res;
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="export_excel">
		async export_excel(evt, item) {
			return Events.whenLoggedIn(async loggedUser => {
				if (item) {
					let {
						id,
						data: {
							company, client: _client, project: _project, site: _site,
							subject, date,
							employee_list: list,
						}
					} = item;
					
					const rows = list.map((item, idx) => {
						let {
							id,
							signature,
							date,
							employee: {
								fname, lname, id_num, passport_num,
								client, project, site, phone, email,
								//
								job_position,
							}
						} = item;
						
						return {
							idx: idx + 1,
							
							project: project && project.name,
							site: site && site.name,
							
							job_position: job_position && job_position.name,
							// department: department && department.name,
							// supervisor: supervisor && supervisor.full_name,
							
							// id,
							fname,
							lname,
							// id_or_passport: id_num || passport_num,
							// dob: Dates.formatDate(dob),
							// sex,
							// phone,
							// email,
						};
					});
					
					const response = await fetch(
						`${self.locationRoot}/templates/xlsx/Template-ToolboxTalk-Attendance-Register.xlsx`.replace('//', '/')
					);
					
					const arrayBuffer = await response.arrayBuffer();
					const data = new Map();
					
					if (date) {
						data.set('date', Dates.formatDate(date));
					}
					
					_client = _client || company;
					
					data.set('company', _client ? _client.name || _client.data.name : "ANY");
					// data.set('project', _project ? _project.name || _project.data.name : "ANY");
					// data.set('site', _site ? _site.name || _site.data.name : "ANY");
					
					if (subject) {
						data.set('subject', subject.name);
					}
					
					data.set("rows", rows);
					return await Events.emit("excelTemplate", {arrayBuffer, data});
				}
				return item;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="search_by_name">
		async search_by_name(evt, course_or_module) {
			return await this.filter(evt, {course_or_module});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="list">
		async list(evt) {
			return Events.whenLoggedIn(async loggedUser => {
				let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {
				
				});
				
				this.sortBy(list);
				
				const {
					user,
					user: {data: {client: my_client, project: my_project, site: my_site}},
					company,
					client_id,
					project_id,
					site_id
				} = loggedUser;
//                console.log(this.tbl, 'list all', client_id, project_id, site_id, 'count', list.length)
				if (my_client) {
					list = list.filter(val => {
						const {client, client_id: _client_id} = val.data;
						if (!_client_id || client === "All" || !client)
							return true;
						return my_client.id === _client_id;
					});
				} else if (client_id) {
					list = list.filter(val => {
						const {client, client_id: _client_id} = val.data;
						if (!_client_id || client === "All" || !client)
							return true;
						return client_id === _client_id;
					});
				}

//                console.log(this.tbl, 'list filtered', list)
				return list;
			});
		}
		
		// </editor-fold>
		
		// <editor-fold defaultstate="collapsed" desc="filter">
		async filter(evt, search_val) {
			return Events.whenLoggedIn(async loggedUser => {
				const {course_or_module = ""} = search_val;
				const q = [
					{key: 'course_or_module', comp: 'LIKE', val: course_or_module}
				];
				return this.filter_impl(evt, q);
			});
		}
		
		// </editor-fold>
		
		sortBy(list) {
			list.sortBy("data.course_or_module");
		}
	}
	
	new Controller(events);
})();
