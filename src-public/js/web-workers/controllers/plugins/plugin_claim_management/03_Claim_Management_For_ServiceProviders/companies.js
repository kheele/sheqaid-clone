
(function () {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events,
                    {singular: "COID Service Provider", plural: "COID Service Providers"},
                    "plugin_sheq_assist/COIDA_Management/coid-provider/companies/");

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, sender_company_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/coid-provider/companies/requests/');
                let list = await cntr.list.call(cntr, null, {limit: 1}, q => {
                    q = q.where('status', 'in', ['New', 'Accepted', 'Declined', 'ReceipientRemoved']);
                    q = q.where('sender_company_id', '==', sender_company_id);
                    return q;
                });

                list = await Promise.all(list.map(async v => {
                    const {id, data: {sender_company_id, receipient_coid_provider_id, status}} = v;

                    const cntr = await Events.get('admin/companies/billable/');
                    const company = await cntr.find_by_id.call(cntr, null, sender_company_id);

                    company.data.request = v;
                    return company;
                }));


                list = await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, evt, true)));
                return list[0];
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/coid-provider/companies/requests/');
                let list = await cntr.list.call(cntr, evt, opts, q => {
                    q = q.where('status', 'in', ['New', 'Accepted', 'Declined', 'ReceipientRemoved']);
                    return q;
                });

                list = await Promise.all(list.map(async v => {
                    const {id, data: {sender_company_id, receipient_coid_provider_id, status}} = v;

                    const cntr = await Events.get('admin/companies/billable/');
                    const company = await cntr.find_by_id.call(cntr, null, sender_company_id);

                    company.data.request = v;
                    return company;
                }));

                return await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, evt, true)));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = ''} = search_val;
                const cntr = await Events.get('plugin_sheq_assist/COIDA_Management/coid-provider/companies/requests/');
                const list = await cntr.list.call(cntr, null, null, q => {
                    q = q.where('status', 'in', ['New', 'Accepted', 'Declined', 'ReceipientRemoved']);
                    return q;
                });

                list = await Promise.all(list.map(async v => {
                    const {id, data: {sender_company_id, receipient_coid_provider_id, status}} = v;

                    const cntr = await Events.get('admin/companies/billable/');
                    const company = await cntr.find_by_id.call(cntr, null, sender_company_id);

                    company.data.request = v;
                    return company;
                }));

                return await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, evt, true)));
            });
        }
        // </editor-fold>
        
    }

    new Controller(events);

})();