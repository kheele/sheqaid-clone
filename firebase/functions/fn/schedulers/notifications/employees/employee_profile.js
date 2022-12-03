
exports.notifyForEmployeesNotLocated = async (ctx) => {
    await authorize();
    console.log('notifyForEmployeesNotLocated', JSON.stringify(ctx))
//    if (ctx.auth.uid) {
//        const user = admin.auth().getUserByEmail(email);
//        const {uid} = user;
//        return {uid};
//    } else {
//        console.log('notifyForEmployeesNotLocated logged off')
//    }
};
exports.notifyForEmployeesDuplicate = async (ctx) => {
    await authorize();
    console.log('notifyForEmployeesDuplicate', JSON.stringify(ctx))
//    if (ctx.auth.uid) {
//        const user = admin.auth().getUserByEmail(email);
//        const {uid} = user;
//        return {uid};
//    } else {
//        console.log('notifyForEmployeesNotLocated logged off')
//    }
};