class UserFuns {

    static createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    static async getUserCompanyName() {
        const loggedUser = self.session.getLoggedUser();

        const {
            access_type,
            user: {
                data: {
                    client: my_client, project: my_project, site: my_site
                }
            },
            company: {
                data: {
                    consultant, no_projects, company_name
                }
            },
            client_id, project_id, site_id,
            contractor_id
        } = loggedUser;

        const isHasProjects = consultant || !no_projects;

        let companyName;
        if(isHasProjects) {
            if (my_client) {
                companyName = my_client.name || my_client.data.name;
            } else {
                if(client_id) {
                    const clients = await Events.get('plugin_sheq_assist/clients/');
                    const val = await clients.find_by_id.call(clients, null, client_id);
                    companyName = val && val.data.name;
                } else if(contractor_id) {
                    const contractors = await Events.get('plugin_sheq_assist/contractors/');
                    const contractor_val = await contractors.find_by_id.call(contractors, null, contractor_id);
                    if(contractor_val) {
                        const {data: {client_id}} = contractor_val;
                        const clients = await Events.get('plugin_sheq_assist/clients/');
                        const val = await clients.find_by_id.call(clients, null, client_id);
                        companyName = val && val.data.name;
                    }
                }
            }
        } else {
            companyName = company_name;
        }
        return companyName;
    }

    static async mapResults(item) {
        let {
            data: {
                client, project, site, client_id, project_id, site_id,
                client_blacklist,
                project_blacklist,
                site_blacklist,
            }
        } = item;

        delete item.data.password;

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

        if(client_blacklist) {
            const clients = await Events.get('plugin_sheq_assist/clients/');
            item.data.client_blacklist = await Promise.all(client_blacklist.map(async val => {
                return clients.find_by_id.call(clients, null, val.id || val);
            }));
        }
        if(project_blacklist) {
            const projects = await Events.get('plugin_sheq_assist/projects/');
            item.data.project_blacklist = await Promise.all(project_blacklist.map(async val => {
                return projects.find_by_id.call(projects, null, val.id || val);
            }));
        }
        if(site_blacklist) {
            const sites = await Events.get('plugin_sheq_assist/sites/');
            item.data.site_blacklist = await Promise.all(site_blacklist.map(async val => {
                return sites.find_by_id.call(sites, null, val.id || val);
            }));
        }

        await Promise.all(promise);
        return item;
    }

}