
(() => {
    class Controller extends AControllerAid {

        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Asset", plural: "Assets"}, "plugin_sheq_assist/19_Maintenance/tools/", "plugin_sheq_assist_19_Maintenance_tools");
            this.checkout = this.checkout.bind(this);
            this.checkin = this.checkin.bind(this);
            this.write_off = this.write_off.bind(this);
            this.written_off_list = this.written_off_list.bind(this);
            this.filter_written_off = this.filter_written_off.bind(this);
            this.list_asset_manufacturers = this.list_asset_manufacturers.bind(this);
            this.list_asset_models = this.list_asset_models.bind(this);
            this.list_asset_locations = this.list_asset_locations.bind(this);
            this.list_asset_toolkits = this.list_asset_toolkits.bind(this);
            this.list_asset_conditions = this.list_asset_conditions.bind(this);
            this.list_asset_vendors = this.list_asset_vendors.bind(this);
            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);

            const {addAction, checkout, checkin, write_off, written_off_list, filter_written_off, list_asset_manufacturers, list_asset_models, list_asset_locations, list_asset_toolkits, list_asset_conditions, list_asset_vendors, search_by_name, filter} = this;
            addAction("checkout", checkout);
            addAction("checkin", checkin);
            addAction("write-off", write_off);
            addAction("written-off/list", written_off_list);
            addAction("written-off/list/filter", filter_written_off);
            addAction("manufacturers/list", list_asset_manufacturers);
            addAction("models/list", list_asset_models);
            addAction("locations/list", list_asset_locations);
            addAction("toolkits/list", list_asset_toolkits);
            addAction("conditions/list", list_asset_conditions);
            addAction("vendors/list", list_asset_vendors);
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
            
            addAction("select/filter", this.filter_select.bind(this));

            const fn = async () => {
                const doc_ref = await this.getDB().collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });

                await Promise.all(list.map(async (doc) => {
                    const doc_ref = await this.getDB().collection(this.tbl).doc(doc.id);
                    await doc_ref.set({written_off: false}, {merge: true});
                    console.log('assets', doc.id)
                }));
            };
//            fn();
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="importFile">
        async importFile(evt, path) {
            const validHeaderNames = [
                {key: 'name', value: ['Asset Name', 'Name'], required: true},
                {key: 'asset_type', value: ['Asset Type'], required: true},
                {key: 'desc', value: ['Description']},

                {key: 'manufacturer', value: ['Manufacturer']},
                {key: 'model', value: ['Model']},
                {key: 'reg_num', value: ['Registration No.']},
                {key: 'serial_num', value: ['Serial No.']},

                {key: 'location', value: ['Location']},
                {key: 'toolkit', value: ['Toolkit']},
                {key: 'condition', value: ['Condition']},

                {key: 'barcode_or_qr_code', value: ['Barcode / QR Code']},
                {key: 'notes', value: ['Notes']},

                {key: 'profile_pic', value: ['Asset Photo']},
                {key: 'responsible_person', value: ['Responsible Contractor/Employee']},

                {key: 'doc_pdf', value: ['Document']},
                {key: 'doc_pdf_desc', value: ['Document Description']},
                {key: 'doc_pdf_expiry', value: ['Document Expiry Date']},

                {key: 'doc_work_manual', value: ['Work Manual Document']},
                {key: 'doc_procedure', value: ['Work Procedure Document']},
                {key: 'doc_clearance_certificate', value: ['Clearance Certificate Document']},

                {key: 'acquisition_date', value: ['Date of Purchase', 'Purchase Date']},
                {key: 'vendor', value: ['Vendor']},
                {key: 'acquisition_value', value: ['Asset Cost']},
                {key: 'warranty_expiry', value: ['Warranty Expiry Date']},
                {key: 'reference_num', value: ['Purchase Reference No.']},
                {key: 'warranty_certificate', value: ['Warranty Certificate']},

                {key: 'depreciation_method', value: ['Depreciation Method']},
//                {key: 'asset_cost', value: ['Asset Cost']},
                {key: 'salvage_value', value: ['Salvage Value']},
                {key: 'depreciation_years', value: ['Depreciation Years']},
                {key: 'depreciation_factor', value: ['Depreciation Factor']},
                {key: 'partial_year_depreciation', value: ['Partial Year Depreciation']}
            ];
            const res = await excelUtils.read(path, validHeaderNames);
            if (res.errors)
                return res;

            res.sortBy('name');
            return res.distinct();
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="createImported">
        async createImported(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const barcode_or_qr_codes = list.filter(({barcode_or_qr_code}) => !!barcode_or_qr_code).map(({barcode_or_qr_code}) => barcode_or_qr_code);
                if (!barcode_or_qr_codes.isEmpty()) {
                    let snapshot = await this.getDB().collection(this.tbl).where('barcode_or_qr_code', 'in', barcode_or_qr_codes).get();
                    if (!snapshot.empty) {
                        let dups = [];
                        snapshot.forEach((doc) => {
                            dups.push(doc.data().barcode_or_qr_code);
                        });
                        dups = dups.map(barcode_or_qr_code => list.find(v => v.barcode_or_qr_code === barcode_or_qr_code));
                        return {dups};
                    }
                }

                return await Promise.all(list.map(async data => {
                    return await this.create(evt, data);
                }));
            });
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

        // <editor-fold defaultstate="collapsed" desc="checkout">
        async checkout(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const res = {};
                await Promise.all(data.list.map(async id => {
                    let _data = {tool_id: id, checked_to: data.employee, due_return_date: data.due_return_date, comments: data.comments};
                    _data.created_at = FBSettings.FieldValue.serverTimestamp();
                    let doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    const updated = await doc_ref.update({status: 'Checked Out'});//Promise < void >
                    doc_ref = await doc_ref.collection('register_list').add(_data);//Promise < DocumentReference < T > >
                    let doc_snapshot = await doc_ref.get();
                    _data = doc_snapshot.data();
                    const {created_at} = _data;
                    if (created_at && created_at.toDate) {
                        _data.created_at = created_at.toDate();
                    }
                    res[id] = {id: doc_snapshot.id, data: _data};
                    return null;
                }));

                console.log('checkout', res)
                return res;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="checkin">
        async checkin(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const res = {};
                await Promise.all(data.list.map(async id => {
                    let _data = {tool_id: id, status: data.status, condition: data.condition, location: data.location, comments: data.comments};
                    _data.created_at = FBSettings.FieldValue.serverTimestamp();
                    let doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    const updated = await doc_ref.update({status: data.status});//Promise < void >
                    doc_ref = await doc_ref.collection('register_list').add(_data);//Promise < DocumentReference < T > >
                    let doc_snapshot = await doc_ref.get();
                    _data = doc_snapshot.data();
                    const {created_at} = _data;
                    if (created_at && created_at.toDate) {
                        _data.created_at = created_at.toDate();
                    }
                    res[id] = {id: doc_snapshot.id, data: _data};
                    return null;
                }));

                console.log('checkin', res)
                return res;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="write_off">
        async write_off(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const res = {};
                await Promise.all(data.list.map(async id => {
                    let _data = {store_keeper_signature: data.store_keeper_signature, manager_signature: data.manager_signature, comments: data.comments};
                    _data.created_at = FBSettings.FieldValue.serverTimestamp();
                    let doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    const updated = await doc_ref.update({written_off: true});//Promise < void >
                    doc_ref = await doc_ref.collection('written_off_list').add(_data);//Promise < DocumentReference < T > >
                    let doc_snapshot = await doc_ref.get();
                    _data = doc_snapshot.data();
                    const {created_at} = _data;
                    if (created_at && created_at.toDate) {
                        _data.created_at = created_at.toDate();
                    }
                    res[id] = {id: doc_snapshot.id, data: _data};
                    return null;
                }));

                console.log('write_off', res)
                return res;
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

        // <editor-fold defaultstate="collapsed" desc="written_off_list">
        async written_off_list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
//                    q = q.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', true);
                    const filter = createDbFilter(searchText);
                    return filter(q);
                });
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_asset_manufacturers">
        async list_asset_manufacturers(evt) {
            return list_by_assets.call(this, evt, 'manufacturer');
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_asset_models, list_asset_locations, list_asset_toolkits, list_asset_conditions, list_asset_vendors">
        async list_asset_models(evt) {
            return list_by_assets.call(this, evt, 'model');
        }
        async list_asset_locations(evt) {
            return list_by_assets.call(this, evt, 'location');
        }
        async list_asset_toolkits(evt) {
            return list_by_assets.call(this, evt, 'toolkit');
        }
        async list_asset_conditions(evt) {
            return list_by_assets.call(this, evt, 'condition');
        }
        async list_asset_vendors(evt) {
            return list_by_assets.call(this, evt, 'vendor');
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
                        q = q.where("keywords", "array-contains", name.toLowerCase());
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

        // <editor-fold defaultstate="collapsed" desc="filter_written_off">
        async filter_written_off(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {asset_type = "", name, manufacturer, location, condition} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
//                    q = q.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', true);
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
                        q = q.where("keywords", "array-contains", name.toLowerCase());
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
            return q.where("keywords", "array-contains", searchText.toLowerCase());
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="list_by_assets">
    function list_by_assets(evt, key) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerRead.prototype.listImpl.call(this, evt, {sort: key, limit: -1}, q => {
                q = q.where(key, '!=', null);
                return q;
            });
            return list.map(val => {
                return val.data[key];
            }).distinct();
        });
    }
    // </editor-fold>

    new Controller(events);
})();