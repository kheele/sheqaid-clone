
(() => {
    class Controller extends AControllerAid {
        //equipment_name, equipment_id, maintanace_type, reference_standard, certificate_num, company_calibrating, calibration_date, next_calibration_date
        constructor(events, db) {
            super(events, db, {singular: "Asset Calibration Record", plural: "Assets Calibration Records"}, "plugin_sheq_assist/19_Maintenance/calibration-record/");

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
                    //calibration_record
                    q = q.orderBy('calibration_record.list', "asc");//.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    
                    q = q.where('calibration_record.list', '!=', []);
                    
                    const filter = createDbFilter(searchText);
                    return filter(q);
                });
                return list;
            });
        }

        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {asset_type = "", name, manufacturer, location, condition, maintanace_type} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    //calibration_record
                    q = q.orderBy('calibration_record.list', "asc");//.orderBy('written_off', "asc");
                    q = q.where('written_off', '==', false);
                    
                    q = q.where('calibration_record.list', '!=', []);
                    
                    if (name) {
                        q = q.where("keywords", "array-contains", name);
                    }
                    if (maintanace_type) {
                        q = q.where('maintanace_type', '==', maintanace_type);
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