
class IncidentFuns {

    static async updateEmployee(item) {
        const {
            id,
            data: {
                investigation,
                sec5_data,
                sec6_data,
                sec7_data,
                sec8_data,
                sec11_data,
                sec13_data,
                sec15_data
            }
        } = item;
        if (investigation ||
                (sec5_data && sec5_data.person_involved_list) ||
                (sec6_data && sec6_data.person_reporting) ||
                (sec7_data && sec7_data.person_reported_to) ||
                (sec8_data && sec8_data.witness_list) ||
                (sec11_data && sec11_data.person_injured) ||
                (sec13_data && sec13_data.driver) ||
                (sec15_data && sec15_data.distribution_list)
                ) {
            const employees_ctrl = await Events.get('plugin_sheq_assist/employees/');

            const updateEmployeeImpl = async (employee, key) => {
                const employee_ref = await db_hr.collection(TBL_EMPLOYEES).doc(employee.id);
                const updated = await employee_ref.set({
                    incident_list: {
                        [key]: FBSettings.FieldValue.arrayUnion(item.id)
                    }
                }, {merge: true});//Promise < void >
            };

            if (investigation) {
                if (investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
                    await Promise.all(investigation.sec1_data.investigation_team_list.filter(v => !!v.id).map(async v => {
                        const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                        await updateEmployeeImpl(employee, 'investigation_team_list');
                    }));
                }
                if (investigation.sec5_data && investigation.sec5_data.corrective_actions) {
                    await Promise.all(investigation.sec5_data.corrective_actions.filter(v => !!v.id).map(async v => {
                        const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                        await updateEmployeeImpl(employee, 'corrective_action_list');
                    }));
                }
            }
            if (sec5_data && sec5_data.person_involved_list) {
                await Promise.all(sec5_data.person_involved_list.filter(v => !!v.id).map(async v => {
                    const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                    await updateEmployeeImpl(employee, 'person_involved_list');
                }));
            }
            if (sec6_data && sec6_data.person_reporting) {
                const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, sec6_data.person_reporting.id);
                await updateEmployeeImpl(employee, 'person_reporting');
            }
            if (sec7_data && sec7_data.person_reported_to) {
                const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, sec7_data.person_reported_to.id);
                await updateEmployeeImpl(employee, 'person_reported_to');
            }
            if (sec8_data && sec8_data.witness_list) {
                await Promise.all(sec8_data.witness_list.filter(v => !!v.id).map(async v => {
                    const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                    await updateEmployeeImpl(employee, 'witness_list');
                }));
            }
            if (sec11_data && sec11_data.person_injured) {
                const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, sec11_data.person_injured.id);
                await updateEmployeeImpl(employee, 'person_injured');
            }
            if (sec13_data && sec13_data.driver) {
                const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, sec13_data && sec13_data.driver.id);
                await updateEmployeeImpl(employee, 'driver');
            }
            const distribution_list = (investigation && investigation.sec6_data && investigation.sec6_data.distribution_list) ||
                    (sec15_data && sec15_data.distribution_list);
            if (distribution_list) {
                await Promise.all(distribution_list.filter(v => !!v.id).map(async v => {
                    const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                    await updateEmployeeImpl(employee, 'distribution_list');
                }));
            }
        }
    }

    static async mapResults(item) {
        let {
            id,
            data: {
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        const promise = [];
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

}

class ManHoursFuns {

    static async mapResults(item) {
        let {
            id,
            data: {
                client, project, site, client_id, project_id, site_id,
                incident_list = []
            }
        } = item;

        const promise = [];

        promise.push(Promise.all((incident_list || []).map(async id => {
            return Events.get('plugin_sheq_assist/17_Incident_Investigation/').then(cntr => {
                return cntr.find_by_id.call(cntr, null, id);
            });
        })).then(val => {
            item.data.incident_list = val;
        }));
        
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

}