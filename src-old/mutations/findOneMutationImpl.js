/* eslint-disable camelcase */

// 1
import {fetchQuery} from "react-relay";
import environment from "Environment";

// 2
export default ({checkLogin = true, query, variables}) => {
    // eslint-disable-next-line no-unused-vars
    const {is} = storage;
    if (checkLogin && !is.isLoggedInAuth) {
        return Promise.reject(new Error('Unauthorized request'));
    }

    // 4
    return fetchQuery(environment, query, variables, {singleResult: true})
        .toPromise()
        .then((res) => {
            const key = Object.keys(res)[0];
            const connection = res[key];
            // console.log('connection', connection)
            const {edges = []} = connection;
            let [edge] = edges;
            let {node = null} = edge || {};
            if (node && node.id) {
                const id = convertIdToBigint(node.id);
                const data = {...node, id};
                node = {data, id};
            }
            // console.log("onCompleted node", node);
            return node;
        })
        .catch((err) => {
            console.error(err);
            throw err;
        });
};
