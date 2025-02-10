(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events, {
                singular: "Contractor Administrator/User",
                plural: "Contractor Administrators/Users"
            }, "plugin_sheq_assist/contractors/users/", "plugin_sheq_assist_contractors_users");

            const {addAction} = this;
            addAction("relogin", this.relogin.bind(this));

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {
                    user: {
                        data: {
                            client: my_client, project: my_project, site: my_site,
                            contractor_id
                        }
                    },
                    client_id, project_id, site_id,
                    contractor_id: logged_contractor_id
                } = loggedUser;
                contractor_id = logged_contractor_id || contractor_id;

                const list = [
                    ['company_id', '==', company_id],
                    ['contractor_id', '==', contractor_id]
                ];
                if (my_client) {
                    list.push(['client_id', '==', my_client.id]);
                } else if (client_id) {
                    list.push(['client_id', '==', client_id]);
                }
                return list;
            });
        }

        // </editor-fold>

        get isContractorUser() {
            return true;
        }

        get access_type() {
            return 'ContractorUser';
        }

        get auth() {
            return auth2;
        }

        get functions() {
            return functions2;
        }

        getDB() {
            return db2;
        }

        sortBy(list) {
            list.sortBy("data.lname");
        }
    }

    const userCntr = new Controller(events);

    // <editor-fold defaultstate="collapsed" desc="auth2.onAuthStateChanged">
    auth2.onAuthStateChanged((user) => {
        const {selfLogin} = userCntr;
    });
    // </editor-fold>

})();//627
