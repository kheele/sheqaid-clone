
(function () {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Plugin", plural: "Plugins"}, "plugin_manager/", "plugin_manager", "unauthorized");
            
            const {addAction} = this;
            addAction("update-list", this.update_list.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));
        }

        // <editor-fold defaultstate="collapsed" desc="onChange">
        onChange(val, changeType) {
            console.log(this.tbl, changeType, val.id)
            if (changeType === 'added') {
                Events.emit(this.root + 'onCreated', val);
            } else if (changeType === 'modified') {
                Events.emit(this.root + 'onUpdated', val);
            } else if (changeType === 'removed') {
                Events.emit(this.root + 'onRemoved', val);
            }
        }
        // </editor-fold>

        async update_list(evt, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const list = await Promise.all(updateAttrs.map(async plugin => {
                    const {id, data: updateAttrs} = plugin;
                    
                    const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    const doc_snapshot = await doc_ref.get();
                    if (!doc_snapshot.exists) {
                        return null;
                    }

                    const {modules = []} = updateAttrs;
                    if (modules && !modules.isEmpty()) {
                        updateAttrs.modules = modules.map(v => {
                            const {company_list: oldL, company_list_added: newL} = v;
                            v.company_list = [...(oldL || []), ...(newL || [])].filter(v => !!v).map(v => v.id || v);
                            if(v) {
                                delete v.company_list_keys;
                            }
                            return v;
                        });
                    }

                    const updateData = await AControllerRead.prototype.update.call(this, evt, id, {data: updateAttrs});
                    const item = {id, data: updateData};
                    return item;
                }));
                return Promise.all(list.map(PluginsFuns.mapPluginsResults));
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

    new Controller(events, db);
})();