const groupEmployeesByImpl = (docs, key, nextKey, groupEmployeesByFn) => {
    const group = docs.groupBy(({data: {[key]: id}}) => id);
    return Object.keys(group).map(id => {
        const list = group[id];
        const next_list = groupEmployeesByFn ? groupEmployeesByFn(list) : list;
        return {[key]: id, [nextKey]: next_list};
    });
};

exports.groupEmployeesByCompany = (docs) => groupEmployeesByImpl(docs, 'company_id', 'client_list', groupEmployeesByClient);
const groupEmployeesByClient = (docs) => groupEmployeesByImpl(docs, 'client_id', 'project_list', groupEmployeesByProject);
const groupEmployeesByProject = (docs) => groupEmployeesByImpl(docs, 'project_id', 'site_list', groupEmployeesBySite);
const groupEmployeesBySite = (docs) => groupEmployeesByImpl(docs, 'site_id', 'list');