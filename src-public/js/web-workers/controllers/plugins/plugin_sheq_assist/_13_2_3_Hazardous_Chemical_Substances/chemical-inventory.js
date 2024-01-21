
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events) {
            super(events, {singular: "Chemical Inventory", plural: "Chemical Inventory"}, "plugin_sheq_assist/Hazardous_Chemical_Substances/chemical-inventory/", "plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory");

            const {addAction} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("physical-state/list", this.list_physical_states.bind(this));
            addAction("type/list", this.list_types.bind(this));
            addAction("category/list", this.list_categories.bind(this));
            addAction("manufacturer/list", this.list_manufacturers.bind(this));

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
        async create(evt, data) {
            data.keywords = this.generateKeywords([data.name]);
            let item = await this.createAndUploadIfManyFiles(
                    evt, data,
                    ["sds_doc", "hazchem_sheet_doc", "risk_assessment_doc"]
                    );
            if (item) {
                const {id, data: {name, sds, hazchem_sheet}} = item;
                if (hazchem_sheet || sds) {
                    if (sds) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_msds').doc(sds.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({product: {id, name}});
                        } else {
//                        return null;
                        }
                    }
                    if (hazchem_sheet) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_hazchem_sheets').doc(hazchem_sheet.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({product: {id, name}});
                        } else {
//                        return null;
                        }
                    }

                    item = await this.find_by_id(null, id);
                }

                return ChemicalFuns.mapResults(item);
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            if (updateAttrs.name) {
                updateAttrs.keywords = this.generateKeywords([updateAttrs.name]);
            }

            const updatedData = await this.updateAndUploadIfManyFiles(evt, id, updateAttrs, ["sds_doc", "hazchem_sheet_doc", "risk_assessment_doc"]);
            if (updatedData) {
                const {name} = updatedData;
                const {sds, hazchem_sheet} = updateAttrs;
                
                let updatedItem;
                if (hazchem_sheet || sds) {
                    if (sds) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_msds').doc(sds.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({product: {id, name}});
                        } else {
//                        return null;
                        }
                    }
                    if (hazchem_sheet) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_hazchem_sheets').doc(hazchem_sheet.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({product: {id, name}});
                        } else {
//                        return null;
                        }
                    }
                    
                    updatedItem = await this.find_by_id(null, id);
                } else {
                    updatedItem = {id, data: updatedData};
                }
                
                updatedItem = await ChemicalFuns.mapResults(updatedItem);

                return updatedItem.data;
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {sds_doc, hazchem_sheet_doc, risk_assessment_doc}}) => {
                await sds_doc && files.remove(sds_doc);
                await hazchem_sheet_doc && files.remove(hazchem_sheet_doc);
                await risk_assessment_doc && files.remove(risk_assessment_doc);
            });
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
                                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                                company, client, project, site,
                                //1
                                
                                name,
                                common_names,
                                chemical_name,
                                empirical_formula,
                                un_num,
                                cas_num,
                                concentration,
                                category,
                                physical_state,
                                type,
                                application_or_use,
                                supplier_list,
                                emergency_phone_nums,
                                //2
                                location_where_product_is_used,
                                process_where_product_is_used,
                                is_stable,
                                is_cool_well_ventilated_area,
                                heat_sparks_static_flames,
                                spillage_control,
                                other_special_info,
                                //3
                                compatible_with_list,
                                incompatible_with_list,
                                //4
                                risk_level,
                                //5
                                is_combustible,
                                is_flammable,
                                flammability_combustibility_class,
                                //6
                                fire_fighting_foam,
                                fire_fighting_dcp,
                                fire_fighting_co2,
                                fire_fighting_sand,
                                fire_fighting_water,
                                fire_fighting_other,
                                //7
                                is_hazardous,
                                hazard_class_list,
                                //8
                                has_sds,
                                sds,
                                sds_doc,
                                sds_date,
                                //9
                                has_hazchem_sheet,
                                hazchem_sheet,
                                hazchem_sheet_doc,
                                hazchem_sheet_date,
                                //10
                                has_risk_assessment,
                                risk_assessment_doc,
                                risk_assessment_date,
                                //11
                                ppe_list,
                                //12
                                action_or_comments,
                                //13
                                chemical_stock_list
                            }
                        } = item;
                        
                        client = client || company;
                        
                        return {
                            idx: idx + 1,
                            
                            project: project && project.name,
                            site: site && site.name,
                            
                            id,
                            //
                            
                            name,
                            common_names,
                            empirical_formula,
                            un_num,
                            cas_num,
                            concentration,
                            category,
                            physical_state,
                            emergency_phone_nums,
                            location_where_product_is_used,
                            process_where_product_is_used,
                            is_stable,
                            is_cool_well_ventilated_area,
                            heat_sparks_static_flames,
                            spillage_control,
                            other_special_info,
                            compatible_with_list,
                            incompatible_with_list,
                            risk_level,
                            is_combustible,
                            is_flammable,
                            flammability_combustibility_class,
                            fire_fighting_foam,
                            fire_fighting_dcp,
                            fire_fighting_co2,
                            fire_fighting_sand,
                            fire_fighting_water,
                            fire_fighting_other,
                            is_hazardous,
                            
                            has_sds,
                            sds,
                            sds_doc,
                            sds_date: Dates.formatDateSQL(sds_date),
                            has_hazchem_sheet,
                            hazchem_sheet,
                            hazchem_sheet_doc,
                            hazchem_sheet_date:Dates.formatDateSQL(hazchem_sheet_date),
                            has_risk_assessment,
                            risk_assessment_doc,
                            risk_assessment_date:Dates.formatDateSQL(risk_assessment_date),
                            action_or_comments,
                            
                            chemical_stock_list: (chemical_stock_list || []).filter(v => !!v).map((
                              {is_clearly_labeled, storage_location, unit, qty, date_received, expiry_date}
                            ) => is_clearly_labeled).join(','),
                            supplier_list: (supplier_list || []).map(({manufacturer, email, phone, fax, website, address,}) => manufacturer).join(', '),
                            
                            ppe_list: (ppe_list || []).filter(v => v && (v.id || (v.ppe && v.ppe.id))).map(v =>v),
                            
                            //
                            status,
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/chemicals/Template-chemicals-inventory.xlsx`.replace('//', '/')
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

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id, includes = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const item = {id: doc_snapshot.id, data: doc_snapshot.data()};

                const {hazchem_sheetInclude, sdsInclude} = includes;

                return ChemicalFuns.mapResults(item, includes);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    const filter = ChemicalFuns.createDbFilter(searchText);
                    return filter(q);
                });
                list = await Promise.all(list.map(ChemicalFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    name = "", physical_state, type, category, manufacturer, risk_level, is_stable, is_hazardous, is_combustible, is_flammable,
                    isNew
                } = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1}, q => {
                    if (physical_state) {
                        q = q.where('physical_state', '==', physical_state);
                    }
                    if (type) {
                        q = q.where('type', '==', type);
                    }
                    if (category) {
                        q = q.where('category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (risk_level) {
                        q = q.where('risk_level', '==', risk_level);
                    }

                    if (is_stable) {
                        q = q.where('is_stable', '==', is_stable);
                    }
                    if (is_hazardous) {
                        q = q.where('is_hazardous', '==', is_hazardous);
                    }
                    if (is_combustible) {
                        q = q.where('is_combustible', '==', is_combustible);
                    }
                    if (is_flammable) {
                        q = q.where('is_flammable', '==', is_flammable);
                    }

                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(ChemicalFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {
                    name = "", physical_state, type, risk_level, category, manufacturer, is_stable, is_hazardous, is_combustible, is_flammable,
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

                    if (category) {
                        q = q.where('category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (physical_state) {
                        q = q.where('physical_state', '==', physical_state);
                    }
                    if (type) {
                        q = q.where('type', '==', type);
                    }
                    if (risk_level) {
                        q = q.where('risk_level', '==', risk_level);
                    }

                    if (is_stable) {
                        q = q.where('is_stable', '==', is_stable);
                    }
                    if (is_hazardous) {
                        q = q.where('is_hazardous', '==', is_hazardous);
                    }
                    if (is_combustible) {
                        q = q.where('is_combustible', '==', is_combustible);
                    }
                    if (is_flammable) {
                        q = q.where('is_flammable', '==', is_flammable);
                    }

                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(ChemicalFuns.mapResults));
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
                const filter = ChemicalFuns.createDbFilter(name);
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
