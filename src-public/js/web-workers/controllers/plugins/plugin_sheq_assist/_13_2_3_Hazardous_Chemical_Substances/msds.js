
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events) {
            super(events, {singular: "Material Safety Data Sheet", plural: "Material Safety Data Sheets"}, "plugin_sheq_assist/Hazardous_Chemical_Substances/msds/", "plugin_sheq_assist_Hazardous_Chemical_Substances_msds");

            const {addAction} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("category/list", this.list_categories.bind(this));
            addAction("manufacturer/list", this.list_manufacturers.bind(this));

            addAction("select/filter", this.filter_select.bind(this));
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            data.keywords = this.generateKeywords([data.name]);
            let item = await this.createAndUploadIfFile(evt, data, "doc");
            if (item) {
                const {id, data: {product, hazchem_sheet, date_identified}} = item;
                if (hazchem_sheet || product) {
                    if (product) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory').doc(product.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({sds: {id}, sds_date: date_identified, has_sds: "Yes"});
                        } else {
//                        return null;
                        }
                    }
                    if (hazchem_sheet) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_hazchem_sheets').doc(hazchem_sheet.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({sds: {id}});
                        } else {
//                        return null;
                        }
                    }
                    
                    item = await this.find_by_id(null, id);
                }

                return MSDSFuns.mapResults(item);
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            if (updateAttrs.name) {
                updateAttrs.keywords = this.generateKeywords([updateAttrs.name]);
            }
            const updatedData = await this.updateAndUploadIfFile(evt, id, updateAttrs, "doc");
            if (updatedData) {
                const {date_identified} = updatedData;
                const {product, hazchem_sheet} = updateAttrs;

                let updatedItem;
                if (hazchem_sheet || product) {
                    if (product) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory').doc(product.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({sds: {id}, sds_date: date_identified, has_sds: "Yes"});
                        } else {
//                        return null;
                        }
                    }
                    if (hazchem_sheet) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_hazchem_sheets').doc(hazchem_sheet.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({sds: {id}});
                        } else {
//                        return null;
                        }
                    }
                    
                    updatedItem = await this.find_by_id(null, id);
                } else {
                    updatedItem = {id, data: updatedData};
                }

                updatedItem = await MSDSFuns.mapResults(updatedItem);

                return updatedItem.data;
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
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
                                
                                product,
                                
                                name,
                                
                                common_names,
                                
                                chemical_name,
                                
                                empirical_formula,
                                
                                un_num,
                                
                                category,
                                
                                date_identified,
                                
                                application_or_use,
                                
                                supplier_list,
                                emergency_phone_nums,
                                risk_level,
                                more_product_info,
                                composition_or_information_on_ingredients,
                                hazards_identification,
                                first_aid_measures_and_precautions,
                                firefighting_measures,
                                accidental_release_measures,
                                handling_and_storage_requirements,
                                exposure_controls_or_personal_protection,
                                physical_and_chemical_properties,
                                stability_and_reactivity,
                                toxicological_info,
                                ecological_info,
                                disposal_considerations,
                                transport_info,
                                regulatory_info,
                                other_info,
                                doc
                            }
                        } = item;
                        
                        client = client || company;
                        
                        return {
                            idx: idx + 1,
                            
                            project: project && project.name,
                            site: site && site.name,
                            
                            product,
                            name,
                            common_names,
                            chemical_name,
                            empirical_formula,
                            un_num,
                            category,
                            date_identified:Dates.formatDateSQL(date_identified),
                            application_or_use,
                            supplier_list: (supplier_list || []).map(({manufacturer}) => manufacturer).join(', '),
                            emergency_phone_nums,
                            risk_level,
                            more_product_info,
                            composition_or_information_on_ingredients,
                            hazards_identification,
                            first_aid_measures_and_precautions,
                            firefighting_measures,
                            accidental_release_measures,
                            handling_and_storage_requirements,
                            exposure_controls_or_personal_protection,
                            physical_and_chemical_properties,
                            stability_and_reactivity,
                            toxicological_info,
                            ecological_info,
                            disposal_considerations,
                            transport_info,
                            regulatory_info,
                            other_info,
                            doc: doc && doc.dlUrls[0],
                            
                            
                            
                            status,
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/chemicals/Template-safety-datasheets.xlsx`.replace('//', '/')
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
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id, includes = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const item = {id: doc_snapshot.id, data: doc_snapshot.data()};

                const {productInclude, hazchem_sheetInclude} = includes;

                return MSDSFuns.mapResults(item, includes);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    const filter = MSDSFuns.createDbFilter(searchText);
                    return filter(q);
                });
                list = await Promise.all(list.map(MSDSFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {
                    name = "", category, manufacturer, risk_level, date_range,
                    client_id, project_id, site_id, isNew
                } = filterData;
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
                    //
                    if (category) {
                        q = q.where('category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (risk_level) {
                        q = q.where('risk_level', '==', risk_level);
                    }
                    if (date_range) {
                        const {start, end} = date_range;
                        if (start) {
                            q = q.where(`date_identified`, '>=', start);
                        }
                        if (end) {
                            q = q.where(`date_identified`, '<=', end);
                        }
                        q = q.orderBy(`date_identified`, "asc");
                    }

                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(MSDSFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
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
                    const filter = MSDSFuns.createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(MSDSFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_categories">
        async list_categories(evt) {
            return list_distinct_keys.call(this, evt, 'category');
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_manufacturers">
        async list_manufacturers(evt) {
            return list_distinct_keys.call(this, evt, 'manufacturer');
        }
        // </editor-fold>

        sortBy() {
            return "name";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="list_distinct_keys">
    function list_distinct_keys(evt, key) {
        return Events.whenLoggedIn(async loggedUser => {
            const name = "";
            let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, includeOnlyCompanyId: true}, q => {
                q = q.where(key, '!=', null);
                const filter = MSDSFuns.createDbFilter(name);
                q = q.orderBy(key, "asc");
                return filter(q);
            });
            return list.map(val => {
                return val.data[key];
            }).distinct();
        });
    }
    // </editor-fold>

    new Controller(events);
})();
