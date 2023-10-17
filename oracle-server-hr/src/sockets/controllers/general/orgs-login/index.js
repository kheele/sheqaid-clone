
eventManager.on("orgs/login", (socket, data = {}) => {
	// console.log('data', data)
	
	const {auth_id, access_type} = socket.handshake.session;
	
	// const {client_id, project_id, site_id} = data;
	
	return addCustomUserClaims(auth_id, {...data}, access_type).then(() => true);
});
