const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");

exports.send = async ({company_ids, company_groups}) => {
    await send__users({company_ids, company_groups});
    // await send__employees({company_ids, company_groups});
};
