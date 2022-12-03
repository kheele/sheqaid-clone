
(() => {
    class Controller extends AControllerAssist {
        //title, sec1
        constructor(events, db) {
            super(events, db, {singular: "Written Safe Work Procedure", plural: "Written Safe Work Procedures"}, "plugin_sheq_assist/09_HIRA_And_Opportunities/swp/", "plugin_sheq_assist_09_HIRA_And_Opportunities_swp");

            this.filter = this.filter.bind(this);
            this.list_categories = this.list_categories.bind(this);
            this.list_locations = this.list_locations.bind(this);
            const {addAction, filter, list_categories, list_locations} = this;
            
            addAction("list/filter", filter);
            addAction("category/list", list_categories);
            addAction("location/list", list_locations);
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                const {user_id, company_id, created_at} = data;
                
                const {department} = data;
                if (department && typeof department === 'string') {
                    const _data = {name: department, user_id, company_id, created_at};
                    const department_doc_ref = await this.getDB().collection('plugin_sheq_assist_departments').add(_data);//Promise < DocumentReference < T > >
                    const department_doc_snapshot = await department_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.department = {id: department_doc_snapshot.id, name: department_doc_snapshot.data().name};
                }
                return this.createAndUploadIfFile(evt, data, "photo");
            });
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

        async list_categories(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);
                list = list.filter(({data: {category}}) => !!category).map(({data: {category}}) => category).distinct();
                return list;
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