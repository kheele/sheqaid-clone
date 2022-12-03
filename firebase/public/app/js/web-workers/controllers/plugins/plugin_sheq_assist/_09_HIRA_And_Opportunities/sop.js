
(() => {
    class Controller extends AControllerAssist {
        //title, sec1
        constructor(events, db) {
            super(events, db, {singular: "Safe Operating Procedure", plural: "Safe Operating Procedures"}, "plugin_sheq_assist/09_HIRA_And_Opportunities/sop/", "plugin_sheq_assist_09_HIRA_And_Opportunities_sop");

            this.filter = this.filter.bind(this);
            this.list_locations = this.list_locations.bind(this);
            
            const {addAction, filter, list_locations} = this;
            
            addAction("list/filter", filter);
            addAction("location/list", list_locations);
        }

        async create(evt, data) {
            return this.createAndUploadIfFile(evt, data, "photo");
        }

        async update(evt, id, updateAttrs) {
            return await this.updateAndUploadIfFile(evt, id, updateAttrs, "photo");
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {photo}}) => {
                photo && await files.remove(photo);
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {created_at, title} = search_val;
                const q = [
                    {key: 'title', comp: 'LIKE', val: title},
                    {key: 'created_at', comp: '=', val: created_at}
                ];
                return this.filter_impl(evt, q);
            });
        }

        async list_locations(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);
                list = list.filter(({data: {location}}) => !!location).map(({data: {location}}) => location).distinct();
                return list;
            });
        }
    }

    new Controller(events, db);
})();