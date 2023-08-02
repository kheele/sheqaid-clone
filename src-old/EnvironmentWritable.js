import { Environment, Network, QueryResponseCache, RecordSource, Store } from "relay-runtime";
import { execWhen } from "utils/Utils";

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 250, ttl: oneMinute });

async function fetchQuery(operation, variables, cacheConfig) {
  const headers = {};
  const { is, loggedUserAuth } = storage;
  if (is.isLoggedInAuth) {
    const idTokenResult = await execWhen(() => storage.idTokenResult);
    const { token } = idTokenResult;
    headers.Authorization = `Bearer ${token}`;
    headers["X-Hasura-User-Id"] = loggedUserAuth.uid;
    headers["X-Hasura-Role"] = "user";
  }

  // Otherwise, fetch data from server
  return workers
    .emit("relay/send", {
      API_URL,
      variables,
      headers,
      operationKind: operation.operationKind,
      query: operation.text,
    })
    .then((json) => {
      // Clear cache on mutations
      cache.clear();

      return json;
    });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
