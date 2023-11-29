require("../eventManager");
require("./ACntr");

require("./general");
require("./modules");

exports.start = (socket) => {
	socket.on("emit", async (req, callback) => {
		// console.log('socket emit', req);
		const {path, data} = req;
		const args = [socket, path];
		data && args.push(data);

		try{
			const res = await eventManager.emit.apply(eventManager, args);
			callback && callback(res, null);
		} catch (err) {
			console.error('eventManager.emit err:', err);
			const {name, message, stack} = err;
			callback && callback(null, JSON.stringify({name, message, stack}));
		}
	});
};

exports.destroy = (socket) => {
	// socket.off("emit");
};