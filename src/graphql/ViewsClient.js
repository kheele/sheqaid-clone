import {execWhen} from "utils/UtilsFuns";
import WebWorker from "web-worker/WebWorker";

class ViewsClient {
	static async fetchQuery({path}) {
		const headers = {};
		const {is, loggedUserAuth} = storage;
		if (is.isLoggedInAuth) {
			const idTokenResult = await execWhen(() => storage.idTokenResult);
			const {token} = idTokenResult;
			headers.Authorization = `Bearer ${token}`;
			headers["X-Hasura-User-Id"] = loggedUserAuth.uid;
			headers["X-Hasura-Role"] = "user";
		}

		const worker = new WebWorker(() => {
			Events.on("process", async (db, {path, headers}) => {
				return fetch(
					// `https://hasura.cloud.sheqaid.com/api/rest/views`,
					// `https://cloud.sheqaid.com:5000/api/rest/views`,
					`https://cloud.sheqaid.com/api/rest/views`,
					{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-hasura-access-key": "rhespo-g",
						...headers,
					},
					body: path,
				}).then(res => res.json());
			});
		});
		const res = await worker.emit("process", {path, headers});
		worker.terminate();
		return res;
	}
}

export default ViewsClient;