import { Environment, Network, QueryResponseCache, RecordSource, Store } from "relay-runtime";
import { execWhen } from "utils/Utils";

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 250, ttl: oneMinute });

async function fetchQuery(operation, variables, cacheConfig) {
  return workers
    .emit("graphql/v1beta1/relay", {
      variables,
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
