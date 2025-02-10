class ViewsClient {
	static async fetchQuery({path}) {
		return workers.emit("graphql/api/rest/views", path);
	}
}

export default ViewsClient;