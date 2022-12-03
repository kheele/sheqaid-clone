
(() => {
    class Controller extends AControllerAssist {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events, db) {
            super(events, db, {singular: "Hazchem Sheet", plural: "Hazchem Sheets"}, "plugin_sheq_assist/Hazardous_Chemical_Substances/hazchem-sheet/", "plugin_sheq_assist_Hazardous_Chemical_Substances_hazchem_sheets");

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
            addAction("physical-state/list", this.list_physical_states.bind(this));
            addAction("type/list", this.list_types.bind(this));

            addAction("select/filter", this.filter_select.bind(this));

            this.setQueryWhere(company_id => {
                const list = [['company_id', '==', company_id]];
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            if (data.msds) {
                const {name} = data.msds;
                data.keywords = this.generateKeywords([name]);
            } else {
                data.keywords = this.generateKeywords([""]);
            }
            const item = await this.createAndUploadIfManyFiles(
                    evt, data,
                    ["precaution_photo_concentrate_list", "precaution_photo_application_list"]
                    );
            return mapResults(item);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            if (updateAttrs.msds && updateAttrs.msds.name) {
                updateAttrs.keywords = this.generateKeywords([updateAttrs.msds.name]);
            }

            const updatedData = await this.updateAndUploadIfManyFiles(evt, id, updateAttrs, ["precaution_photo_concentrate_list", "precaution_photo_application_list"]);
            let updatedItem = {id, data: updatedData};
            updatedItem = await mapResults(updatedItem);

            return updatedItem.data;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {precaution_photo_concentrate_list, precaution_photo_application_list}}) => {
                if (precaution_photo_concentrate_list) {
                    await Promise.all(precaution_photo_concentrate_list.map(async v => await files.remove(v)));
                }
                if (precaution_photo_application_list) {
                    await Promise.all(precaution_photo_application_list.map(async v => await files.remove(v)));
            }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},

                    {header: 'Product Name', key: 'Product Name', width: 35},
                    {header: 'Physical State', key: 'Physical State', width: 25},
                    {header: 'Type', key: 'Type', width: 25},
                    {header: 'Risk Level', key: 'Risk Level', width: 25},

                    {header: 'Contact Name (Emergency)', key: 'Contact Name (Emergency)', width: 25},
                    {header: 'Contact No. (Emergency)', key: 'Contact No. (Emergency)', width: 25},
                    {header: 'Contact Name (Manufacturer)', key: 'Contact Name (Manufacturer)', width: 25},
                    {header: 'Contact No. (Manufacturer)', key: 'Contact No. (Manufacturer)', width: 25},

                    {header: 'Active Ingredients', key: 'Active Ingredients', width: 35},

                    {header: 'Physical Hazards (Hazard Identification)', key: 'Physical Hazards (Hazard Identification)', width: 35},
                    {header: 'Reproductive Hazards (Hazard Identification)', key: 'Reproductive Hazards (Hazard Identification)', width: 35},
                    {header: 'Biological Hazards (Hazard Identification)', key: 'Biological Hazards (Hazard Identification)', width: 35},

                    {header: 'Splashes in Eyes (First Aid Procedures)', key: 'Splashes in Eyes (First Aid Procedures)', width: 35},
                    {header: 'Contact with Skin (First Aid Procedures)', key: 'Contact with Skin (First Aid Procedures)', width: 35},
                    {header: 'Mouth Contact or Eaten (First Aid Procedures)', key: 'Mouth Contact or Eaten (First Aid Procedures)', width: 35},
                    {header: 'Fumes Breathed In (First Aid Procedures)', key: 'Fumes Breathed In (First Aid Procedures)', width: 35},

                    {header: 'Small Spills (<= 10 Litres) (Emergency Action For Spills)', key: 'Small Spills (<= 10 Litres) (Emergency Action For Spills)', width: 35},
                    {header: 'Large Spills (> 10 Litres) (Emergency Action For Spills)', key: 'Large Spills (> 10 Litres) (Emergency Action For Spills)', width: 35},

                    {header: 'Used Containers (Disposal)', key: 'Used Containers (Disposal)', width: 35},
                    {header: 'Unused Product (Disposal)', key: 'Unused Product (Disposal)', width: 35}
                ];

                console.log('print', list)

                const rows = list.map(({id, data: {
                client, project, site,
                        created_at,
                        msds, physical_state, type,
                        precaution_photo_concentrate_list, precaution_photo_application_list,
                        active_ingredient_list,
                        hazard_identification_physical_list, hazard_identification_reproductive_list, hazard_identification_biological_list,
                        first_aid_procedure_splashes_in_eyes_list, first_aid_procedure_contact_with_skin_list, first_aid_procedure_mouth_contact_or_eaten_list, first_aid_procedure_fumes_breathed_in_list,
                        emergency_action_for_spills_small_list, emergency_action_for_spills_large_list,
                        disposal_used_container_list, disposal_unused_product_list,
                        contacts_emergency_name, contacts_emergency_num, contacts_manufacturer_name, contacts_manufacturer_num
                }}) => {
                    const mapList = list => {
                        return list ? list.map(v => v.text).distinct().join(', ') : "N/A";
                    };

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),
                        'Product Name': msds.data.name,
                        'Physical State': physical_state || 'N/A',
                        'Type': type || 'N/A',
                        'Risk Level': msds.risk_level || 'N/A',

                        'Contact Name (Emergency)': contacts_emergency_name || 'N/A',
                        'Contact No. (Emergency)': contacts_emergency_num || 'N/A',
                        'Contact Name (Manufacturer)': contacts_manufacturer_name || 'N/A',
                        'Contact No. (Manufacturer)': contacts_manufacturer_num || 'N/A',

                        'Active Ingredients': mapList(active_ingredient_list),

                        'Physical Hazards (Hazard Identification)': mapList(hazard_identification_physical_list),
                        'Reproductive Hazards (Hazard Identification)': mapList(hazard_identification_reproductive_list),
                        'Biological Hazards (Hazard Identification)': mapList(hazard_identification_biological_list),

                        'Splashes in Eyes (First Aid Procedures)': mapList(first_aid_procedure_splashes_in_eyes_list),
                        'Contact with Skin (First Aid Procedures)': mapList(first_aid_procedure_contact_with_skin_list),
                        'Mouth Contact or Eaten (First Aid Procedures)': mapList(first_aid_procedure_mouth_contact_or_eaten_list),
                        'Fumes Breathed In (First Aid Procedures)': mapList(first_aid_procedure_fumes_breathed_in_list),

                        'Small Spills (<= 10 Litres) (Emergency Action For Spills)': mapList(emergency_action_for_spills_small_list),
                        'Large Spills (> 10 Litres) (Emergency Action For Spills)': mapList(emergency_action_for_spills_large_list),

                        'Used Containers (Disposal)': mapList(disposal_used_container_list),
                        'Unused Product (Disposal)': mapList(disposal_unused_product_list)
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Hazchem-Sheet-Docs", "Hazchem-Sheets-Active", "Hazchem Sheets Data", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });
                
                this.sortBy(list);
                
                list = await Promise.all(list.map(mapResults));

                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;

                if (my_client) {
                    list = list.filter(({data: {msds: val}}) => {
                        return my_client.id === getClientId(val);
                    });
                } else if (client_id) {
                    list = list.filter(({data: {msds: val}}) => {
                        return client_id === getClientId(val);
                    });
                }

                if (my_project) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {project}} = val;
                        return my_project.id === getProjectId(project, data);
                    });
                } else if (project_id) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {project}} = val;
                        return project_id === getProjectId(project, data);
                    });
                }

                if (my_site) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {site}} = val;
                        return my_site.id === getSiteId(site, data);
                    });
                } else if (site_id) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {site}} = val;
                        return site_id === getSiteId(site, data);
                    });
                }

                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", physical_state, type, risk_level, category, manufacturer} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'physical_state', comp: '=', val: physical_state},
                    {key: 'type', comp: '=', val: type},
                    {key: 'msds.data.risk_level', comp: '=', val: risk_level},
                    {key: 'category', comp: '=', val: category},
                    {key: 'manufacturer', comp: '=', val: manufacturer}
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });
                
                this.sortBy(list);
                
                list = await Promise.all(list.map(mapResults));

                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {client_id, project_id, site_id} = filterData;

                if (my_client) {
                    list = list.filter(({data: {msds: val}}) => {
                        return my_client.id === getClientId(val);
                    });
                } else if (client_id) {
                    list = list.filter(({data: {msds: val}}) => {
                        return client_id === getClientId(val);
                    });
                }

                if (my_project) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {project}} = val;
                        return my_project.id === getProjectId(project, data);
                    });
                } else if (project_id) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {project}} = val;
                        return project_id === getProjectId(project, data);
                    });
                }

                if (my_site) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {site}} = val;
                        return my_site.id === getSiteId(site, data);
                    });
                } else if (site_id) {
                    list = list.filter(({data: {msds: val}}) => {
                        const {data, data: {site}} = val;
                        return site_id === getSiteId(site, data);
                    });
                }

                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_physical_states">
        async list_physical_states(evt) {
            return list_distinct_keys.call(this, evt, 'physical_state');
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_types">
        async list_types(evt) {
            return list_distinct_keys.call(this, evt, 'type');
        }
        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.msds.name");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="list_distinct_keys">
    function list_distinct_keys(evt, key) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

            });
            return list.filter(({data}) => {
                return !!data[key];
            }).map(({data}) => {
                return data[key];
            }).distinct();
        });
    }
    // </editor-fold>

    async function mapResults(item) {
        let {data, data: {
                msds,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        const promise = [];

        promise.push(new Promise(async (resolve, reject) => {
            const msdss_tbl = await Events.get('plugin_sheq_assist/Hazardous_Chemical_Substances/msds/');
            data.msds = await msdss_tbl.find_by_id.call(msdss_tbl, null, msds.id);

            resolve();
        }));

        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        await Promise.all(promise);

        return item;
    }

    new Controller(events, db);
})();