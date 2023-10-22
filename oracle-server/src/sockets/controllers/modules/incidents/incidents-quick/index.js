const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("incidents-quick/findById", findByIdImpl);

eventManager.on("incidents-quick/listByLogged", async (socket, data) => {
    // const {today} = data;
    //
    // data.client_filter = `schedule_date: {_eq: "${today}"},`;
    return listImpl(socket, data);
});
