(() => {
    class Controller extends AControllerAid {

        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {
                singular: "Asset", plural: "Assets"
            }, "plugin_sheq_assist/19_Maintenance/parts/", "plugin_sheq_assist_19_Maintenance_parts");

            const {addAction} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));

            addAction("select/filter", this.filter_select.bind(this));
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                const {user_id, company_id, created_at} = data;

                let {
                    site,
                    project,
                    client,
                    //1. Part Details
                    name, asset, asset_type, part_photo,

                    //2. Order Request
                    order_requests_list = [],
                    // requested_by,
                    // date_requested,
                    // request_reason,
                    // measurement_unit,
                    // qty_requested,

                    //3. Request Approval
                    order_approved_list = [],
                    //3.1. Manager Approval
                    // approving_manager,
                    // approving_manager_date,
                    //3.2. Finance Approval
                    // approving_finance,
                    // approving_finance_date,

                    //4. Order Details
                    order_ordered_list = [],
                    // qty_ordered,
                    // date_ordered,

                    //5. Orders Received
                    order_received_list = []
                } = data;

                if(order_requests_list) {
                    order_requests_list = order_requests_list.map(v => ({
                        status: "AwaitingApproval", ...v,
                    }));
                }

                //1
                if (part_photo) {
                    delete data.part_photo;
                }
                //5
                const orderHasFile = order_received_list && order_received_list.anyMatch(v => v.photo);
                if (orderHasFile) {
                    delete data.order_received_list;
                }

                data.keywords = this.generateKeywords([name, asset_type]);
                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                const updateAttrs = {};

                //1
                if (part_photo) {
                    const gcsUri = await files.upload.call(this, part_photo, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/part_photo.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.part_photo = gcsUri;
                }

                //5
                if (orderHasFile) {
                    updateAttrs.order_received_list = await Promise.all(order_received_list.map(async (v, n) => {
                        if (!v.photo) {
                            return v;
                        }
                        const gcsUri = await files.upload.call(this, v.photo, async function (bucketFile) {
                            const new_name = this.tbl + '/' + doc_snapshot.id + '/order_received_list/photo.' + fileUtils.getExtension(bucketFile.name);
                            return new_name;
                        }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                            throw e;
                        });
                        v.photo = gcsUri;
                        return v;
                    }));
                }

                const updated = await doc_ref.update(updateAttrs);//Promise <void>

                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                const renderOrderRequest = ({
                                                requested_by,
                                                date_requested,
                                                request_reason,
                                                measurement_unit,
                                                qty_requested
                                            }, n) => {
                    return '<p>Date Requested: <b>' + (Dates.formatDate(date_requested) || 'N/A') + '</b></p>\n\
                            <p>Measurement Unit: <b>' + measurement_unit + '</b></p>\n\
                            <p>Quantity Requested: <b>' + qty_requested + '</b></p>\n\
                            <p>Reason For Request: <b>' + (request_reason || 'N/A') + '</b></p>\n\
                            <p>Requested By: <b>' + (requested_by ? ((requested_by.fname || requested_by.data.fname) + ' ' + (requested_by.lname || requested_by.data.lname)) : 'N/A') + '</b></p>\n'
                };

                const location = "";

                if (order_approved_list && order_approved_list.anyMatch(({approving_manager, approving_finance}) => (approving_manager && approving_manager.email) || (approving_finance && approving_finance.email))) {
                    await Promise.all(order_approved_list.
                    filter(({approving_manager, approving_finance}) => (approving_manager && approving_manager.email) || (approving_finance && approving_finance.email)).
                    map(async ({approving_manager, approving_finance}) => {
                        const send = async ({fname, lname, email}) => {
                            const opts = {
                                from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                                to: email,
                                subject: 'Asset Parts Approval Request',
                                html: '<p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>\n\
                            <h3>Hi ' + (fname + ' ' + lname) + '</h3>\n\
                            <p>You have been requested to approve the following Asset Part:</p>\n\
                            <p>Location (Company/Project/Site): <b>' + location + '</b></p>\n\
                            <p>Part ID: <b>' + auditData.id + '</b></p>\n\
                            <p>Part Name: <b>' + name + '</b></p>\n\
                            <p>Asset: <b>' + (asset && asset.name || "N/A") + '</b></p>\n\
                            <p>Asset Type: <b>' + (asset_type || 'N/A') + '</b></p>\n\
                            <p>Part Photo: <b>' + (part_photo) + '</b></p>\n' + order_requests_list.map(renderOrderRequest) + '<p>Kind Regards<br/>SHEQ Aid</p>'
                            };

                            await Utils.sendEmail(opts);
                        };

                        const promises = [];
                        if(approving_manager && approving_manager.email) {
                            const {fname, lname, email} = approving_manager;
                            promises.push(send({fname, lname, email}));
                        }
                        if(approving_finance && approving_finance.email) {
                            const {fname, lname, email} = approving_finance;
                            promises.push(send({fname, lname, email}));
                        }

                        await Promise.all(promises);
                    }));
                }

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
                    //1. Part Details
                    name, asset, asset_type, part_photo,

                    //2. Order Request
                    requested_by, date_requested, request_reason, measurement_unit, qty_requested,

                    //3. Request Approval
                    //3.1. Manager Approval
                    approving_manager, approving_manager_date, //3.2. Finance Approval
                    approving_finance, approving_finance_date,

                    //4. Order Details
                    qty_ordered, date_ordered,

                    //5. Orders Received
                    order_received_list = []
                } = updateAttrs;

                //1
                if (part_photo) {
                    delete updateAttrs.part_photo;
                }
                //5
                const orderHasFile = order_received_list && order_received_list.anyMatch(v => v.photo);
                if (orderHasFile) {
                    delete updateAttrs.order_received_list;
                }

                if (name && asset_type) {
                    updateAttrs.keywords = this.generateKeywords([name, asset_type]);
                } else if (name && !asset_type) {
                    updateAttrs.keywords = this.generateKeywords([name, snapshot.get('asset_type')]);
                } else if (!name && asset_type) {
                    updateAttrs.keywords = this.generateKeywords([snapshot.get('name'), asset_type]);
                }

                //1
                if (part_photo) {
                    const gcsUri = await files.upload.call(this, part_photo, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/part_photo.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.part_photo = gcsUri;
                }

                //5
                if (orderHasFile) {
                    updateAttrs.order_received_list = await Promise.all(order_received_list.map(async (v, n) => {
                        if (!v.photo) {
                            return v;
                        }
                        const gcsUri = await files.upload.call(this, v.photo, async function (bucketFile) {
                            const new_name = this.tbl + '/' + snapshot.id + '/order_received_list/photo.' + fileUtils.getExtension(bucketFile.name);
                            return new_name;
                        }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                            throw e;
                        });
                        v.photo = gcsUri;
                        return v;
                    }));
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
            return this.removeWithFile(evt, id, async ({data: {part_photo, order_received_list = []}}) => {
                part_photo && await files.remove(part_photo);

                const orderHasFile = order_received_list && order_received_list.anyMatch(v => v.photo);
                if (orderHasFile) {
                    await Promise.all(order_received_list.map(async (v, n) => {
                        if (!v.photo) {
                            return;
                        }
                        await files.remove(v.photo);
                    }));
                }
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [{header: 'Company', key: 'Company', width: 25}, {
                    header: 'Project',
                    key: 'Project',
                    width: 25
                }, {header: 'Site', key: 'Site', width: 25},

                    {header: 'Owning Company Name', key: 'Owning Company Name', width: 25}, {
                        header: 'Asset Name',
                        key: 'Asset Name',
                        width: 25
                    }, {header: 'Asset Type', key: 'Asset Type', width: 20}, {
                        header: 'Description',
                        key: 'Description',
                        width: 35
                    },

                    {header: 'Manufacturer', key: 'Manufacturer', width: 20}, {
                        header: 'Model',
                        key: 'Model',
                        width: 20
                    }, {header: 'Registration No.', key: 'Registration No.', width: 20}, {
                        header: 'Serial No.',
                        key: 'Serial No.',
                        width: 25
                    },

                    {header: 'Location', key: 'Location', width: 30}, {
                        header: 'Toolkit',
                        key: 'Toolkit',
                        width: 25
                    }, {header: 'Condition', key: 'Condition', width: 20},

                    {header: 'Barcode / QR Code', key: 'Barcode / QR Code', width: 25},

                    {header: 'Notes', key: 'Notes', width: 35},

                    {header: 'Asset Photo', key: 'Asset Photo', width: 25},

                    {header: 'Responsible Person', key: 'Responsible Person', width: 25},

                    {header: 'Document', key: 'Document', width: 35}, {
                        header: 'Document Description',
                        key: 'Document Description',
                        width: 35
                    }, {header: 'Document Expiry Date', key: 'Document Expiry Date', width: 25},

                    {
                        header: 'Work Manual Document',
                        key: 'Work Manual Document',
                        width: 35
                    }, {
                        header: 'Work Procedure Document',
                        key: 'Work Procedure Document',
                        width: 35
                    }, {header: 'Clearance Certificate Document', key: 'Clearance Certificate Document', width: 35},

                    {header: 'Date of Purchase', key: 'Date of Purchase', width: 25}, {
                        header: 'Vendor',
                        key: 'Vendor',
                        width: 20
                    }, {header: 'Asset Cost', key: 'Asset Cost', width: 20}, {
                        header: 'Warranty Expiry Date',
                        key: 'Warranty Expiry Date',
                        width: 25
                    }, {
                        header: 'Purchase Reference No.',
                        key: 'Purchase Reference No.',
                        width: 25
                    }, {header: 'Warranty Certificate', key: 'Warranty Certificate', width: 25},

                    {header: 'Depreciation Method', key: 'Depreciation Method', width: 25}, {
                        header: 'Asset Cost',
                        key: 'Asset Cost',
                        width: 20
                    }, {header: 'Salvage Value', key: 'Salvage Value', width: 20}, {
                        header: 'Depreciation Years',
                        key: 'Depreciation Years',
                        width: 20
                    }, {
                        header: 'Depreciation Percentage',
                        key: 'Depreciation Percentage',
                        width: 25
                    }, {header: 'Partial Year Depreciation?', key: 'Partial Year Depreciation?', width: 25},

                    {header: 'Next Service Hours/Kilometres', key: 'Next Service Hours/Kilometres', width: 30},

                    {
                        header: 'Calibration Interval',
                        key: 'Calibration Interval',
                        width: 25
                    }, {header: 'Next Calibration Date', key: 'Next Calibration Date', width: 25}];

                const rows = list.map(({
                                           id, data: {
                        created_at,
                        status/*In Storage | Checked Out | Loaned Out | Out For Repair*/,
                        statusVal,
                        client,
                        project,
                        site, //1
                        owning_company,
                        name,
                        asset_type,
                        desc,
                        manufacturer,
                        model,
                        reg_num,
                        serial_num,
                        location,
                        toolkit,
                        condition,
                        barcode_or_qr_code_type,
                        barcode_or_qr_code,
                        notes, //2
                        profile_pic, //3
                        responsible_person, //4
                        doc_pdf,
                        doc_pdf_desc,
                        doc_pdf_expiry, //5
                        doc_work_manual,
                        doc_procedure,
                        doc_clearance_certificate, //6
                        purchase_info, //7
                        depreciation, //8
                        monitoring_plan_list, //9
                        maintenance_plan, //10
                        calibration_record
                    }
                                       }) => {
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
                            acquisition_date,
                            vendor,
                            acquisition_value,
                            warranty_expiry,
                            reference_num,
                            warranty_certificate
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
                            depreciation_method,
                            asset_cost,
                            salvage_value,
                            depreciation_years,
                            depreciation_factor,
                            partial_year_depreciation
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

                    if (monitoring_plan_list) {

                    }
                    if (maintenance_plan) {
                        const {list, next_service_hrs_or_km} = maintenance_plan;
                        res["Next Service Hours/Kilometres"] = next_service_hrs_or_km;
                    }
                    if (calibration_record) {
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
                const {
                    asset_type = "", name = '', asset, //
                    requested_by, approving_manager, approving_finance, //
                    date_requested, approving_manager_date, approving_finance_date, date_ordered, //
                    order_received
                } = filterData;

                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (asset) {
                        q = q.where('asset', '==', asset);
                    }
                    //
                    if (requested_by) {
                        q = q.where('requested_by.id', '==', requested_by);
                    }
                    if (approving_manager) {
                        q = q.where('approving_manager.id', '==', approving_manager);
                    }
                    if (approving_finance) {
                        q = q.where('approving_finance.id', '==', approving_finance);
                    }
                    //
                    if (date_requested) {
                        q = q.where('date_requested', '==', date_requested);
                    }
                    if (approving_manager_date) {
                        q = q.where('approving_manager_date', '==', approving_manager_date);
                    }
                    if (approving_finance_date) {
                        q = q.where('approving_finance_date', '==', approving_finance_date);
                    }
                    if (date_ordered) {
                        q = q.where('date_ordered', '==', date_ordered);
                    }
                    if (order_received) {
                        q = q.orderBy('order_received_list', "asc");
                    }
                    //
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
                const {
                    asset_type = "", name = '', asset, //
                    requested_by, approving_manager, approving_finance, //
                    date_requested, approving_manager_date, approving_finance_date, date_ordered, //
                    order_received, //
                    client_id, project_id, site_id, //
                    isNew
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
                    if (asset) {
                        q = q.where('asset', '==', asset);
                    }
                    //
                    if (requested_by) {
                        q = q.where('requested_by.id', '==', requested_by);
                    }
                    if (approving_manager) {
                        q = q.where('approving_manager.id', '==', approving_manager);
                    }
                    if (approving_finance) {
                        q = q.where('approving_finance.id', '==', approving_finance);
                    }
                    //
                    if (date_requested) {
                        q = q.where('date_requested', '==', date_requested);
                    }
                    if (approving_manager_date) {
                        q = q.where('approving_manager_date', '==', approving_manager_date);
                    }
                    if (approving_finance_date) {
                        q = q.where('approving_finance_date', '==', approving_finance_date);
                    }
                    if (date_ordered) {
                        q = q.where('date_ordered', '==', date_ordered);
                    }
                    if (order_received) {
                        q = q.orderBy('order_received_list', "asc");
                    }
                    //
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

        sortBy() {
            return "name";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="createDbFilter">
    function createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText.toLowerCase());
        };
    }

    // </editor-fold>

    new Controller(events, db);
})();