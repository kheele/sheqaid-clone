
(() => {
    class Controller extends AControllerAssist {
        //equipment_type, equipment_name, equipment_id, service_date, service_hrs_or_km, next_service_hrs_or_km, reason_for_service
        constructor(events, db) {
            super(events, db, {singular: "Asset Maintanance Plan", plural: "Assets Maintanance Plans"}, "plugin_sheq_assist/19_Maintenance/maintanance-plan/");

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
                    //maintenance_plan
                    q = q.orderBy('maintenance_plan.list', "asc");//.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    
                    q = q.where('maintenance_plan.list', '!=', []);
                    
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
                    //maintenance_plan
                    q = q.orderBy('maintenance_plan.list', "asc").orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    
                    q = q.where('maintenance_plan.list', '!=', []);
                    
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