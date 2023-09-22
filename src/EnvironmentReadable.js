import { Environment, Network, QueryResponseCache, RecordSource, Store } from "relay-runtime";
import { execWhen } from "utils/Utils";

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 250, ttl: oneMinute });

async function fetchQuery(operation, variables, cacheConfig) {
  const queryID = operation.text;
  const forceFetch = cacheConfig && cacheConfig.force;

  // Try to get data from cache on queries
  const fromCache = cache.get(queryID, variables);
  if (fromCache !== null && !forceFetch) {
    return fromCache;
  }

  return workers
    .emit("graphql/v1beta1/relay", {
      variables,
      operationKind: operation.operationKind,
      query: operation.text,
    })
    .then((json) => {
      // Update cache on queries
      if (json) {
        cache.set(queryID, variables, json);
      }

      return json;
    });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
