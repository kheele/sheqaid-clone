
class ContractorUserFuns {

    static createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    static async mapResults(item) {
        let {data: {
                client, project, contractor
            }
        } = item;

        delete item.data.password;

        const promise = [];
        if ((client && isObject(client))) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client.id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project))) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project.id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((contractor && isObject(contractor))) {
            promise.push(Events.get('plugin_sheq_assist/contractors/').then(contractors => {
                return contractors.find_by_id.call(contractors, null, contractor.id);
            }).then(val => {
                item.data.contractor = val;
            }));
        }

        await Promise.all(promise);
        return item;
    }

}