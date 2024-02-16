
eventManager.on("orgs/login", (socket, data = {}) => {
	// console.log('data', data)
	
	const {auth_id} = socket.handshake.session;
	
	// const {client_id, project_id, site_id} = data;
	
	return addCustomUserClaims(auth_id, {...data}).then(() => true);
});
