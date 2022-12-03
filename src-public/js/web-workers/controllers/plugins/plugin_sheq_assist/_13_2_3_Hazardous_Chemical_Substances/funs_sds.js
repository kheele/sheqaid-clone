
class MSDSFuns {

    static createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    static async mapResults(item, includes = {}) {
        let {data, data: {
                product, hazchem_sheet,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        const promise = [];
        
        const {productInclude = true, hazchem_sheetInclude = true} = includes;
        
        if (product && productInclude) {
            promise.push(Events.get('plugin_sheq_assist/Hazardous_Chemical_Substances/chemical-inventory/').then(tbl => {
                return tbl.find_by_id.call(tbl, null, product.id, {sdsInclude: false});
            }).then(val => {
                item.data.product = val;
            }));
        }
        if (hazchem_sheet && hazchem_sheetInclude) {
//            find_by_id_from_path = (path, item, key, id) => {
//                return Events.get(path).then(tbl => {
//                    return tbl.find_by_id.call(tbl, null, id);
//                }).then(val => {
//                    item.data[key] = val;
//                });
//            };
//            promise.push(find_by_id_from_path('plugin_sheq_assist/Hazardous_Chemical_Substances/hazchem-sheet/', item, 'hazchem_sheet', hazchem_sheet.id));
            promise.push(Events.get('plugin_sheq_assist/Hazardous_Chemical_Substances/hazchem-sheet/').then(tbl => {
                return tbl.find_by_id.call(tbl, null, hazchem_sheet.id, {sdsInclude: false});
            }).then(val => {
                item.data.hazchem_sheet = val;
            }));
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

        return item;
    }

}