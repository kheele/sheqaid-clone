const updateUser = require("../../fn/callables/queries/updateUser");

const {query: loginContractorUserQuery} = require("../../fn/callables/graphql/loginContractorUserQuery");
const {query: checkByResetPassIdContractorQuery} = require("../../fn/callables/graphql/checkByResetPassIdContractorQuery");

//<editor-fold desc="convertIdToBigint">
global.convertIdToBigint = (encodedHasuraRelayID) => {
    try {
        if (isNumber(encodedHasuraRelayID)) return encodedHasuraRelayID;

        const decodedRelayID = atob(encodedHasuraRelayID);
        const relayIdAsArray = JSON.parse(decodedRelayID);
        const actualDatabaseID = relayIdAsArray[3];
        // console.log(decodedRelayID); // "[1, \"lifeplan\", \"status_plan_header\", 1]"
        // console.log(relayIdAsArray); // [1, "lifeplan", "status_plan_header", 1]
        // console.log(actualDatabaseID); // 1  (the actual database ID)!
        return actualDatabaseID;
    } catch(err) {
        // console.error('convertIdToBigint', encodedHasuraRelayID, err);
        return encodedHasuraRelayID;
    }
};
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
exports.onSetCustomUserClaims = async (data, decodedIdToken) => {
    await authorize();

    // console.log('onSetCustomUserClaims decodedIdToken', decodedIdToken)
    if (!decodedIdToken) return null;

    const {uid} = decodedIdToken;

    const item = await getRelayOne({
        query: loginContractorUserQuery,
        operationName: "loginContractorUserQuery",
        variables: {auth_id: uid},
    });
    // console.log('onSetCustomUserClaims item', item)
    if (!item) {
        return null;
    }

    const loggedUser = {user: item};

    const {
        data: user_data,
        data: {
            company, contractor,
            client: my_client, project: my_project, site: my_site
        }
    } = loggedUser.user;
    company && (company.id = convertIdToBigint(company.id));
    contractor && (contractor.id = convertIdToBigint(contractor.id));

    my_client && (my_client.id = convertIdToBigint(my_client.id));
    my_project && (my_project.id = convertIdToBigint(my_project.id));
    my_site && (my_site.id = convertIdToBigint(my_site.id));

    my_client && (user_data.client = my_client);
    my_project && (user_data.project = my_project);
    my_site && (user_data.site = my_site);

    if(company) {
        loggedUser.company = {id: company.id, data: company};
    }

    const currentCustomClaims = {
        access_type: "ContractorUser",
        company_id: company && company.id,
        loggedUser: {
            user: {id: user_data.id, auth_id: user_data.auth_id},
            // company: {id: company.id},
        },
    };

    if(company) {
        currentCustomClaims.loggedUser.company = {id: company.id};
    }

    if (contractor) {
        currentCustomClaims.contractor_id = contractor.id;
    }

    if (my_client) {
        currentCustomClaims.my_client = {id: my_client.id};
    }
    if (my_project) {
        currentCustomClaims.my_project = {id: my_project.id};
    }
    if (my_site) {
        currentCustomClaims.my_site = {id: my_site.id};
    }

    console.log('currentCustomClaims', JSON.stringify(currentCustomClaims).length, JSON.stringify(currentCustomClaims))
    return setCustomUserClaims(uid, currentCustomClaims).then(async () => {
        try {
            const token = await createCustomToken(uid);
            return {loggedUser, token, customClaims: currentCustomClaims};
        } catch (err) {
            console.error(err)
            return "ERR_CREATING_TOKEN";
        }
    });
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onResetPassword">
exports.onResetPassword = async (data) => {
    await authorize();

    if (!data)
        return null;
    if (!isObject(data))
        return null;

    const {id: reset_password_id, password} = data;
    if (!reset_password_id)
        return null;
    if (!password)
        return null;

    const item = await getRelayOne({
        query: checkByResetPassIdContractorQuery,
        operationName: "checkByResetPassIdContractorQuery",
        variables: {reset_password_id},
    });
    // console.log('CheckUserByResetPassId item', item)
    if (!item) {
        return "TOKEN_NOT_FOUND";
    }

    const {id, data: {auth_id, email, phone}} = item;

    const _auth = admin.auth();

    let promise = _auth.getUser(auth_id);

    return promise.then(async (userRecord) => {
        const {uid, email, phoneNumber} = userRecord;

        try {
            const res = await updateUser({id, attrs: {reset_password_id: null}});
            if (!res) {
                return null;
            }
            if (res === "NO_DB_USER") {
                return res;
            }
        } catch (err) {
            return "UDATE_ERROR";
        }

        // console.log('onResetPassword', userRecord.changePassword, userRecord.updatePassword);

        try {
            await _auth.updateUser(uid, {password});
            console.log('onResetPassword success')
            return true;
        } catch (err) {
            console.log('onResetPassword err 2', err.message)
            const res = await updateUser({id, attrs: {reset_password_id}});
            if (!res) {
                return null;
            }
            if (res === "NO_DB_USER") {
                return res;
            }

            return "UPDATE_ERROR";
        }
    });
};
// </editor-fold>
