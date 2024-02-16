// <editor-fold defaultstate="collapsed" desc="imports">
const {v4: uuidv4} = require("uuid");
const {query: getByAuthIdOTPQuery} = require("../../fn/callables/graphql/getByAuthIdOTPQuery");
const {mutation: updateOTPMutation} = require("../../fn/callables/graphql/updateOTPMutation");
const {mutation: insertOTPMutation} = require("../../fn/callables/graphql/insertOTPMutation");
const {query: checkByUsernameContractorQuery} = require("../../fn/callables/graphql/checkByUsernameContractorQuery");
const CheckUserByUsername = require("../../fn/callables/graphql/CheckUserByUsername");
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendUserOTP">
global.sendUserOTP = async (username) => {
	await authorize();
	if (!username)
		return;
	
	username = username.toLowerCase();
	
	return admin.auth().getUserByEmail(username).then(async (userRecord) => {
		if (!userRecord) {
			return "NO_USER_AUTH";
		}
		
		const {uid, email, phoneNumber} = userRecord;
		
		const otp = uuidv4().substring(0, 5);
		
		await insertRelay({
			query: insertOTPMutation,
			operationName: 'insertOTPMutation',
			input: {auth_id: uid, otp}
		});
		
		//send otp with email
		await EmailUtils.send({
			from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
			to: email,
			subject: 'SHEQ Aid Notifications',
			html: `<h3><b>Hello,</b></h3>\n
                <p>Please use the One-Time Password provided below on SHEQ Aid application:</p>\n
                <p style="font-size: 20px"><b>${otp}</b></p>\n
                <p>If you didn't request this, you can ignore this email or let us know.</p>\n
                <p>Kind Regards<br/>SHEQ Aid</p>`
		});
		
		return true;
	}).catch(err => {
		if (err.code === "auth/user-not-found") {
			return "NO_USER_AUTH";
		}
		throw err;
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="confirmUserOTP">
global.confirmUserOTP = async (data) => {
	await authorize();
	if (!data)
		return;
	
	let {username, code} = data;
	if (!username)
		return;
	
	username = username.toLowerCase();
	
	const _auth = admin.auth();
	return _auth.getUserByEmail(username).then(async (userRecord) => {
		if (!userRecord) {
			return "NO_USER_AUTH";
		}
		
		const {uid, email, phoneNumber, customClaims} = userRecord;
		
		//users_otp
		const item = await getRelayOne({
			query: getByAuthIdOTPQuery,
			operationName: 'getByAuthIdOTPQuery',
			variables: {auth_id: uid},
		});
		if (!item) {
			return "NO_OTP_DB";
		}
		
		const {otp, date} = item.data;
		
		if (otp !== code) {
			return "NO_OTP_MATCH";
		}
		
		const now = admin.firestore.Timestamp.now().toMillis();
		const addTime = 1800000;//miliseconds = 30 minutes
		const comparedTime = Dates.parse(date).getTime() + addTime;
		if (comparedTime < now) {
			return "CODE_EXPIRED";
		}
		
		try {
			await updateRelay({
				mutation: updateOTPMutation,
				operationName: 'updateOTPMutation',
				id: item.id,
				attrs: {otp: null},
			});
		} catch (err) {
			return "ERR_UPDATE_USER";
		}
		
		try {
			const token = await createCustomToken(uid);
			return {uid, token};
		} catch (err) {
			console.error(err)
			return "ERR_CREATING_TOKEN";
		}
	}).catch(err => {
		if (err.code === "auth/user-not-found") {
			return "NO_USER_AUTH";
		}
		throw err;
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="sendForgotPass">
global.sendForgotPass = async (username) => {
	await authorize();
	if (!username)
		return;
	
	username = username.toLowerCase();
	
	return admin.auth().getUserByEmail(username).then(async (userRecord) => {
		if (!userRecord) {
			return "NO_USER_AUTH";
		}
		
		const reset_password_id = uuidv4();
		
		const res = await updateResetPassID({username, reset_password_id});
		if (!res) {
			return null;
		}
		if (res === "NO_DB_USER") {
			return res;
		}
		
		const url = `https://server.cloud.sheqaid.com/accounts/pass-recovery.html?id=${reset_password_id}&type=ContractorUser`;// -H "Content-Type:application/json" --data '{"name":"Keyboard Cat"}';
		await EmailUtils.send({
			from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
			to: username,
			subject: 'SHEQ Aid - Recover Password',
			html: '<h3><b>Recover Password</b></h3>\n\
                    <hr />\n\
                    <p>Need to reset your password? No problem. Just click the button below and you will be on your way.</p>\n\
                    <p><b>Note: You MUST have opened the software before clicking the button below.</b></p>\n\
                    <p>If you did not make this request, please ignore this email.</p><br />\n\
                    <p><a href="' + url + '" style="font-size: 20px; color: #ddd; text-decoration: none; padding: 15px; border-radius: 3px; box-shadow: 0 0 3px #eee; background: rgb(2, 168, 168);">Reset Your Password</a></p>'
		});
		
		return true;
	}).catch(err => {
		if (err.code === "auth/user-not-found") {
			return "NO_USER_AUTH";
		}
		throw err;
	});
};
// </editor-fold>

//<editor-fold desc="updateResetPassID">
const updateResetPassID = async ({username, reset_password_id}) => {
	const item = await getRelayOne({
		query: checkByUsernameContractorQuery,
		operationName: "checkByUsernameContractorQuery",
		variables: {username},
	});
	console.log('CheckUserByUsername item', item)
	if (!item) {
		return 'NO_DB_USER';
	}
	
	const {id} = item;
	
	await updateRelay({
		mutation: `
          mutation updateResetPassIDMutation($id: default_contractor_users_pk_columns_input!, $_set: default_contractor_users_set_input!) {
            update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
		operationName: "updateResetPassIDMutation",
		id,
		attrs: {reset_password_id},
	});
	
	return true;
};
//</editor-fold>
