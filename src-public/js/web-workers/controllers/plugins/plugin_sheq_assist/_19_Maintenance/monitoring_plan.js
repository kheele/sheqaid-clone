
(() => {
    class Controller extends AControllerAid {
        //equipment_type, equipment_name, equipment_id, service, fuel_usage, working_hrs_or_km
        constructor(events, db) {
            super(events, db, {singular: "Asset Monitoring Plan", plural: "Assets Monitoring Plans"}, "plugin_sheq_assist/19_Maintenance/monitoring-plan/");

            this.tbl = 'plugin_sheq_assist_19_Maintenance_tools';

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    //monitoring_plan_list
                    q = q.orderBy('monitoring_plan_list', "asc");//.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    
                    q = q.where('monitoring_plan_list', '!=', []);
                    
                    const filter = createDbFilter(searchText);
                    return filter(q);
                });
                return list;
            });
        }

        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {asset_type = "", name, manufacturer, location, condition} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    //monitoring_plan_list
                    q = q.orderBy('monitoring_plan_list', "asc").orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    
                    q = q.where('monitoring_plan_list', '!=', []);
                    
                    if (name) {
                        q = q.where("keywords", "array-contains", name);
                    }
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (location) {
                        q = q.where('location', '==', location);
                    }
                    if (condition) {
                        q = q.where('condition', '==', condition);
                    }
                    const filter = createDbFilter(asset_type);
                    return filter(q);
                });
                return list;
            });
        }
        
        sortBy() {
            return "asset_type";
        }
    }

    function createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    new Controller(events, db);
})();