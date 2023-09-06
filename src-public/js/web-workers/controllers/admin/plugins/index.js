
(function () {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {singular: "Plugin", plural: "Plugins"}, "admin/plugin_manager/", "plugin_manager", "unauthorized");

            const {addAction} = this;
            addAction("list/search_by_name", this.search_by_name.bind(this));
        }

        async create(evt, data) {
            const {modules = []} = data;
            if (modules && !modules.isEmpty()) {
                modules.forEach(v => {
                    if (v.company_list) {
                        v.company_list = v.company_list.filter(v => !!v).map(v => v.id);
                    }
                });
            }

            const doc_ref = await this.getDB().collection(this.tbl).add({data: data});//Promise < DocumentReference < T > >
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

            const item = {id: doc_snapshot.id, data: doc_snapshot.data()};
            const list = await Promise.all([item].map(PluginsFuns.mapPluginsResults));
            return list[0];
        }

        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                const {modules = []} = updateAttrs;
                if (modules && !modules.isEmpty()) {
                    modules.forEach(v => {
                        if (v.company_list) {
                            v.company_list = v.company_list.filter(v => !!v).map(v => v.id);
                        }
                    });
                }

                const updateData = await AControllerRead.prototype.update.call(this, evt, id, {data: updateAttrs});
                const item = {id, data: updateData};
                const list = await Promise.all([item].map(PluginsFuns.mapPluginsResults));
                return list[0].data;
            });
        }

        async list(evt) {
            const doc_ref = await this.getDB().collection(this.tbl);//Promise < DocumentReference < T > >
            const querySnapshot = await doc_ref.get();
            let list = [];
            querySnapshot.forEach((doc) => {
                list.push({id: doc.id, data: doc.data()});
            });
            list = await Promise.all(list.map(PluginsFuns.mapPluginsResults));
            return list;
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