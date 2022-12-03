
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events, db) {
            super(events, db, {singular: "Chemical Inventory", plural: "Chemical Inventory"}, "plugin_sheq_assist/Hazardous_Chemical_Substances/chemical-inventory/", "plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory");

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
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    //0
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},
                    //1
                    {header: 'Product Name', key: 'Product Name', width: 35},
                    {header: 'Common Names / Synonyms', key: 'Common Names / Synonyms', width: 35},
                    {header: 'Chemical Name', key: 'Chemical Name', width: 35},
                    {header: 'Empirical Formula', key: 'Empirical Formula', width: 35},
                    {header: 'UN Number', key: 'UN Number', width: 35},
                    {header: 'CAS Number', key: 'CAS Number', width: 35},
                    {header: 'Concentration', key: 'Concentration', width: 35},

                    {header: 'Category', key: 'Category', width: 35},
                    {header: 'Physical State', key: 'Physical State', width: 25},
                    {header: 'Type', key: 'Type', width: 25},

                    {header: 'Application / Use', key: 'Application / Use', width: 35},

                    {header: 'Manufacturer / Supplier', key: 'Manufacturer / Supplier', width: 35},
                    {header: 'Manufacturer/Supplier Address', key: 'Manufacturer/Supplier Address', width: 35},
                    {header: 'Manufacturer/Supplier Telephone', key: 'Manufacturer/Supplier Telephone', width: 35},
                    {header: 'Manufacturer/Supplier Fax', key: 'Manufacturer/Supplier Fax', width: 35},
                    {header: 'Manufacturer/Supplier E-mail Address', key: 'Manufacturer/Supplier E-mail Address', width: 35},
                    {header: 'Manufacturer/Supplier Website', key: 'Manufacturer/Supplier Website', width: 35},

                    {header: 'Emergency Phone Numbers', key: 'Emergency Phone Numbers', width: 35},

                    //2
                    {header: 'Location Where Product Is Used', key: 'Location Where Product Is Used', width: 35},
                    {header: 'Process Where Product Is Used', key: 'Process Where Product Is Used', width: 35},
                    {header: 'Is Stable?', key: 'Is Stable?', width: 35},
                    {header: 'Requires Cool, Well-Ventilated Area?', key: 'Requires Cool, Well-Ventilated Area?', width: 35},
                    {header: 'Heat, Sparks, Static, Flames', key: 'Heat, Sparks, Static, Flames', width: 35},
                    {header: 'Spillage Control', key: 'Spillage Control', width: 35},
                    {header: 'Other Special Info', key: 'Other Special Info', width: 35},

                    //3
                    {header: 'Compatible With', key: 'Compatible With', width: 35},
                    {header: 'Incompatible With', key: 'Incompatible With', width: 35},

                    //4
                    {header: 'Risk Level', key: 'Risk Level', width: 35},

                    //5
                    {header: 'Is Combustible?', key: 'Is Combustible?', width: 35},
                    {header: 'Is Flammable?', key: 'Is Flammable?', width: 35},
                    {header: 'Flammability / Combustibility Class', key: 'Flammability / Combustibility Class', width: 35},

                    //6
                    {header: 'Fire Fighting (Foam)', key: 'Fire Fighting (Foam)', width: 35},
                    {header: 'Fire Fighting (DCP)', key: 'Fire Fighting (DCP)', width: 35},
                    {header: 'Fire Fighting (CO2)', key: 'Fire Fighting (CO2)', width: 35},
                    {header: 'Fire Fighting (Sand)', key: 'Fire Fighting (Sand)', width: 35},
                    {header: 'Fire Fighting (Water)', key: 'Fire Fighting (Water)', width: 35},
                    {header: 'Fire Fighting (Other)', key: 'Fire Fighting (Other)', width: 35},

                    //7
                    {header: 'Is Substance Hazardous?', key: 'Is Substance Hazardous?', width: 35},
                    {header: 'Hazard Class', key: 'Hazard Class', width: 35},

                    //8
                    {header: 'Has SDS?', key: 'Has SDS?', width: 35},
                    {header: 'Safety Data Sheet Date', key: 'Safety Data Sheet Date', width: 35},

                    //9
                    {header: 'Has Hazchem Sheet?', key: 'Has Hazchem Sheet?', width: 35},
                    {header: 'Hazchem Sheet Date', key: 'Hazchem Sheet Date', width: 35},

                    //10
                    {header: 'Has Risk Assessment?', key: 'Has Risk Assessment?', width: 35},
                    {header: 'Risk Assessment Date', key: 'Risk Assessment Date', width: 35},

                    //11
                    {header: 'PPE Required', key: 'PPE Required', width: 35},

                    //12
                    {header: 'Action / Comments', key: 'Action / Comments', width: 35}

                    //13
//                    {header: 'Stock Control', key: 'Stock Control', width: 35}
                ];

                console.log('print', list)

                const rows = list.map(({id, data: {
                created_at,
                        //0
                        client, project, site,
                        //1
                        name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
                        category, physical_state, type,
                        application_or_use,
                        manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                        emergency_phone_nums,
                        //2
                        location_where_product_is_used, process_where_product_is_used,
                        is_stable, is_cool_well_ventilated_area, heat_sparks_static_flames, spillage_control, other_special_info,
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
                        has_sds, sds, sds_doc, sds_date,
                        //9
                        has_hazchem_sheet, hazchem_sheet, hazchem_sheet_doc, hazchem_sheet_date,
                        //10
                        has_risk_assessment, risk_assessment_doc, risk_assessment_date,
                        //11
                        ppe_list,
                        //12
                        action_or_comments,
                        //13
//                        chemical_stock_list
                }}) => {

                    const res = {
                        //0
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),
                        //1
                        'Product Name': name || 'N/A',
                        'Common Names / Synonyms': common_names || 'N/A',
                        'Chemical Name': chemical_name || 'N/A',
                        'Empirical Formula': empirical_formula || 'N/A',
                        'UN Number': un_num || 'N/A',
                        'CAS Number': cas_num || 'N/A',
                        'Concentration': concentration || 'N/A',
                        'Category': category || 'N/A',
                        'Physical State': physical_state || 'N/A',
                        'Type': type || 'N/A',
                        'Application / Use': application_or_use || 'N/A',
                        'Manufacturer / Supplier': manufacturer || 'N/A',
                        'Manufacturer/Supplier Address': manufacturer_addr || 'N/A',
                        'Manufacturer/Supplier Telephone': manufacturer_phone_num || 'N/A',
                        'Manufacturer/Supplier Fax': manufacturer_email || 'N/A',
                        'Manufacturer/Supplier E-mail Address': manufacturer_fax || 'N/A',
                        'Manufacturer/Supplier Website': manufacturer_website || 'N/A',
                        'Emergency Phone Numbers': emergency_phone_nums && emergency_phone_nums.join(', ') || 'N/A',
                        //2
                        'Location Where Product Is Used': location_where_product_is_used && location_where_product_is_used.join(', ') || 'N/A',
                        'Process Where Product Is Used': process_where_product_is_used || 'N/A',
                        'Is Stable?': is_stable || 'N/A',
                        'Requires Cool, Well-Ventilated Area?': is_cool_well_ventilated_area || 'N/A',
                        'Heat, Sparks, Static, Flames': heat_sparks_static_flames && heat_sparks_static_flames.join(', ') || 'N/A',
                        'Spillage Control': spillage_control && spillage_control.join(', ') || 'N/A',
                        'Other Special Info': other_special_info && other_special_info.join(', ') || 'N/A',
                        //3
                        'Compatible With': compatible_with_list && compatible_with_list.join(', ') || 'N/A',
                        'Incompatible With': incompatible_with_list && incompatible_with_list.join(', ') || 'N/A',
                        //4
                        'Risk Level': risk_level || 'N/A',
                        //5
                        'Is Combustible?': is_combustible || 'N/A',
                        'Is Flammable?': is_flammable || 'N/A',
                        'Flammability / Combustibility Class': flammability_combustibility_class || 'N/A',
                        //6
                        'Fire Fighting (Foam)': fire_fighting_foam || 'N/A',
                        'Fire Fighting (DCP)': fire_fighting_dcp || 'N/A',
                        'Fire Fighting (CO2)': fire_fighting_co2 || 'N/A',
                        'Fire Fighting (Sand)': fire_fighting_sand || 'N/A',
                        'Fire Fighting (Water)': fire_fighting_water && fire_fighting_water.join(', ') || 'N/A',
                        'Fire Fighting (Other)': fire_fighting_other && fire_fighting_other.join(', ') || 'N/A',
                        //7
                        'Is Substance Hazardous?': is_hazardous || 'N/A',
                        'Hazard Class': hazard_class_list && hazard_class_list.join(', ') || 'N/A',
                        //8
                        'Has SDS?': has_sds || 'N/A',
                        'Safety Data Sheet Date': Dates.formatDate(sds_date) || 'N/A',
                        //9
                        'Has Hazchem Sheet?': has_hazchem_sheet || 'N/A',
                        'Hazchem Sheet Date': Dates.formatDate(hazchem_sheet_date) || 'N/A',
                        //10
                        'Has Risk Assessment?': has_risk_assessment || 'N/A',
                        'Risk Assessment Date': Dates.formatDate(risk_assessment_date) || 'N/A',
                        //11
                        'PPE Required': ppe_list && ppe_list.map(v => v.data.name).join(', ') || 'N/A',
                        //12
                        'Action / Comments': action_or_comments || 'N/A'
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Chemical-Product-Docs", "Chemical-Products-Active", "Chemical-Products Data", cols, rows);
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

    new Controller(events, db2);
})();