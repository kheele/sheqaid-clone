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
        listRename: 'prdp_list',
        singular: 'PrDP',
        inc_fragment,
        attrs: {
            desc,
        },
    });
    // console.log('data', data)
}
//</editor-fold>