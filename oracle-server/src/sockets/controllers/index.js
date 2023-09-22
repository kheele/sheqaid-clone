require("../eventManager");
require("./ACntr");

require("./graphql");

require("./excel");
require("./accounts");
require("./get");
require("./send");

exports.start = (socket) => {
	socket.on("emit", async (req, callback) => {
		// console.log('socket emit', req);
		const {path, data} = req;
		const args = [socket, path];
		data && args.push(data);

		try{
			const res = await eventManager.emit.apply(eventManager, args);
			callback && callback(res);
		} catch (err) {
			callback && callback(null, err);
		}
	});
};

exports.destroy = (socket) => {
	// socket.off("emit");
};