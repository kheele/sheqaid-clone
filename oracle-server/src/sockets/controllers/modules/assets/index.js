require('./calibration-record-list');
require('./depreciation');
require('./details');
require('./docs');
require('./maintenance-plan-list');
require('./monitoring-plan-fuel-usage-list');
require('./monitoring-plan-working-hrs-or-km-list');
require('./photos');
require('./purchase-info');
require('./vehicle-forms');

// class Cntr extends ACntr {
// 	constructor() {
// 		super('assets/');
//
// 		const {addAction} = this;
// 		addAction('insertAsset', this.insertAsset.bind(this));
// 	}
//
// 	async insertAsset(socket, data) {
// 		// console.log('data', data)
//
// 		let {query, variables} = data;
//
// 		let headers = {};
// 		if(socket.auth_id) {
// 			const currentUser = await admin.auth().getUser(socket.auth_id);
// 			console.log("relay variables", currentUser, socket.auth_id, variables)
// 			if (currentUser) {
// 				const token = await currentUser.getIdToken(true);
// 				headers.Authorization = `Bearer ${token}`;
// 				headers["X-Hasura-User-Id"] = currentUser.uid;
// 				headers["X-Hasura-Role"] = "user";
// 			}
// 		}
//
// 		if (variables && "headers" in variables) {
// 			headers = {...headers, ...variables.headers};
// 			// eslint-disable-next-line no-param-reassign
// 			delete variables.headers;
// 		}
//
// 		return fetch(process.env.HASURA_RELAY_ENDPOINT, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 				"x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
// 				...headers,
// 			},
// 			body: JSON.stringify({query, variables}),
// 		}).
// 		then(res => res.json()).
// 		catch(err => {
// 			console.error("response err", err)
// 			throw err;
// 		});
// 	}
//
// }
//
// module.exports = new Cntr();

const findByIdImpl = require("../findByIdImpl");
const listImpl = require('./listImpl');
// const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {asset_details_fragment: details_fragment} = require('./commons');

eventManager.on("assets/findById", findByIdImpl({
	name: "Asset", tbl: "assets", details_fragment,
}));

eventManager.on("assets/listByLogged", listImpl);

// eventManager.on("assets/dashboard", findByIdDashboardImpl);
