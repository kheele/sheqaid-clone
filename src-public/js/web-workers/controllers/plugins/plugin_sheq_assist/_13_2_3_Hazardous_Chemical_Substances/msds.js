
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

                    {header: 'Category', key: 'Category', width: 35},
                    {header: 'Date Identified', key: 'Date Identified', width: 35},

                    {header: 'Application / Use', key: 'Application / Use', width: 35},

                    {header: 'Manufacturer / Supplier', key: 'Manufacturer / Supplier', width: 35},
                    {header: 'Manufacturer/Supplier Address', key: 'Manufacturer/Supplier Address', width: 35},
                    {header: 'Manufacturer/Supplier Telephone', key: 'Manufacturer/Supplier Telephone', width: 35},
                    {header: 'Manufacturer/Supplier Fax', key: 'Manufacturer/Supplier Fax', width: 35},
                    {header: 'Manufacturer/Supplier E-mail Address', key: 'Manufacturer/Supplier E-mail Address', width: 35},
                    {header: 'Manufacturer/Supplier Website', key: 'Manufacturer/Supplier Website', width: 35},

                    {header: 'Emergency Phone Numbers', key: 'Emergency Phone Numbers', width: 35},

                    {header: 'Risk Level', key: 'Risk Level', width: 35},

                    {header: 'More Product Information', key: 'More Product Information', width: 35},
                    //2
                    {header: 'Composition/Information On Ingredients', key: 'Composition/Information On Ingredients', width: 35},
                    //3
                    {header: 'Hazards Identification', key: 'Hazards Identification', width: 35},
                    //4
                    {header: 'First Aid Measures & Precautions', key: 'First Aid Measures & Precautions', width: 35},
                    //5
                    {header: 'Firefighting Measures', key: 'Firefighting Measures', width: 35},
                    //6
                    {header: 'Accidental Release Measures (Spillage)', key: 'Accidental Release Measures (Spillage)', width: 35},
                    //7
                    {header: 'Handling & Storage Requirements', key: 'Handling & Storage Requirements', width: 35},
                    //8
                    {header: 'Exposure Controls / Personal Protection', key: 'Exposure Controls / Personal Protection', width: 35},
                    //9
                    {header: 'Physical & Chemical Properties', key: 'Physical & Chemical Properties', width: 35},
                    //10
                    {header: 'Stability & Reactivity', key: 'Stability & Reactivity', width: 35},
                    //11
                    {header: 'Toxicological Information', key: 'Toxicological Information', width: 35},
                    //12
                    {header: 'Ecological Information', key: 'Ecological Information', width: 35},
                    //13
                    {header: 'Disposal Considerations', key: 'Disposal Considerations', width: 35},
                    //14
                    {header: 'Transport Information', key: 'Transport Information', width: 35},
                    //15
                    {header: 'Regulatory Information', key: 'Regulatory Information', width: 35},
                    //16
                    {header: 'Other Information', key: 'Other Information', width: 35},
                    //17
                    {header: 'Document', key: 'Document', width: 35}
                ];

                console.log('print', list)

                const rows = list.map(({id, data: {
                //0
                client, project, site,
                        //1
                        name, common_names, chemical_name, empirical_formula, un_num,
                        category, date_identified, //other added
                        application_or_use,
                        manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                        emergency_phone_nums,
                        //            emergency_phone, //replaced with emergency_phone_nums
                        risk_level, //other added
                        more_product_info,
                        //2
                        composition_or_information_on_ingredients,
                        //3
                        hazards_identification,
                        //4
                        first_aid_measures_and_precautions,
                        //5
                        firefighting_measures,
                        //6
                        accidental_release_measures,
                        //7
                        handling_and_storage_requirements,
                        //8
                        exposure_controls_or_personal_protection,
                        //9
                        physical_and_chemical_properties,
                        //10
                        stability_and_reactivity,
                        //11
                        toxicological_info,
                        //12
                        ecological_info,
                        //13
                        disposal_considerations,
                        //14
                        transport_info,
                        //15
                        regulatory_info,
                        //16
                        other_info,
                        //17
                        doc
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
                        'Category': category || 'N/A',
                        'Date Identified': date_identified ? Dates.formatDate(date_identified) : 'N/A',
                        'Application / Use': application_or_use || 'N/A',
                        'Manufacturer / Supplier': manufacturer || 'N/A',
                        'Manufacturer/Supplier Address': manufacturer_addr || 'N/A',
                        'Manufacturer/Supplier Telephone': manufacturer_phone_num || 'N/A',
                        'Manufacturer/Supplier Fax': manufacturer_email || 'N/A',
                        'Manufacturer/Supplier E-mail Address': manufacturer_fax || 'N/A',
                        'Manufacturer/Supplier Website': manufacturer_website || 'N/A',
                        'Emergency Phone Numbers': emergency_phone_nums && emergency_phone_nums.join(', ') || 'N/A',
                        'Risk Level': risk_level || 'N/A',
                        'More Product Information': more_product_info || 'N/A',

                        //2
                        'Composition/Information On Ingredients': composition_or_information_on_ingredients || 'N/A',
                        //3
                        'Hazards Identification': hazards_identification || 'N/A',
                        //4
                        'First Aid Measures & Precautions': first_aid_measures_and_precautions || 'N/A',
                        //5
                        'Firefighting Measures': firefighting_measures || 'N/A',
                        //6
                        'Accidental Release Measures (Spillage)': accidental_release_measures || 'N/A',
                        //7
                        'Handling & Storage Requirements': handling_and_storage_requirements || 'N/A',
                        //8
                        'Exposure Controls / Personal Protection': exposure_controls_or_personal_protection || 'N/A',
                        //9
                        'Physical & Chemical Properties': physical_and_chemical_properties || 'N/A',
                        //10
                        'Stability & Reactivity': stability_and_reactivity || 'N/A',
                        //11
                        'Toxicological Information': toxicological_info || 'N/A',
                        //12
                        'Ecological Information': ecological_info || 'N/A',
                        //13
                        'Disposal Considerations': disposal_considerations || 'N/A',
                        //14
                        'Transport Information': transport_info || 'N/A',
                        //15
                        'Regulatory Information': regulatory_info || 'N/A',
                        //16
                        'Other Information': other_info || 'N/A',
                        //17
                        'Document': doc && doc.dlUrls[0] || 'N/A',
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "MSDS-Docs", "MSDS-Active", "MSDS Data", cols, rows);
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