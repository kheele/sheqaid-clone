Events.on("emit", async (req, callback) => {
    // console.log('socket emit', req);
    const {path, data} = req;
    const args = [socket, path];
    if (data !== undefined && data !== null) {
        data && args.push(data);
    }

    try {
        const res = await Events.emit.apply(Events, args);
        callback && callback(res, null);
    } catch (err) {
        // console.error(`eventManager.emit(${path}) err:`, err.message);
        console.error(`eventManager.emit(${path}) stack:`, err.stack);
        const {name, message, stack} = err;
        callback && callback(null, JSON.stringify({name, message, stack}));
    }
});
