
(() => {
    class Controller extends AControllerAssist {
        //date, type, auditor, company, representative, scope, definition_list, list
        constructor(events, db) {
            super(events, db, {singular: "Internal Audit", plural: "Internal Audits"}, "plugin_sheq_assist/21_Internal_Audit/audit/", "plugin_sheq_assist_21_Internal_Audit_audit");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            const {addAction, search_by_name, filter} = this;

            addAction("elements/list", this.list_elements.bind(this));
            addAction("sub_elements/list", this.list_sub_elements.bind(this));

            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
        }

//        async list(evt) {
//            return Events.whenLoggedIn(async loggedUser => {
//                let _list = await AControllerAssist.prototype.list.call(this, evt);
//                return _list.map(val => {
//                    const {id, data: {company, type, date, list}} = val;
//                    val.data.comformance_summary = getMatches(_list, company, type, date);
//                    return val;
//                });
//            });
//        }

        async list_elements(evt) {
            return list_only_keys.call(this, evt, 'element');
        }
        async list_sub_elements(evt) {
            return list_only_keys.call(this, evt, 'sub_element');
        }

        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {title} = val.data;
                    return title.toLowerCase().startsWith(search_val)
                };
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {date, type, auditor, company} = search_val;
                const q = [
                    {key: 'date', comp: '=', val: date},
                    {key: 'type', comp: 'LIKE', val: type},
                    {key: 'auditor', comp: 'LIKE', val: auditor},
                    {key: 'company', comp: 'LIKE', val: company}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }
//
//    function reduce_possible_score(v) {
//        const {element, sub_element, sec} = v;
//        const possible_score = sec.map(v => parseInt(v.possible_score)).reduce((n1, n2) => n1 + n2);
//        return possible_score;
//    }
//
//    function reduce_achieved_score(v) {
//        const {element, sub_element, sec} = v;
//        const achieved_score = sec.map(v => parseInt(v.achieved_score)).reduce((n1, n2) => n1 + n2);
//        return achieved_score;
//    }
//
//    function round(value, precision) {
//        const multiplier = Math.pow(10, precision || 0);
//        return Math.round(value * multiplier) / multiplier;
//    }
//
//    function getMatches(_list, _company, _type, _date) {
//        const matches = _list.filter(val => {
//            const {id, data: {company, type, date, list}} = val;
//            return _company === company && _type === type && (new Date(_date).getFullYear() >= new Date(date).getFullYear());
//        }).map(val => {
//            let {id, data: {company, type, date, list}} = val;
//            let possible_score;
//            let achieved_score;
//            if (list.length > 1) {
//                possible_score = list.map(v => reduce_possible_score(v)).reduce((n1, n2) => n1 + n2);
//                achieved_score = list.map(v => reduce_achieved_score(v)).reduce((n1, n2) => n1 + n2);
//            } else if (list.length === 1) {
//                possible_score = reduce_possible_score(list[0]);
//                achieved_score = reduce_achieved_score(list[0]);
//            }
//            const compliance = round((achieved_score / possible_score) * 100, 1);
//            return {year: new Date(date).getFullYear(), compliance, achieved_score, possible_score};
//        });
//        if (matches.length > 0) {
//            matches.sort((a, b) => a.year < b.year ? 1 : a.year > b.year ? -1 : 0);
//            const first = matches[0].year;
//            const last = matches[matches.length - 1].year;
//            for (var year = last - 1; year > first - 4; year--) {
//                matches.push({year, compliance: 'N/A', achieved_score: 'N/A', possible_score: 'N/A'});
//            }
//        }
//        return matches;
//    }

    function createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    function list_only_keys(evt, key) {
        return Events.whenLoggedIn(async loggedUser => {
            let list = await AControllerAssist.prototype.list.call(this, evt);
            const vals = [];
            list.forEach(val => {
                vals.push(...val.data.list.map(val => {
                    return val[key];
                }));
            });
            vals.sort();
            return vals.distinct();
        });
    }

    new Controller(events, db);
})();