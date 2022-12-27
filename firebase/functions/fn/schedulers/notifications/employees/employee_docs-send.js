const {send: send__users} = require("./employee_docs-send__users");
const {send: send__employees} = require("./employee_docs-send__employees");

exports.send = async ({company_ids, company_groups, collectionGroup, tbl, _group, name,}) => {
    await send__users({company_ids, company_groups, collectionGroup, tbl, _group, name,});
    // await send__employees({company_ids, company_groups, collectionGroup, tbl, _group, name,});
};
