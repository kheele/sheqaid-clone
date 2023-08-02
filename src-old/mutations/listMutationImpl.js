/* eslint-disable camelcase */

// 1
import {fetchQuery} from "react-relay";
import environment from "Environment";

// 2
export default ({checkLogin = true, query, variables}) => {
    // eslint-disable-next-line no-unused-vars
    const {is} = storage;
    if (checkLogin && !is.isLoggedInAuth) {
        return;
    }

    // 4
    return fetchQuery(environment, query, variables)
        .toPromise()
        .then((res) => {
            const key = Object.keys(res)[0];
            const connection = res[key];
            // console.log('connection', connection)
            const {edges = []} = connection;
            const nodes = edges.map(({node}) => {
                if(node.id) {
                    const id = convertIdToBigint(node.id);
                    const data = {...node, id};
                    return {data, id};
                } else {
                    return node;
                }
            });
            // console.log("onCompleted nodes", nodes);
            return nodes;
        })
        .catch((err) => {
            console.error(err);
            throw err;
        });
};
