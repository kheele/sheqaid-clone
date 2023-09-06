
(() => {
    class Controller extends AControllerAid {
        /* */
        constructor(events) {
            super(events, {singular: "Asset Action", plural: "Assets Actions"}, "plugin_sheq_assist/19_Maintenance/actions/", "plugin_sheq_assist_19_Maintenance_actions");

            this.list_categories = this.list_categories.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, list_categories, filter} = this;
            addAction("categories/list", list_categories);
            addAction("list/filter", filter);
        }

        async create(evt, data) {
            return this.createAndUploadIfFile(evt, data, "attachment");
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {attachment}}) => {
                attachment && await files.remove(attachment);
            });
        }

        async list_categories(evt) {
            return list_by.call(this, evt, 'category');
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {title, category, location, responsible_person, due_date} = search_val;
                const q = [
                    {key: 'title', comp: 'LIKE', val: title},
                    {key: 'category', comp: 'LIKE', val: category},
                    {key: 'location', comp: 'LIKE', val: location},
                    [
                        {key: 'responsible_person.fname', comp: 'LIKE', val: responsible_person},
                        {key: 'responsible_person.lname', comp: 'LIKE', val: responsible_person}
                    ],
                    {key: 'due_date', comp: '=', val: due_date}
                ];
                return this.filter_impl(evt, q);
            });
        }

    }

    function list_by(evt, key) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerAid.prototype.list.call(this, evt);
            return list.filter(val => {
                return (key in val.data);
            }).map(val => {
                return val.data[key];
            });
        });
    }

    new Controller(events);
})();