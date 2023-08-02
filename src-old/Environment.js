import { Environment, Network, QueryResponseCache, RecordSource, Store } from "relay-runtime";
import { execWhen } from "utils/Utils";

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 250, ttl: oneMinute });

async function fetchQuery(operation, variables, cacheConfig) {
  const queryID = operation.text;
  const isMutation = operation.operationKind === "mutation";
  const isQuery = operation.operationKind === "query";
  const forceFetch = cacheConfig && cacheConfig.force;

  // Try to get data from cache on queries
  const fromCache = cache.get(queryID, variables);
  if (isQuery && fromCache !== null && !forceFetch) {
    return fromCache;
  }

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
      // Update cache on queries
      if (isQuery && json) {
        cache.set(queryID, variables, json);
      }
      // Clear cache on mutations
      if (isMutation) {
        cache.clear();
      }

      return json;
    });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
