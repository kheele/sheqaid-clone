
(() => {
    class Controller extends AControllerAid {
        //title, sec1
        constructor(events) {
            super(events, {singular: "Safe Operating Procedure", plural: "Safe Operating Procedures"}, "plugin_sheq_assist/09_HIRA_And_Opportunities/sop/", "plugin_sheq_assist_09_HIRA_And_Opportunities_sop");

            this.filter = this.filter.bind(this);
            this.list_locations = this.list_locations.bind(this);
            
            const {addAction, filter, list_locations} = this;
            
            addAction("list/filter", filter);
            addAction("location/list", list_locations);
        }

        async create(evt, data) {
            return this.createAndUploadIfFile(evt, data, "photo");
        }

        async update(evt, id, updateAttrs) {
            return await this.updateAndUploadIfFile(evt, id, updateAttrs, "photo");
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
                                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                                company, client, project, site,
                                //1 done
                                category,
                                risk_level,
                                location,
                                prepared_by,
                                date_created,
                                date_revised,
                                doc,
                                risk_list,
                                close_down_list,
                                safety_pre_requesite_list,
                                custom_safety_pre_requesite_list,
                                procedure_list,
                                key_point_list,
                                operation_list,
                                other,
                            }
                        } = item;
                        
                        client = client || company;
                        
                        return {
                            idx: idx + 1,
                            
                            project: project && project.name,
                            site: site && site.name,
                            
                            category,
                            
                            risk_level,
                            
                            location,
                            
                            prepared_by_id: prepared_by && prepared_by.id,
                            
                            date_created: Dates.formatDateSQL(date_created),
                            
                            date_revised: Dates.formatDateSQL(date_revised),
                            
                            doc: doc && doc.dlUrls[0],
                            
                            risk_list,
                            
                            close_down_list,
                            
                            safety_pre_requesite_list,
                            
                            custom_safety_pre_requesite_list,
                            
                            procedure_list,
                            
                            key_point_list,
                            
                            operation_list,
                            
                            other,
                            
                            status,
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/hira and opportunities/Template-safe-operating-procedure.xlsx`.replace('//', '/')
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
