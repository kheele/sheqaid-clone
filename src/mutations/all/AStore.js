import {Dates} from "../../utils/Dates";

class AStore {

    async listAllByLogged(
        {
            removed = false,
            expiry_date,
            byLoggedSite,
            byLoggedProject,
            byLoggedClient,
            byLoggedCompany,
        }
    ) {
        if (!isBoolean(removed)) {
            removed = false;
        }

        if(isString(expiry_date) && expiry_date !== 'ALL') {
            const monStart = new Date().addMonths(-4);
            const monEnd = new Date().addMonths(12);

            const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

            // expiry_date = ;
        }

        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isNoProjects} = storage.is;

        if (sess_my_site_id && isFunction(byLoggedSite)) {
            return byLoggedSite(sess_my_site_id, removed);
        }
        if (sess_my_project_id && isFunction(byLoggedProject)) {
            return byLoggedProject(sess_my_project_id, removed);
        }
        if (sess_my_client_id && isFunction(byLoggedClient)) {
            return byLoggedClient(sess_my_client_id, removed);
        }

        if (isConsultant) {
            if (selectedSite && isFunction(byLoggedSite)) {
                return byLoggedSite(selectedSite.id, removed);
            }
            if (selectedProject && isFunction(byLoggedProject)) {
                return byLoggedProject(selectedProject.id, removed);
            }
            if (selectedClient && isFunction(byLoggedClient)) {
                return byLoggedClient(selectedClient.id, removed);
            }
            return [];
        } else if (!isNoProjects) {
            if (selectedSite && isFunction(byLoggedSite)) {
                return byLoggedSite(selectedSite.id, removed);
            }
            if (selectedProject && isFunction(byLoggedProject)) {
                return byLoggedProject(selectedProject.id, removed);
            }
            return [];
        }

        if (isFunction(byLoggedCompany)) {
            return byLoggedCompany(sess_company_id, removed);
        }
        return [];
    }

    async listForSelectionByLogged(
        {
            listForSelectionByLoggedSite,
            listForSelectionByLoggedProject,
            listForSelectionByLoggedClient,
            listForSelectionByLoggedCompany,
        }
    ) {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
        const {isConsultant, isNoProjects} = storage.is;

        if (sess_my_site_id && isFunction(listForSelectionByLoggedSite)) {
            return listForSelectionByLoggedSite(sess_my_site_id);
        }
        if (sess_my_project_id && isFunction(listForSelectionByLoggedProject)) {
            return listForSelectionByLoggedProject(sess_my_project_id);
        }
        if (sess_my_client_id && isFunction(listForSelectionByLoggedClient)) {
            return listForSelectionByLoggedClient(sess_my_client_id);
        }

        if (isConsultant) {
            if (selectedSite && isFunction(listForSelectionByLoggedSite)) {
                return listForSelectionByLoggedSite(selectedSite.id);
            }
            if (selectedProject && isFunction(listForSelectionByLoggedProject)) {
                return listForSelectionByLoggedProject(selectedProject.id);
            }
            if (selectedClient && isFunction(listForSelectionByLoggedClient)) {
                return listForSelectionByLoggedClient(selectedClient.id);
            }
            return [];
        } else if (!isNoProjects) {
            if (selectedSite && isFunction(listForSelectionByLoggedSite)) {
                return listForSelectionByLoggedSite(selectedSite.id);
            }
            if (selectedProject && isFunction(listForSelectionByLoggedProject)) {
                return listForSelectionByLoggedProject(selectedProject.id);
            }
            return [];
        }

        if (isFunction(listForSelectionByLoggedCompany)) {
            return listForSelectionByLoggedCompany(sess_company_id);
        }
        return [];
    }

    async listAllByLoggedActive() {
        return this.listAllByLogged(false);
    }

    async listAllByLoggedRemoved() {
        return this.listAllByLogged(true);
    }

    get sess_claims() {
        const {idTokenResult} = storage;
        if (!idTokenResult) return null;
        const {claims} = idTokenResult;
        return claims;
    }

    get sess_user_id() {
        const {sess_claims} = this;
        if (!sess_claims) return null;
        const {access_type, user_id, company_id} = sess_claims;
        if (!company_id) return null;
        return company_id;
    }

    get sess_company_id() {
        const {sess_claims} = this;
        if (!sess_claims) return null;
        const {access_type, user_id, company_id} = sess_claims;
        if (!company_id) return null;
        return company_id;
    }

    get sess_my_client_id() {
        const {sess_claims} = this;
        if (!sess_claims) return null;
        const {access_type, user_id, my_client} = sess_claims;
        if (!my_client) return null;
        return my_client.id;
    }

    get sess_my_project_id() {
        const {sess_claims} = this;
        if (!sess_claims) return null;
        const {access_type, user_id, my_project} = sess_claims;
        if (!my_project) return null;
        return my_project.id;
    }

    get sess_my_site_id() {
        const {sess_claims} = this;
        if (!sess_claims) return null;
        const {access_type, user_id, my_site} = sess_claims;
        if (!my_site) return null;
        return my_site.id;
    }

    async extractId(item) {
        if (!item) return null;

        let id;
        if (isNumber(item)) {
            id = item;
        } else if (isNumber(item.id)) {
            id = item.id;
        } else if (isString(item)) {
            id = convertIdToBigint(item);
        } else if (isString(item.id)) {
            id = convertIdToBigint(item.id);
        }

        if (!isNumber(id)) return null;

        return id;
    }
}

export default AStore;