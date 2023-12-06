const listImpl = require('../listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {type, due_to} = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_leaves',
        listName: 'leave_list',
        singular: 'Leave',
        inc_fragment,
        attrs: {
            type,
            due_to,
        },
    });
    // console.log('data', data)
}
//</editor-fold>