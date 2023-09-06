
(() => {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {singular: "Country", plural: "Countries"}, "countries/", "default_countries", "unauthorized");
            this.search_by_name = this.search_by_name.bind(this);
            const {addAction, search_by_name} = this;
            addAction("list/search_by_name", search_by_name);
        }

        async list(evt) {
            const doc_ref = await this.getDB().collection(this.tbl).doc("countries");//Promise < DocumentReference < T > >
            const snapshot = await doc_ref.get();
            const {items} = snapshot.data();
            items.sortBy('data.name');
            return items;
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {name} = val.data;
                    return name.toLowerCase().startsWith(search_val)
                };
            });
        }
    }
    
    new Controller(events);
})();