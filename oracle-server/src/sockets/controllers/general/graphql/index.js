class Cntr extends ACntr {

    constructor() {
        super('graphql/');

        const {addAction} = this;
        addAction('v1beta1/relay', this.relay.bind(this));
        addAction('v1/graphql', this.default.bind(this));
        addAction('api/rest/views', this.views.bind(this));
    }

    async relay(socket, data = {}) {
        // console.log('data', data)

        let {query, variables, token} = data;

        let headers = {};
        console.log('v1beta1/relay', token, socket.auth_id);
        if (socket.auth_id) {
            // const currentUser = await admin.auth().getUser(socket.auth_id);
            // console.log("relay variables", currentUser, socket.auth_id, variables)
            // if (currentUser) {
            // 	const token = await currentUser.getIdToken(true);
            // 	headers.Authorization = `Bearer ${token}`;
            // 	headers["X-Hasura-User-Id"] = currentUser.uid;
            // 	headers["X-Hasura-Role"] = "user";
            // }

            headers["X-Hasura-User-Id"] = socket.auth_id;
            headers["X-Hasura-Role"] = "user";
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (variables && "headers" in variables) {
            headers = {...headers, ...variables.headers};
            // eslint-disable-next-line no-param-reassign
            delete variables.headers;
        }

        return fetch(process.env.HASURA_RELAY_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-access-key": "rhespo-g",
                ...headers,
            },
            body: JSON.stringify({query, variables}),
        }).then(res => res.json()).catch(err => {
            console.error("response err", err)
            throw err;
        });
    }

    async default(socket, data = {}) {
        // console.log('data', data)

        const {mutation, query, variables, operationName, multi_queries, count, token} = data;

        let headers = {};
        console.log('v1/graphql', token, socket.auth_id);
        if (socket.auth_id) {
            // const currentUser = await admin.auth().getUser(socket.auth_id);
            // console.log("graphql variables", currentUser, socket.auth_id, variables)
            // if (currentUser) {
            // const token = await currentUser.getIdToken(true);
            // headers.Authorization = `Bearer ${token}`;
            // headers["X-Hasura-User-Id"] = currentUser.uid;
            // }

            headers["X-Hasura-User-Id"] = socket.auth_id;
            headers["X-Hasura-Role"] = "user";

            if (variables && "headers" in variables) {
                headers = {...headers, ...variables.headers};
                // eslint-disable-next-line no-param-reassign
                delete variables.headers;
            }
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (mutation) {
            return fetch(process.env.HASURA_GRAPHQL_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-hasura-access-key": "rhespo-g",
                    ...headers,
                },
                body: JSON.stringify({query: mutation, operationName, variables}),
            }).then(res => res.json()).then(res => {
                console.log(res); // { data: ... }

                const {errors, data} = res;

                if (errors) {
                    throw new Error(errors);
                }

                const key = Object.keys(data)[0];
                const item = data[key];
                if (item) {
                    const node = convertMutations(item);
                    // console.log("onCompleted node", node);
                    if (node.id) {
                        return {data: node, id: node.id};
                    } else {
                        return node;
                    }
                }
            })
                .catch(err => {
                    console.log(JSON.stringify({mutation, operationName, variables}));
                    throw err;
                });
        }

        return fetch(process.env.HASURA_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-access-key": "rhespo-g",
                ...headers,
            },
            body: JSON.stringify({query, variables}),
        }).then(res => res.json()).then(res => {
            // console.log(process.env.HASURA_GRAPHQL_ENDPOINT, JSON.stringify(res)); // { data: ... }
            const {errors, data} = res;

            if (errors) {
                throw new Error(errors);
            }

            if (multi_queries) {
                if (!count) {
                    Object.keys(data).forEach(key => {
                        const list = data[key];
                        list.forEach(node => {
                            convertMutations(node);
                        });
                    });
                }
                return data;
            } else {
                const key = Object.keys(data)[0];
                const list = data[key];
                // console.log('connection', connection)
                if (isArray(list)) {
                    const nodes = list.map(node => {
                        node = convertMutations(node);
                        if (node.id) {
                            return {data: node, id: node.id};
                        } else {
                            return node;
                        }
                    });
                    // console.log("onCompleted nodes", nodes);
                    return nodes;
                } else {
                    const node = convertMutations(list);
                    if (node.id) {
                        return {data: node, id: node.id};
                    } else {
                        return node;
                    }
                }
            }
        }).catch(err => {
            console.error(err)
            throw err;
        });
    }

    async views(socket, path) {
        // console.log('data', path)

        let headers = {};

        if (socket.auth_id) {
            // const currentUser = await admin.auth().getUser(socket.auth_id);
            // console.log("relay variables", currentUser, socket.auth_id)
            // if (currentUser) {
            // const token = await currentUser.getIdToken(true);
            // headers.Authorization = `Bearer ${token}`;
            // 	headers["X-Hasura-User-Id"] = currentUser.uid;
            // 	headers["X-Hasura-Role"] = "user";
            // }

            headers["X-Hasura-User-Id"] = socket.auth_id;
            headers["X-Hasura-Role"] = "user";
        }

        return fetch(`${process.env.HASURA_REST_ENDPOINT}/${path}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-access-key": "rhespo-g",
                ...headers,
            },
        }).then(res => res.json()).catch(err => {
            console.log("response err", err.message)
            throw err;
        });
    }

}

module.exports = new Cntr();