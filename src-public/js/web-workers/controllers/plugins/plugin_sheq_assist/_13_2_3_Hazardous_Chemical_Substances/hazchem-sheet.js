(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events) {
            super(events, {
                singular: "Hazchem Sheet",
                plural: "Hazchem Sheets"
            }, "plugin_sheq_assist/Hazardous_Chemical_Substances/hazchem-sheet/", "plugin_sheq_assist_Hazardous_Chemical_Substances_hazchem_sheets");

            const {addAction} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("physical-state/list", this.list_physical_states.bind(this));
            addAction("type/list", this.list_types.bind(this));

            addAction("select/filter", this.filter_select.bind(this));

            let transfer = async () => {
                const col_ref = await db2.collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await col_ref.get();
                await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const msds = doc.get('msds');
                    if (msds) {
                        const name = msds.name;

                        console.log('start', name, msds.id)
                        if (doc.get('product')) {
                            const doc_ref = await db2.collection('plugin_sheq_assist_Hazardous_Chemical_Substances_msds').doc(msds.id);//Promise < DocumentReference < T > >
                            const docSnapshot = await doc_ref.get();
                            console.log('start2', name, msds.id)
                            if (docSnapshot.exists) {
                                let product = {
                                    company_id: docSnapshot.get('company_id'),
                                    client_id: docSnapshot.get('client_id'),
                                    client: docSnapshot.get('client'),
                                    project_id: docSnapshot.get('project_id') || null,
                                    project: docSnapshot.get('project') || null,
                                    site_id: docSnapshot.get('site_id') || null,
                                    site: docSnapshot.get('site') || null
                                };
                                console.log('product update', name, msds.id, product)
                                const invcolRef = db2.collection('plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory');
                                const {id: invid} = doc.get('product');
                                await invcolRef.doc(invid).set(product, {merge: true});//Promise < DocumentReference < T > >;

                                console.log('product update hazchem', name, msds.id, product)
                            }
                            console.log('end2', name, msds.id)
                        }
//                        await doc.ref.set({sds: {id: msds.id}}, {merge: true});
                        console.log('end', name, msds.id)
                    }
                }));
            };
//            transfer();
        }

        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            if (!data.keys) {
                data.keys = {};
            }

            const {name, physical_state, type, contacts_manufacturer_name, product, sds, keys} = data;

            data.keywords = this.generateKeywords([name]);

            keys.physical_state = physical_state;
            keys.type = type;
            keys.manufacturer = contacts_manufacturer_name;

            if (product) {
                const {category, manufacturer, risk_level} = product;
                keys.category = category;
                keys.risk_level = risk_level;
            }
            if (sds && !product) {
                const {category, manufacturer, risk_level} = sds;
                keys.category = category;
                keys.risk_level = risk_level;
            }

            let item = await this.createAndUploadIfManyFiles(
                    evt, data,
                    ["doc", "precaution_photo_concentrate_list", "precaution_photo_application_list"]
                    );
            if (item) {
                const {id, data: {product, sds, date_identified}} = item;
                if (product || sds) {
                    if (product) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory').doc(product.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({hazchem_sheet: {id}, /*hazchem_sheet_date: date_identified,*/ has_hazchem_sheet: "Yes"});
                        } else {
//                        return null;
                        }
                    }
                    if (sds) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_msds').doc(sds.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({hazchem_sheet: {id}});
                        } else {
//                        return null;
                        }
                    }

                    item = await this.find_by_id(null, id);
                }
                return HazcheSheetFuns.mapResults(item);
            }
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            const {name, physical_state, type, contacts_manufacturer_name, product, sds} = updateAttrs;

            if (name) {
                updateAttrs.keywords = this.generateKeywords([name]);
            }

            const keys = {};
            if (physical_state) {
                keys.physical_state = physical_state;
            }
            if (type) {
                keys.type = type;
            }
            if (contacts_manufacturer_name) {
                keys.manufacturer = contacts_manufacturer_name;
            }

            if (product) {
                const {category, manufacturer, risk_level} = product;
                keys.category = category;
                keys.risk_level = risk_level;
            }
            if (sds && !product) {
                const {category, manufacturer, risk_level} = sds;
                keys.category = category;
                keys.risk_level = risk_level;
            }

            if (!Object.keys(keys).isEmpty()) {
                updateAttrs.keys = keys;
            }

            const updatedData = await this.updateAndUploadIfManyFiles(evt, id, updateAttrs, ["doc", "precaution_photo_concentrate_list", "precaution_photo_application_list"]);
            if (updatedData) {
                const {date_identified} = updatedData;
                const {product, sds} = updateAttrs;

                let updatedItem;
                if (product || sds) {
                    if (product) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_chemical_inventory').doc(product.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({hazchem_sheet: {id}, /*hazchem_sheet_date: date_identified,*/ has_hazchem_sheet: "Yes"});
                        } else {
//                        return null;
                        }
                    }
                    if (sds) {
                        const doc_ref = await this.getDB().collection('plugin_sheq_assist_Hazardous_Chemical_Substances_msds').doc(sds.id);
                        const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        if (doc_snapshot.exists) {
                            await doc_ref.update({hazchem_sheet: {id}});
                        } else {
//                        return null;
                        }
                    }

                    updatedItem = await this.find_by_id(null, id);
                } else {
                    updatedItem = {id, data: updatedData};
                }

                updatedItem = await HazcheSheetFuns.mapResults(updatedItem);

                return updatedItem.data;
            }
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({
            data: {
            doc,
                    precaution_photo_concentrate_list,
                    precaution_photo_application_list
            }
            }) => {
                doc && await files.remove(doc);

                if (precaution_photo_concentrate_list) {
                    await Promise.all(precaution_photo_concentrate_list.map(async v => await v && files.remove(v)));
                }
                if (precaution_photo_application_list) {
                    await Promise.all(precaution_photo_application_list.map(async v => await v && files.remove(v)));
            }
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
                                //1 done
                                name,
                                physical_state,
                                type,
                                product,
                                sds,
                                //3
                                active_ingredient_list,
                                //4
                                hazard_identification_physical_list,
                                hazard_identification_reproductive_list,
                                hazard_identification_biological_list,
                                //5
                                first_aid_procedure_splashes_in_eyes_list,
                                first_aid_procedure_contact_with_skin_list,
                                first_aid_procedure_mouth_contact_or_eaten_list,
                                first_aid_procedure_fumes_breathed_in_list,
                                //6
                                emergency_action_for_spills_small_list,
                                emergency_action_for_spills_large_list,
                                //7
                                disposal_used_container_list,
                                disposal_unused_product_list,
                                //8
                                contacts_emergency_name,
                                contacts_emergency_num,
                                contacts_manufacturer_name,
                                contacts_manufacturer_num,
                                //9
                                doc,
                                //10
                                precaution_photo_list,
                            }
                        } = item;
                        
                        client = client || company;
                        
                        return {
                            idx: idx + 1,
                            
                            project: project && project.name,
                            site: site && site.name,
                            
                            name,
                            physical_state,
                            type,
                            product,
                            sds,
                            active_ingredient_list: (active_ingredient_list || []).map(({value}) => value).join(', '),
                            hazard_identification_physical_list: (hazard_identification_physical_list || []).map(({value}) => value).join(', '),
                            hazard_identification_reproductive_list:  (hazard_identification_reproductive_list || []).map(({value}) => value).join(', '),
                            hazard_identification_biological_list:  (hazard_identification_biological_list || []).map(({value}) => value).join(', '),
                            first_aid_procedure_splashes_in_eyes_list:  (first_aid_procedure_splashes_in_eyes_list || []).map(({value}) => value).join(', '),
                            first_aid_procedure_contact_with_skin_list: (first_aid_procedure_contact_with_skin_list || []).map(({value}) => value).join(', '),
                            first_aid_procedure_mouth_contact_or_eaten_list: (first_aid_procedure_mouth_contact_or_eaten_list || []).map(({value}) => value).join(', '),
                            first_aid_procedure_fumes_breathed_in_list: (first_aid_procedure_fumes_breathed_in_list || []).map(({value}) => value).join(', '),
                            emergency_action_for_spills_small_list: (emergency_action_for_spills_small_list || []).map(({value}) => value).join(', '),
                            emergency_action_for_spills_large_list: (emergency_action_for_spills_large_list || []).map(({value}) => value).join(', '),
                            disposal_used_container_list: (disposal_used_container_list || []).map(({value}) => value).join(', '),
                            disposal_unused_product_list: (disposal_unused_product_list || []).map(({value}) => value).join(', '),
                            precaution_photo_list: (precaution_photo_list || []).map(({doc}) => doc.dlUrls).join(', '),
                            contacts_emergency_name,
                            contacts_emergency_num,
                            contacts_manufacturer_name,
                            contacts_manufacturer_num,
                            doc: doc && doc.dlUrls[0],
                            
                            
                            
                            status,
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/chemicals/Template-hazchem-sheets.xlsx`.replace('//', '/')
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

                const {productInclude, sdsInclude} = includes;

                return HazcheSheetFuns.mapResults(item, includes);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    const filter = HazcheSheetFuns.createDbFilter(searchText);
                    return filter(q);
                });
                list = await Promise.all(list.map(HazcheSheetFuns.mapResults));
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
                    name = "", category, manufacturer, physical_state, type, risk_level, date_range,
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
                        q = q.where('keys.category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('keys.manufacturer', '==', manufacturer);
                    }
                    if (physical_state) {
                        q = q.where('physical_state', '==', physical_state);
                    }
                    if (type) {
                        q = q.where('type', '==', type);
                    }
                    if (risk_level) {
                        q = q.where('keys.risk_level', '==', risk_level);
                    }
                    if (date_range) {
                        const {start, end} = date_range;
                        if (start) {
                            q = q.where(`created_at`, '>=', start.toDate());
                        }
                        if (end) {
                            q = q.where(`created_at`, '<=', end.toDate());
                        }
                        q = q.orderBy(`created_at`, "asc");
                    }

                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(HazcheSheetFuns.mapResults));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", category, manufacturer, physical_state, type, risk_level} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (category) {
                        q = q.where('keys.category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('keys.manufacturer', '==', manufacturer);
                    }
                    if (physical_state) {
                        q = q.where('physical_state', '==', physical_state);
                    }
                    if (type) {
                        q = q.where('type', '==', type);
                    }
                    if (risk_level) {
                        q = q.where('keys.risk_level', '==', risk_level);
                    }

                    const filter = HazcheSheetFuns.createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(HazcheSheetFuns.mapResults));
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
                const filter = HazcheSheetFuns.createDbFilter(name);
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
