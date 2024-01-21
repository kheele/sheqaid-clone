
const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("audits/findById", findByIdImpl);

eventManager.on("audits/listByLogged", listImpl=> {
    const {asset_id} = data;

    data.client_filter = [`schedule_date: {_eq: "${Dates.formatDateSQL(new Date())}"}`];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("audits/dashboard", findByIdDashboardImpl);
