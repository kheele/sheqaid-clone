
class ContractorFuns {

    static createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    static async mapResults(item, isLoggedIn = true) {
        let {id, data: {client, project, client_id, project_id, site_list = []}} = item;

        delete item.data.password;

        if (site_list) {
            const sites = await Events.get('plugin_sheq_assist/sites/');
            item.data.site_list = await Promise.all(site_list.map(async site => {
                return sites.find_by_id.call(sites, null, site.id, isLoggedIn);
            }));
        }

        const questionnaires = await Events.get('plugin_sheq_assist/contractors/questionnaires/');
        item.data.questionnaire_list = await questionnaires.list_by_contractor_id.call(questionnaires, null, id);

//        if (!isLoggedIn) {
//            return item;
//        }

        const promise = [];
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id, isLoggedIn);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id, isLoggedIn);
            }).then(val => {
                item.data.project = val;
            }));
        }

        await Promise.all(promise);
//        console.log('mapResults', JSON.stringify(item.data.site_list))
        return item;
    }

}