//<editor-fold desc="orgs_fragment">
const {query: findByIdProxyContractorSite} = require("../graphql/ProxyContractorSite/findByIdProxyContractorSite");
const orgs_fragment = `
    company{
        id
        name
    }
    client{
        id
        name
    }
    project{
        id
        name
    }
    site{
        id
        name
    }
`;
//</editor-fold>

//<editor-fold desc="fragment">
const fragment = `
    edges{
        node{
            id
            ${orgs_fragment}
            user{
                id
                username
                phone
                fname
                lname
                ${orgs_fragment}
            }
        }
    }
`;
//</editor-fold>

//<editor-fold desc="query">
const query = `
query getEmployeesProfileIncompleteQuery {
  list_no_dob:hr_employees_connection(where: {dob:{_is_null: true}}){
    ${fragment}
  }
  list_no_gender:hr_employees_connection(where: {sex:{_is_null: true}}){
    ${fragment}
  }
  list_no_phone:hr_employees_connection(where: {phone:{_is_null: true}}){
    ${fragment}
  }
  list_no_employment_num:hr_employees_connection(where: {employment_num:{_is_null: true}}){
    ${fragment}
  }
  list_no_employment_date:hr_employees_connection(where: {employment_date:{_is_null: true}}){
    ${fragment}
  }
  list_no_job_position:hr_employees_connection(where: {job_position:{_is_null: true}}){
    ${fragment}
  }
  list_no_department:hr_employees_connection(where: {department:{_is_null: true}}){
    ${fragment}
  }
}
`;
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onEmployeeProfileIncomplete">
exports.onEmployeeProfileIncomplete = functions.runWith({
    timeoutSeconds: 300,
    memory: '1GB'
}).https.onCall(async (data, ctx) => {
    await authorize();

    const item = await getRelayOne({query, operationName: "getEmployeesProfileIncompleteQuery"});
    if(!item) {
        res.send();
        return;
    }

    const {
        list_no_dob,
        list_no_gender,
        list_no_phone,
        list_no_employment_num,
        list_no_employment_date,
        list_no_job_position,
        list_no_department,
    } = item;

    // if(list_no_dob) {
    //
    // }
});
// </editor-fold>

