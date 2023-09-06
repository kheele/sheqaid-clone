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
                    {header: 'Category', key: 'Category', width: 35},
                    {header: 'Manufacturer', key: 'Manufacturer', width: 35},
                    {header: 'Physical State', key: 'Physical State', width: 25},
                    {header: 'Type', key: 'Type', width: 25},
                    {header: 'Risk Level', key: 'Risk Level', width: 25},
                    //8
                    {header: 'Contact Name (Emergency)', key: 'Contact Name (Emergency)', width: 35},
                    {header: 'Contact No. (Emergency)', key: 'Contact No. (Emergency)', width: 35},
                    {header: 'Contact Name (Manufacturer)', key: 'Contact Name (Manufacturer)', width: 35},
                    {header: 'Contact No. (Manufacturer)', key: 'Contact No. (Manufacturer)', width: 35},
                    //3
                    {header: 'Active Ingredients', key: 'Active Ingredients', width: 35},
                    //4
                    {
                        header: 'Physical Hazards (Hazard Identification)',
                        key: 'Physical Hazards (Hazard Identification)',
                        width: 35
                    },
                    {
                        header: 'Reproductive Hazards (Hazard Identification)',
                        key: 'Reproductive Hazards (Hazard Identification)',
                        width: 35
                    },
                    {
                        header: 'Biological Hazards (Hazard Identification)',
                        key: 'Biological Hazards (Hazard Identification)',
                        width: 35
                    },
                    //5
                    {
                        header: 'Splashes in Eyes (First Aid Procedures)',
                        key: 'Splashes in Eyes (First Aid Procedures)',
                        width: 35
                    },
                    {
                        header: 'Contact with Skin (First Aid Procedures)',
                        key: 'Contact with Skin (First Aid Procedures)',
                        width: 35
                    },
                    {
                        header: 'Mouth Contact or Eaten (First Aid Procedures)',
                        key: 'Mouth Contact or Eaten (First Aid Procedures)',
                        width: 35
                    },
                    {
                        header: 'Fumes Breathed In (First Aid Procedures)',
                        key: 'Fumes Breathed In (First Aid Procedures)',
                        width: 35
                    },
                    //6
                    {
                        header: 'Small Spills (<= 10 Litres) (Emergency Action For Spills)',
                        key: 'Small Spills (<= 10 Litres) (Emergency Action For Spills)',
                        width: 35
                    },
                    {
                        header: 'Large Spills (> 10 Litres) (Emergency Action For Spills)',
                        key: 'Large Spills (> 10 Litres) (Emergency Action For Spills)',
                        width: 35
                    },
                    //7
                    {header: 'Used Containers (Disposal)', key: 'Used Containers (Disposal)', width: 35},
                    {header: 'Unused Product (Disposal)', key: 'Unused Product (Disposal)', width: 35}
                ];

                console.log('print', list)

                const rows = list.map(({id, data: {
                created_at,
                        //0
                        client, project, site,
                        //1
                        product,
                        physical_state,
                        type,
                        //2
                        precaution_photo_concentrate_list,
                        precaution_photo_application_list,
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
                        contacts_manufacturer_num
                }
                }) => {
                    const mapList = list => {
                        return list ? list.map(v => v.text).distinct().join(', ') : "N/A";
                    };

                    const res = {
                        //0
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),
                        //1
                        'Product Name': product.data.name,
                        'Category': product.data.category || 'N/A',
                        'Manufacturer': product.data.manufacturer || 'N/A',
                        'Physical State': physical_state || 'N/A',
                        'Type': type || 'N/A',
                        'Risk Level': product.data.risk_level || 'N/A',
                        //8
                        'Contact Name (Emergency)': contacts_emergency_name || 'N/A',
                        'Contact No. (Emergency)': contacts_emergency_num || 'N/A',
                        'Contact Name (Manufacturer)': contacts_manufacturer_name || 'N/A',
                        'Contact No. (Manufacturer)': contacts_manufacturer_num || 'N/A',
                        //3
                        'Active Ingredients': mapList(active_ingredient_list),
                        //4
                        'Physical Hazards (Hazard Identification)': mapList(hazard_identification_physical_list),
                        'Reproductive Hazards (Hazard Identification)': mapList(hazard_identification_reproductive_list),
                        'Biological Hazards (Hazard Identification)': mapList(hazard_identification_biological_list),
                        //5
                        'Splashes in Eyes (First Aid Procedures)': mapList(first_aid_procedure_splashes_in_eyes_list),
                        'Contact with Skin (First Aid Procedures)': mapList(first_aid_procedure_contact_with_skin_list),
                        'Mouth Contact or Eaten (First Aid Procedures)': mapList(first_aid_procedure_mouth_contact_or_eaten_list),
                        'Fumes Breathed In (First Aid Procedures)': mapList(first_aid_procedure_fumes_breathed_in_list),
                        //6
                        'Small Spills (<= 10 Litres) (Emergency Action For Spills)': mapList(emergency_action_for_spills_small_list),
                        'Large Spills (> 10 Litres) (Emergency Action For Spills)': mapList(emergency_action_for_spills_large_list),
                        //7
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