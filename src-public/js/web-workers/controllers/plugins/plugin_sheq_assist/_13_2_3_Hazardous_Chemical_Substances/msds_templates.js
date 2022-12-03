
(() => {
    class Controller extends AControllerAid {
        //name, desc, questions, contractor
        constructor(events, db) {
            super(events, db, {singular: "MSDS Template", plural: "MSDS Templates"}, "plugin_sheq_assist/Hazardous_Chemical_Substances/msds/templates/", "Hazardous_Chemical_Substances_msds_templates");

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));

            this.setQueryWhere(company_id => {
                return ['ALL'];
            });
        }

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            data.keywords = this.generateKeywords([data.name]);
            const item = await this.createAndUploadHasFile(evt, data, "doc");
            return MSDSFuns.mapResults(item);
        }
        // </editor-fold>
		
        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            if (updateAttrs.name) {
                updateAttrs.keywords = this.generateKeywords([updateAttrs.name]);
            }
            const updatedData = await this.updateAndUploadHasFile(evt, id, updateAttrs, "doc");
            let updatedItem = {id, data: updatedData};
            updatedItem = await MSDSFuns.mapResults(updatedItem);

            return updatedItem.data;
        }
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    const filter = MSDSFuns.createDbFilter(searchText);
                    return filter(q);
                });
                list = await Promise.all(list.map(MSDSFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", category, manufacturer, risk_level, visibility} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (category) {
                        q = q.where('category', '==', category);
                    }
                    if (manufacturer) {
                        q = q.where('manufacturer', '==', manufacturer);
                    }
                    if (risk_level) {
                        q = q.where('risk_level', '==', risk_level);
                    }
                    if (visibility) {
                        q = q.where('visibility', '==', visibility);
                    }
                    const filter = MSDSFuns.createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(MSDSFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>
        
        sortBy() {
            return "name";
        }
    }

    new Controller(events, db);
})();