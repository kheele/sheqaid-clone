const listImpl = require('../../listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        desc,
    } = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_documents',
        listName: 'document_list',
        listRename: 'id_or_passport_list',
        singular: 'ID/Passport',
        inc_fragment,
        attrs: {
            desc,
        },
    });
    // console.log('data', data)
}
//</editor-fold>