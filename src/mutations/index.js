import create from "./create";
import createWithCustomArgs from "./createWithCustomArgs";
import update from "./update";
import updateWithCustomArgs from "./updateWithCustomArgs";
import _delete from "./delete";
import upsert from "./upsert";
import findById from "./findById";
import list from "./list";
import listByLogged from "./listByLogged";
import listByLoggedWithCustomArgs from "./listByLoggedWithCustomArgs";
import exportExcel from "./exportExcel";
import employeeHRDashboard from "./employeeHRDashboard";
import employeeHRDateRangeDashboard from "./employeeHRDateRangeDashboard";
import employeeOrgDashboard from "./employeeOrgDashboard";
import employeeOrgDateRangeDashboard from "./employeeOrgDateRangeDashboard";

export default {
    create,
    createWithCustomArgs,
    update,
    updateWithCustomArgs,
    delete: _delete,
    upsert,
    findById,
    list,
    listByLogged,
    listByLoggedWithCustomArgs,
    exportExcel,
    employeeHRDashboard,
    employeeHRDateRangeDashboard,
    employeeOrgDashboard,
    employeeOrgDateRangeDashboard,
};