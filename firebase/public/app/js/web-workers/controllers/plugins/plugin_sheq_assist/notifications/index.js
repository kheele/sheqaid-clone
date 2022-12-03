
(function () {
    class Controller extends AControllerAssist {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Notification", plural: "Notifications"}, "notifications/", "default_notifications");

            this.list_unread = this.list_unread.bind(this);
            this.filter = this.filter.bind(this);

            const {addAction, list_unread, filter} = this;

            addAction("list/unread", list_unread);
            addAction("list/filter", filter);
        }

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

        async list_unread(evt) {
            const _list = await this.filter(evt, {is_read: false});
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
                const {is_read} = search_val;
                const q = [
                    {key: 'is_read', comp: '=', val: is_read}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();