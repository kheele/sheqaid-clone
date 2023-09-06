
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events) {
            super(events, {singular: "Container Inventory", plural: "Container Inventory"}, "plugin_sheq_assist/Hazardous_Chemical_Substances/container-inventory/", "plugin_sheq_assist_Hazardous_Chemical_Substances_container_inventory");

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
            addAction("physical-state/list", this.list_physical_states.bind(this));
            addAction("type/list", this.list_types.bind(this));

            addAction("select/filter", this.filter_select.bind(this));

//            this.setQueryWhere(company_id => {
//                return [['company_id', '==', company_id]];
//            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
//        async create(evt, data) {
//            if (data.msds) {
//                const {name} = data.msds;
//                data.keywords = this.generateKeywords([name]);
//            } else {
//                data.keywords = this.generateKeywords([""]);
//            }
//            const item = await this.createAndUploadIfManyFiles(
//                    evt, data,
//                    ["precaution_photo_concentrate_list", "precaution_photo_application_list"]
//                    );
//            return ContainerFuns.mapResults(item);
//        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
//        async update(evt, id, updateAttrs) {
//            if (updateAttrs.msds && updateAttrs.msds.name) {
//                updateAttrs.keywords = this.generateKeywords([updateAttrs.msds.name]);
//            }
//
//            const updatedData = await this.updateAndUploadIfManyFiles(evt, id, updateAttrs, ["precaution_photo_concentrate_list", "precaution_photo_application_list"]);
//            let updatedItem = {id, data: updatedData};
//            updatedItem = await ContainerFuns.mapResults(updatedItem);
//
//            return updatedItem.data;
//        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
//        async remove(evt, id) {
//            return this.removeWithFile(evt, id, async ({data: {precaution_photo_concentrate_list, precaution_photo_application_list}}) => {
//                if (precaution_photo_concentrate_list) {
//                    await Promise.all(precaution_photo_concentrate_list.map(async v => await v && files.remove(v)));
//                }
//                if (precaution_photo_application_list) {
//                    await Promise.all(precaution_photo_application_list.map(async v => await v && files.remove(v)));
//            }
//            });
//        }
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
                    {header: 'Category', key: 'Category', width: 35},
                    {header: 'Manufacturer', key: 'Manufacturer', width: 35},
                    {header: 'Physical State', key: 'Physical State', width: 25},
                    {header: 'Type', key: 'Type', width: 25},
                    {header: 'Risk Level', key: 'Risk Level', width: 25},

                    {header: 'Contact Name (Emergency)', key: 'Contact Name (Emergency)', width: 35},
                    {header: 'Contact No. (Emergency)', key: 'Contact No. (Emergency)', width: 35},
                    {header: 'Contact Name (Manufacturer)', key: 'Contact Name (Manufacturer)', width: 35},
                    {header: 'Contact No. (Manufacturer)', key: 'Contact No. (Manufacturer)', width: 35},

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
                        'Category': msds.data.category || 'N/A',
                        'Manufacturer': msds.data.manufacturer || 'N/A',
                        'Physical State': physical_state || 'N/A',
                        'Type': type || 'N/A',
                        'Risk Level': msds.data.risk_level || 'N/A',

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

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const item = {id: doc_snapshot.id, data: doc_snapshot.data()};
                return ContainerFuns.mapResults(item);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    const filter = ContainerFuns.createDbFilter(searchText);
                    return filter(q);
                });
                list = await Promise.all(list.map(ContainerFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", category, manufacturer, risk_level} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (category) {
                        q = q.where('category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (risk_level) {
                        q = q.where('risk_level', '==', risk_level);
                    }
                    const filter = ContainerFuns.createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(ContainerFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {name = "", client_id, project_id, site_id, isNew} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1}, q => {
                    if (my_client) {
                        q = q.where('client_id', '==', my_client.id);
                    } else if (client_id) {
                        q = q.where('client_id', '==', client_id);
                    }
                    if (my_project) {
                        q = q.where('project_id', '==', my_project.id);
                    } else if (project_id) {
                        q = q.where('project_id', '==', project_id);
                    }
                    if (my_site) {
                        q = q.where('site_id', '==', my_site.id);
                    } else if (site_id) {
                        q = q.where('site_id', '==', site_id);
                    }
                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(ContainerFuns.mapResults));
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
            list.sortBy("data.name");
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

    new Controller(events);
})();