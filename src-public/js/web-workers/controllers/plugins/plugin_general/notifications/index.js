
(function () {
    class Controller extends AControllerAid {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Notification", plural: "Notifications"}, "notifications/", "default_notifications");

            const {addAction} = this;

            addAction("list/unread", this.list_unread.bind(this));
            addAction("list/filter", this.filter.bind(this));

            const transfer = async () => {
                const col_ref = await db.collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await col_ref.get();
                await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const ref = await db2.collection(this.tbl).doc(doc.id);
                    await ref.set(doc.data());

                    await doc.ref.delete();
                    console.log('doc deleted', doc.id);
                }));
                console.log(this.tbl, 'final');
            };
//            transfer();
        }

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }
                
                console.log(1, evt, id, updateAttrs)
                
                const itemData = await AControllerRead.prototype.update.call(this, evt, id, updateAttrs);    
                console.log(2, evt, id, itemData)            
                return itemData;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="onChange">
        onChange(val, changeType) {
            console.log(this.tbl, changeType, val.id)
            if (changeType === 'added') {
                Events.emit(this.root + 'onCreated', val);
            } else if (changeType === 'modified') {
//                        Events.emit(this.root + 'onUpdated', val);
            } else if (changeType === 'removed') {
                Events.emit(this.root + 'onRemoved', val);
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.list.call(this, evt);

                console.log(this.tbl, 'list', list.length)
                return list.filter(({data}) => !data.removed);
            });
        }
        // </editor-fold>

        async list_unread(evt) {
            const _list = await this.filter(evt, {is_read: false, removed: false});
            return _list.map(({data}) => data._group).distinct().map(_group => {
                let list_group = _list.filter(({data}) => data._group === _group);
                list_group = list_group.map(({data}) => data.name.plural).distinct().map(name_group => {
                    const list = list_group.filter(({data}) => data.name.plural === name_group);
                    return {name_group, list};
                });
                return {_group, list: list_group};
            });
        }

        //_target{id, tbl, desc}, _group, name, email_sent, is_read, client, project, site, client_id, project_id, site_id
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {is_read, removed} = search_val;
                const q = [
                    {key: 'is_read', comp: '=', val: is_read},
                    {key: 'removed', comp: '=', val: removed}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();