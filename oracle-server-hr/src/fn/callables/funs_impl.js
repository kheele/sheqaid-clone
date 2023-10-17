// <editor-fold defaultstate="collapsed" desc="imports">
const {convertMutations} = require("../../graphql/convertMutations");
// </editor-fold>

//<editor-fold desc="addCustomUserClaims">
global.addCustomUserClaims = (uid, claims) => {
    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims = {}}) => {
        if (claims.access_type_list) {
            claims.access_type_list = {...(customClaims.access_type_list || {}), ...claims.access_type_list};
        }
        return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
    });
};
//</editor-fold>

//<editor-fold desc="setCustomUserClaims">
global.setCustomUserClaims = (uid, claims) => {
    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims}) =>
      _auth.setCustomUserClaims(uid, claims));
}
//</editor-fold>

//<editor-fold desc="createCustomToken">
global.createCustomToken = (uid) => {
    return admin.auth().createCustomToken(uid, {access_type: "Staff"});
}
//</editor-fold>

//<editor-fold desc="sendRelay">
global.sendRelay = async (args) => {
    if(!args) return null;
    const {query, variables, operationName} = args;

    const API_URL = "http://cloud.sheqaid.com:8080/v1beta1/relay";
    const result = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-access-key": "rhespo-g",
            "X-Hasura-Role": "admin",
            // ...headers,
        },
        body: JSON.stringify({
            query,
            variables,
            operationName
        })
    });

    const {errors, data} = await result.json();
    if (errors) {
        // handle those errors like a pro
        console.error(errors);
        return null;
    }

    // console.log('sendRelay res', data);

    return data;
};
//</editor-fold>

//<editor-fold desc="listRelay">
global.listRelay = async ({query, operationName, variables}) => {
    const query_res = await sendRelay({
        query,
        operationName,
        variables,
    });
    if (!query_res) {
        return;
    }

    const key = Object.keys(query_res)[0];
    const connection = query_res[key];
    // console.log('connection', connection)
    const {edges = []} = connection;
    const nodes = edges.map(({cursor, node}) => {
        node = convertMutations(node);
        if (node.id) {
            return {data: node, id: node.id, cursor};
        } else {
            return node;
        }
    });
    // console.log("onCompleted nodes", nodes);
    return nodes;
};
//</editor-fold>

//<editor-fold desc="getRelayOne">
global.getRelayOne = async ({query, operationName, variables, multi_queries = false}) => {
    const query_res = await sendRelay({
        query,
        operationName,
        variables,
    });
    if (!query_res) {
        return;
    }

    if(multi_queries) {
        Object.keys(query_res).forEach(key => {
            const connection = query_res[key];
            const {edges = []} = connection;
            const nodes = edges.map(({cursor, node}) => {
                node = convertMutations(node);
                if (node.id) {
                    return {data: node, id: node.id, cursor};
                } else {
                    return node;
                }
            });

            query_res[key] = nodes;
        });
        return query_res;
    } else {
        const key = Object.keys(query_res)[0];
        const connection = query_res[key];
        const {edges = []} = connection;
        let [edge] = edges;
        let {node = null} = edge || {};
        if (node && node.id) {
            const id = convertIdToBigint(node.id);
            const data = {...node, id};
            node = {data, id};
        }
        return convertMutations(node);
    }
};
//</editor-fold>

//<editor-fold desc="insertRelay">
global.insertRelay = async ({query, operationName, input}) => {
    return await sendRelay({
        query,
        operationName,
        variables: {object: input}
    });
};
//</editor-fold>

//<editor-fold desc="updateRelay">
global.updateRelay = async ({mutation, operationName, id, attrs}) => {
    if(attrs.id) {
        delete attrs.id;
    }
    return await sendRelay({
        query: mutation,
        operationName,
        variables: {
            id: { id },
            _set: attrs,
        },
    });
};
//</editor-fold>
