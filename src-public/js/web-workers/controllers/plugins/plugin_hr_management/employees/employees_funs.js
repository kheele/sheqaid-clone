class EmployeeFuns {

    //<editor-fold desc="createDbFilter">
    static createDbFilter(searchText) {
        return q => {
//            if (this.collectionGroup) {
//                const key = this.collectionGroup;// + '.*.expiry_date';
//                q = q.orderBy(key, "asc");
//                q = q.where(key, '!=', null);
//            }
            return searchText ? q.where("keywords", "array-contains", searchText) : q;
        };
    }

    //</editor-fold>

    //<editor-fold desc="mapResults">
    static async mapResults(item, actions) {
        let {
            id,
            data: {
                optional_info,
                docs,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        delete item.data.password;

        const promise = [];
        if (actions && isArray(actions)) {
            promise.push(...actions.map(({path, fn, key, args}) => {
                promise.push(Events.get(path).then(cntr => {
                    return cntr[fn].call(cntr, null, ...args);
                }).then(val => {
                    item.data[key] = val;
                }));
            }));
        }

        if (docs) {
            promise.push(Promise.all(Object.keys(docs).map(async key => {
                const {ids} = docs[key];
                const list = await Events.getByCollectionGroup(key).then(cntr => {
                    // console.log('cntr', key, ids)
                    return cntr.find_by_ids.call(cntr, null, ids);
                });

                docs[key].list = list;
                console.log(key, list.length)
            })));
        }
        promise.push(new Promise(async (resolve, reject) => {
            const query_ref = await this.getDB().collection('plugin_sheq_assist_trainings_certificates').where('employee.id', '==', id);
            const query_snapshot = await query_ref.get();
            const list = [];
            query_snapshot.forEach((doc) => {
                list.push({id: doc.id, data: doc.data()});
            });
            item.data.training_certificate_list = list;
            resolve();
        }));
//        promise.push(new Promise(async (resolve, reject) => {
//            const query_ref = await this.getDB().collection('plugin_sheq_assist_trainings_certificates').where('employee.id', '==', id);
//            const query_snapshot = await query_ref.get();
//            const list = [];
//            query_snapshot.forEach((doc) => {
//                list.push({id: doc.id, data: doc.data()});
//            });
//            item.data.training_certificate_list = list;
//            resolve();
//        }));
        if (optional_info) {
            const {department, job_position} = optional_info;
            if (department && !department.data) {
                promise.push(Events.get('plugin_sheq_assist/employees/departments/').then(departments => {
                    if (department.id) {
                        return departments.find_by_id.call(departments, null, department.id);
                    } else if (isString(department)) {
                        return departments.search_by_name.call(departments, null, department);
                    }
                }).then(val => {
                    if (val) {
                        if (isArray(val)) {
                            optional_info.department = val[0];
                        } else if (isObject(val)) {
                            optional_info.department = val;
                        }
                    }
                }));
            }
            if (job_position && !job_position.data) {
                promise.push(Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions => {
                    if (job_position.id) {
                        return job_positions.find_by_id.call(job_positions, null, job_position.id);
                    } else if (isString(job_position)) {
                        return job_positions.search_by_name.call(job_positions, null, job_position);
                    }
                }).then(val => {
                    if (val) {
                        if (isArray(val)) {
                            optional_info.job_position = val[0];
                        } else if (isObject(val)) {
                            optional_info.job_position = val;
                        }
                    }
                }));
            }
        }
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }

    //</editor-fold>

}