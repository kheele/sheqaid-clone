
(() => {
    class Controller extends AControllerAid {
        //name, department, desc
        constructor(events) {
            super(events, {singular: "Training Certificate", plural: "Training Certificates"}, "plugin_sheq_assist/05_Trainings/certificates/", "plugin_sheq_assist_trainings_certificates");

            const {addAction} = this;
            
            addAction("normal/remove", this.remove_normal.bind(this));
            addAction("induction/remove", this.remove_induction.bind(this));
            
            addAction("normal/list", this.list_normal.bind(this));
            addAction("induction/list", this.list_induction.bind(this));
            
            addAction("normal/list/filter", this.filter_normal.bind(this));
            addAction("induction/list/filter", this.filter_induction.bind(this));
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {employees} = data;
                delete data.employees;
                const res = await Promise.all(employees.map(employee => {
                    return {...data, employee};
                }).map(async data => {
                    this.injectSavable(evt, loggedUser, data);
                    const db_data = await this.getDB().collection(this.tbl).add(data);
                    const snapshot = await db_data.get();

                    data = snapshot.data();
                    const {created_at: created_at_2} = data;
                    if (created_at_2 && created_at_2.toDate) {
                        data.created_at = created_at_2.toDate();
                    }

                    const auditData = {id: snapshot.id, data};

                    this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                    return auditData;
                }));
                return res;
            });
        }

        async list_normal(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);
                list = list.filter(({data: {training}}) => training && ("Normal" === (training.type || training.data.type)));
                return list;
            });
        }

        async list_induction(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);
                list = list.filter(({data: {training}}) => training && ("Induction" === (training.type || training.data.type)));
                return list;
            });
        }

        async remove_normal(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                return this.remove(evt, id);
            });
        }

        async remove_induction(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                return this.remove(evt, id);
            });
        }

        async filter_normal(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list_normal(evt);

                const {type, issued_date, course_or_module, job_title, company} = search_val;
                const q = [
                    {key: 'training.data.course_or_module', comp: 'LIKE', val: course_or_module},
                    {key: 'training.data.job_title', comp: 'LIKE', val: job_title},
                    {key: 'type', comp: '=', val: type},
                    {key: 'company', comp: 'LIKE', val: company},
                    {key: 'issued_date', comp: '=', val: issued_date}
                ];
                return this.filter_impl(evt, q, list);
            });
        }

        async filter_induction(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list_induction(evt);

                const {type, issued_date, course_or_module, job_title, company} = search_val;
                const q = [
                    {key: 'training.data.course_or_module', comp: 'LIKE', val: course_or_module},
                    {key: 'training.data.job_title', comp: 'LIKE', val: job_title},
                    {key: 'type', comp: '=', val: type},
                    {key: 'company', comp: 'LIKE', val: company},
                    {key: 'issued_date', comp: '=', val: issued_date}
                ];
                return this.filter_impl(evt, q, list);
            });
        }
    }

    new Controller(events);
})();