
class GQLClient {
	static async query({query, variables, multi_queries = false, count = false}) {
		return workers
		.emit("graphql/v1/graphql", {
			query,
			variables,
			multi_queries,
			count,
		})
		.catch(err => {
			console.log(query);
			throw err;
		});
	}

	static async mutation({mutation, variables}) {
		return workers
		.emit("graphql/v1/graphql", {
			mutation,
			variables,
		})
		.catch(err => {
			console.log(mutation);
			throw err;
		});
	}

}

export default GQLClient;