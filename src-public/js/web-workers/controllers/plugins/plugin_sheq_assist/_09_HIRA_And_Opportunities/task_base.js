
(() => {
    class Controller extends AControllerAid {

        constructor(events) {
            super(events, {singular: "Task Base Risk Assessment", plural: "Task Base Risk Assessments"}, "plugin_sheq_assist/09_HIRA_And_Opportunities/task-base/", "plugin_sheq_assist_09_risk_assessment_task_base");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;

            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
//
//            async function load() {
//                const coll_ref = await this.getDB().collection('plugin_sheq_assist_09_risk_assessment_task_base');//Promise < DocumentReference < T > >
//                const querySnapshot = await coll_ref.get();
//                querySnapshot.forEach(async (doc) => {
//                    const doc_ref = await this.getDB().collection('plugin_sheq_assist_09_risk_assessment_task_base').doc(doc.id);
//                    let {list} = doc.data();
//                    list = list.map(v => {
//                        if (v.probability_1) {
////                            v.likelihood_1 = v.probability_1;
//                            delete v.probability_1;
//                        }
//                        if (v.probability_1) {
////                            v.likelihood_1 = v.probability_1;
//                            delete v.probability_1;
//                        }
//                        if (v.probability_2) {
////                            v.likelihood_2 = v.probability_2;
//                            delete v.probability_2;
//                        }
//                        if (v.probability_3) {
////                            v.likelihood_3 = v.probability_3;
//                            delete v.probability_3;
//                        }
//
//                        if (v.severity_1) {
////                            v.consequence_1 = v.severity_1;
//                            delete v.severity_1;
//                        }
//                        if (v.severity_2) {
////                            v.consequence_2 = v.severity_2;
//                            delete v.severity_2;
//                        }
//                        if (v.severity_3) {
////                            v.consequence_3 = v.severity_3;
//                            delete v.severity_3;
//                        }
//                        return v;
//                    });
//                    const updated = await doc_ref.update({list});//Promise < void >
//                    console.log('ra saved')
//                });
//            }
//            load();
        }

        async search_by_name(evt, activity) {
            return this.filter(evt, {activity});
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {created_at, activity} = search_val;
                const q = [
                    {key: 'activity', comp: 'LIKE', val: activity},
                    {key: 'created_at', comp: '=', val: created_at}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events);
})();