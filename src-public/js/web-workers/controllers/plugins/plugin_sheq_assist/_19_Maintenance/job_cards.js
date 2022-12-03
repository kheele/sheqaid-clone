
(() => {
    class Controller extends AControllerAid {

        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Asset", plural: "Assets"}, "plugin_sheq_assist/19_Maintenance/tools/job-cards", "plugin_sheq_assist_19_Maintenance_job-cards");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);

            const {addAction, search_by_name, filter} = this;
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
            
            addAction("select/filter", this.filter_select.bind(this));
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {barcode_or_qr_code} = data;
                data.status = 'In Storage';//In Storage | Checked Out | Loaned Out | Out For Repair
                data.is_in_service = true;
                data.written_off = false;
                data.check_history = [];

                if (barcode_or_qr_code) {
                    let snapshot = await this.getDB().collection(this.tbl).where('barcode_or_qr_code', '==', barcode_or_qr_code).limit(1).get();
                    if (!snapshot.empty) {
                        return "CODE_DUP";
                    }
                }

                this.injectSavable(evt, loggedUser, data);
                const {user_id, company_id, created_at} = data;

                const {
                    site,
                    project,
                    client,
                    //2
                    profile_pic,
                    //4
                    doc_pdf,
                    //5
                    doc_work_manual, doc_procedure, doc_clearance_certificate,
                    //6
                    purchase_info = {}
                } = data;

                //2
                if (profile_pic) {
                    delete data.profile_pic;
                }
                //4
                if (doc_pdf) {
                    delete data.doc_pdf;
                }
                //5
                if (doc_work_manual) {
                    delete data.doc_work_manual;
                }
                if (doc_procedure) {
                    delete data.doc_procedure;
                }
                if (doc_clearance_certificate) {
                    delete data.doc_clearance_certificate;
                }

                //6
                let warranty_certificate;
                if (purchase_info.warranty_certificate) {
                    warranty_certificate = purchase_info.warranty_certificate;
                    delete purchase_info.warranty_certificate;
                }

                if (typeof site === 'string') {
                    delete data.site;
                    if (site !== 'All') {
                        const _data = {name: site, user_id, company_id, created_at};
                        const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                        const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                        data.site_id = site_doc_snapshot.id;
                    }
                } else if (site) {
                    data.site_id = site.id;
                }
                if (typeof project === 'string') {
                    delete data.project;
                    if (project !== 'All') {
                        const _data = {name: project, user_id, company_id, created_at};
                        const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                        const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                        data.project_id = project_doc_snapshot.id;
                    }
                } else if (project) {
                    data.project_id = project.id;
                }
                if (typeof client === 'string') {
                    delete data.client;
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        data.client_id = client_doc_snapshot.id;
                    }
                } else if (client) {
                    data.client_id = client.id;
                }

                data.keywords = this.generateKeywords([data.name, data.asset_type]);
                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                const updateAttrs = {};

                if (profile_pic) {
                    const gcsUri = await files.upload.call(this, profile_pic, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    updateAttrs.profile_pic = gcsUri;
                }

                //4
                if (doc_pdf) {
                    const gcsUri = await files.upload.call(this, doc_pdf, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/docs/doc_pdf.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    updateAttrs.doc_pdf = gcsUri;
                }
                //5
                if (doc_work_manual) {
                    const gcsUri = await files.upload.call(this, doc_work_manual, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/docs/doc_work_manual.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    updateAttrs.doc_work_manual = gcsUri;
                }
                if (doc_procedure) {
                    const gcsUri = await files.upload.call(this, doc_procedure, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/docs/doc_procedure.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    updateAttrs.doc_procedure = gcsUri;
                }
                if (doc_clearance_certificate) {
                    const gcsUri = await files.upload.call(this, doc_clearance_certificate, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/docs/doc_clearance_certificate.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    updateAttrs.doc_clearance_certificate = gcsUri;
                }

                //6
                if (warranty_certificate) {
                    const gcsUri = await files.upload.call(this, warranty_certificate, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/docs/purchase_info/warranty_certificate.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    purchase_info.warranty_certificate = gcsUri;
                    updateAttrs.purchase_info = purchase_info;
                }

                const updated = await doc_ref.update(updateAttrs);//Promise <void>

                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                let {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                const {user: {id: user_id}, company_id} = loggedUser;
                created_at = FBSettings.FieldValue.serverTimestamp();

                const {
                    site,
                    project,
                    client,
                    //1
                    name, asset_type,
                    //2
                    profile_pic,
                    //4
                    doc_pdf,
                    //5
                    doc_work_manual, doc_procedure, doc_clearance_certificate,
                    //6
                    purchase_info
                } = updateAttrs;

                if (typeof site === 'string') {
                    delete updateAttrs.site;
                    if (site !== 'All') {
                        const _data = {name: site, user_id, company_id, created_at};
                        const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                        const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        updateAttrs.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                        updateAttrs.site_id = site_doc_snapshot.id;
                    } else {
//                        updateAttrs.site = null;
                        updateAttrs.site_id = null;
                    }
                } else if (site) {
                    updateAttrs.site_id = site.id;
                }
                if (typeof project === 'string') {
                    delete updateAttrs.project;
                    if (project !== 'All') {
                        const _data = {name: project, user_id, company_id, created_at};
                        const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                        const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        updateAttrs.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                        updateAttrs.project_id = project_doc_snapshot.id;
                    } else {
//                        updateAttrs.project = null;
                        updateAttrs.project_id = null;
                    }
                } else if (project) {
                    updateAttrs.project_id = project.id;
                }
                if (typeof client === 'string') {
                    delete updateAttrs.client;
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        updateAttrs.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        updateAttrs.client_id = client_doc_snapshot.id;
                    } else {
//                        updateAttrs.client = null;
                        updateAttrs.client_id = null;
                    }
                } else if (client) {
                    updateAttrs.client_id = client.id;
                }

                if (name && asset_type) {
                    updateAttrs.keywords = this.generateKeywords([name, asset_type]);
                } else if (name && !asset_type) {
                    updateAttrs.keywords = this.generateKeywords([name, snapshot.get('asset_type')]);
                } else if (!name && asset_type) {
                    updateAttrs.keywords = this.generateKeywords([snapshot.get('name'), asset_type]);
                }

                if (profile_pic) {
                    const gcsUri = await files.upload.call(this, profile_pic, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.profile_pic = gcsUri;
                }

                //4
                if (doc_pdf) {
                    const gcsUri = await files.upload.call(this, doc_pdf, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/docs/doc_pdf.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.doc_pdf = gcsUri;
                }
                //5
                if (doc_work_manual) {
                    const gcsUri = await files.upload.call(this, doc_work_manual, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/docs/doc_work_manual.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.doc_work_manual = gcsUri;
                }
                if (doc_procedure) {
                    const gcsUri = await files.upload.call(this, doc_procedure, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/docs/doc_procedure.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.doc_procedure = gcsUri;
                }
                if (doc_clearance_certificate) {
                    const gcsUri = await files.upload.call(this, doc_clearance_certificate, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/docs/doc_clearance_certificate.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.doc_clearance_certificate = gcsUri;
                }

                //6
                if (purchase_info && purchase_info.warranty_certificate) {
                    const {warranty_certificate} = purchase_info;
                    const gcsUri = await files.upload.call(this, warranty_certificate, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/docs/purchase_info/warranty_certificate.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    purchase_info.warranty_certificate = gcsUri;
                    updateAttrs.purchase_info = purchase_info;
                }
                
                const updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >
                snapshot = await doc_ref.get();

                let data = snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

//                console.log('update', updated, data)
                return data;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {profile_pic, doc_pdf, doc_work_manual, doc_procedure, doc_clearance_certificate, purchase_info = {}}}) => {
                profile_pic && await files.remove(profile_pic);
                doc_pdf && await files.remove(doc_pdf);
                doc_work_manual && await files.remove(doc_work_manual);
                doc_procedure && await files.remove(doc_procedure);
                doc_clearance_certificate && await files.remove(doc_clearance_certificate);
                purchase_info.warranty_certificate && await files.remove(purchase_info.warranty_certificate);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},
                    
                    {header: 'Owning Company Name', key: 'Owning Company Name', width: 25},
                    {header: 'Asset Name', key: 'Asset Name', width: 25},
                    {header: 'Asset Type', key: 'Asset Type', width: 20},
                    {header: 'Description', key: 'Description', width: 35},
                    
                    {header: 'Manufacturer', key: 'Manufacturer', width: 20},
                    {header: 'Model', key: 'Model', width: 20},
                    {header: 'Registration No.', key: 'Registration No.', width: 20},
                    {header: 'Serial No.', key: 'Serial No.', width: 25},

                    {header: 'Location', key: 'Location', width: 30},
                    {header: 'Toolkit', key: 'Toolkit', width: 25},
                    {header: 'Condition', key: 'Condition', width: 20},
                    
                    {header: 'Barcode / QR Code', key: 'Barcode / QR Code', width: 25},
                    
                    {header: 'Notes', key: 'Notes', width: 35},
                        
                    {header: 'Asset Photo', key: 'Asset Photo', width: 25},
                    
                    {header: 'Responsible Person', key: 'Responsible Person', width: 25},
                    
                    {header: 'Document', key: 'Document', width: 35},
                    {header: 'Document Description', key: 'Document Description', width: 35},
                    {header: 'Document Expiry Date', key: 'Document Expiry Date', width: 25},
                    
                    {header: 'Work Manual Document', key: 'Work Manual Document', width: 35},
                    {header: 'Work Procedure Document', key: 'Work Procedure Document', width: 35},
                    {header: 'Clearance Certificate Document', key: 'Clearance Certificate Document', width: 35},
                    
                    {header: 'Date of Purchase', key: 'Date of Purchase', width: 25},
                    {header: 'Vendor', key: 'Vendor', width: 20},
                    {header: 'Asset Cost', key: 'Asset Cost', width: 20},
                    {header: 'Warranty Expiry Date', key: 'Warranty Expiry Date', width: 25},
                    {header: 'Purchase Reference No.', key: 'Purchase Reference No.', width: 25},
                    {header: 'Warranty Certificate', key: 'Warranty Certificate', width: 25},
                    
                    {header: 'Depreciation Method', key: 'Depreciation Method', width: 25},
                    {header: 'Asset Cost', key: 'Asset Cost', width: 20},
                    {header: 'Salvage Value', key: 'Salvage Value', width: 20},
                    {header: 'Depreciation Years', key: 'Depreciation Years', width: 20},
                    {header: 'Depreciation Percentage', key: 'Depreciation Percentage', width: 25},
                    {header: 'Partial Year Depreciation?', key: 'Partial Year Depreciation?', width: 25},
                    
                    {header: 'Next Service Hours/Kilometres', key: 'Next Service Hours/Kilometres', width: 30},
                    
                    {header: 'Calibration Interval', key: 'Calibration Interval', width: 25},                    
                    {header: 'Next Calibration Date', key: 'Next Calibration Date', width: 25}
                ];

                const rows = list.map(({id, data: {
                    created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                    client, project, site,
                    //1
                    owning_company, name, asset_type, desc,
                    manufacturer, model, reg_num, serial_num, 
                    location, toolkit, condition,
                    barcode_or_qr_code_type, barcode_or_qr_code, 
                    notes,
                    //2
                    profile_pic,
                    //3
                    responsible_person,
                    //4
                    doc_pdf, doc_pdf_desc, doc_pdf_expiry,
                    //5
                    doc_work_manual, doc_procedure, doc_clearance_certificate,
                    //6
                    purchase_info,
                    //7
                    depreciation,
                    //8
                    monitoring_plan_list,
                    //9
                    maintenance_plan,
                    //10
                    calibration_record
                }}) => {
                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),
                        
                        "Owning Company Name": owning_company,
                        "Asset Name": name,
                        "Asset Type": asset_type || "",
                        "Description": desc || "",
                        
                        Manufacturer: manufacturer,
                        "Model": model,
                        "Registration No.": reg_num,
                        "Serial No.": serial_num,
                        
                        "Location": location || "",
                        "Toolkit": toolkit || "",
                        "Condition": condition || "",
                        
                        "Barcode / QR Code": "",
                        
                        "Notes": notes || "",
                        
                        "Asset Photo": "",
                        
                        "Responsible Person": responsible_person ? (responsible_person.lname + ' ' + responsible_person.fname) : "",
                        
                        "Document": "",
                        "Document Description": doc_pdf_desc || "",
                        "Document Expiry Date": Dates.parse(doc_pdf_expiry),
                        
                        "Work Manual Document": "",
                        "Work Procedure Document": "",
                        "Clearance Certificate Document": ""
                    };

                    if (purchase_info) {
                        const {
                            acquisition_date, vendor, acquisition_value, warranty_expiry, reference_num, warranty_certificate
                        } = purchase_info;
                        if (acquisition_date) {
                            res["Date of Purchase"] = Dates.parse(acquisition_date);
                        }
                        if (vendor) {
                            res["Vendor"] = vendor;
                        }
                        if (acquisition_value) {
                            res["Asset Cost"] = acquisition_value;
                        }
                        if (warranty_expiry) {
                            res["Warranty Expiry Date"] = Dates.parse(warranty_expiry);
                        }
                        if (reference_num) {
                            res["Purchase Reference No."] = reference_num;
                        }
                        if (warranty_certificate) {
//                            res["Warranty Certificate"] = warranty_certificate;
                        }
                    }

                    if (depreciation) {
                        const {
                            depreciation_method, asset_cost, salvage_value, depreciation_years, depreciation_factor, partial_year_depreciation
                        } = depreciation;
                        if (depreciation_method) {
                            res["Depreciation Method"] = depreciation_method;
                        }
                        if (asset_cost) {
                            res["Asset Cost"] = asset_cost;
                        }
                        if (salvage_value) {
                            res["Salvage Value"] = salvage_value;
                        }
                        if (depreciation_years) {
                            res["Depreciation Years"] = depreciation_years;
                        }
                        if (depreciation_factor) {
                            res["Depreciation Percentage"] = depreciation_factor;
                        }
                        if (partial_year_depreciation) {
                            res["Partial Year Depreciation?"] = partial_year_depreciation ? "Yes" : "No";
                        }
                    }
                    
                    if(monitoring_plan_list) {
                        
                    }
                    if(maintenance_plan) {
                        const {list, next_service_hrs_or_km} = maintenance_plan;
                        res["Next Service Hours/Kilometres"] = next_service_hrs_or_km;
                    }
                    if(calibration_record) {
                        const {list, next_calibration_interval, next_calibration_date} = calibration_record;
                        res["Calibration Interval"] = next_calibration_interval;
                        res["Next Calibration Date"] = Dates.parse(next_calibration_date);
                    }
                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Asset-Docs", "Assets-Active", "Assets Data", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, searchText) {
            return await this.list(evt, {searchText});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
//                    q = q.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    const filter = createDbFilter(searchText);
                    return filter(q);
                });
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {asset_type = "", name, manufacturer, location, condition} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
//                    q = q.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (location) {
                        q = q.where('location', '==', location);
                    }
                    if (condition) {
                        q = q.where('condition', '==', condition);
                    }
                    if (name) {
                        q = q.where("keywords", "array-contains", name.toString());
                        return q;
                    } else {
                        const filter = createDbFilter(asset_type);
                        return filter(q);
                    }
                });
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {asset_type = "", client_id, project_id, site_id, isNew} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1}, q => {
//                    q = q.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
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
                    return q.where("keywords", "array-contains", asset_type);
                });
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "asset_type";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="createDbFilter">
    function createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText.toString());
        };
    }
    // </editor-fold>

    new Controller(events, db);
})();