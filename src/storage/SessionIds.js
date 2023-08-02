
class SessionIds {

    get sess_claims() {
        const {idTokenResult} = this.storage;
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

const sessionIds = new SessionIds();
export default sessionIds;
