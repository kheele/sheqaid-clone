
(function() {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Plugin", plural: "Plugins"}, "plugin_manager/", "plugin_manager", "unauthorized");
            this.search_by_name = this.search_by_name.bind(this);
            const {addAction, search_by_name} = this;
            addAction("list/search_by_name", search_by_name);

//        this.test(evt);
        }

        async test(evt) {
            const newL = [
                {
                    faIconLeft: "biohazard",
                    desc: "No description",
                    key: "Structure_And_Responsibility",
                    title: "Structure & Responsibility",
                    has_update: false,
                    sort: 2,
                    id: 11,
                    hover: "No description",
                    status: "Installed"
                },
                {
                    faIconLeft: "biohazard",
                    desc: "No description",
                    key: "Contractors",
                    title: "Contractors",
                    has_update: false,
                    sort: 8,
                    id: 11,
                    hover: "No description",
                    status: "Installed"
                },
                {
                    faIconLeft: "biohazard",
                    desc: "No description",
                    key: "Hazardous_Chemical_Substances",
                    title: "Hazardous Chemical Substances",
                    has_update: false,
                    sort: 3,
                    id: 11,
                    hover: "Hazardous Chemical Substances (HCS)",
                    status: "Installed"
                },
                {
                    faIconLeft: "biohazard",
                    desc: "No description",
                    key: "COVID_Management",
                    title: "COVID Management",
                    has_update: false,
                    sort: 11,
                    id: 11,
                    hover: "COVID Management",
                    status: "Installed"
                }];

            setTimeout(async () => {
                const doc_ref = await this.getDB().collection(this.tbl).doc('O90ie8QbRq27wXnssTaP');//Promise < DocumentReference < T > >
                let querySnapshot = await doc_ref.get();

                const data = querySnapshot.data();
                data.data.modules.push(...newL);
                console.log('querySnapshot plugin_manager', querySnapshot.id, querySnapshot.data());
                await doc_ref.update(data);
                querySnapshot = await doc_ref.get();
                console.log('querySnapshot plugin_manager', querySnapshot.id, querySnapshot.data());
                //            const list = await this.list(evt);
                //            console.log('list plugin_manager', list)
                //            const res = await this.find_by_id(evt, 1);
                //            console.log('res plugin_manager', res)
            }, 1000);
        }

        async list(evt) {
            const doc_ref = await this.getDB().collection(this.tbl);//Promise < DocumentReference < T > >
            const querySnapshot = await doc_ref.get();
            const list = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
//            console.log(doc.data());
                list.push(doc.data());
            });
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