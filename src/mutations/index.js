import create from "./create";
import update from "./update";
import _delete from "./delete";
import upsert from "./upsert";
import findById from "./findById";
import list from "./list";
import listByLogged from "./listByLogged";
import exportExcel from "./exportExcel";
import employeeHRDashboard from "./employeeHRDashboard";
import employeeHRDateRangeDashboard from "./employeeHRDateRangeDashboard";
import employeeOrgDashboard from "./employeeOrgDashboard";
import employeeOrgDateRangeDashboard from "./employeeOrgDateRangeDashboard";

export default {
    create,
    update,
    delete: _delete,
    upsert,
    findById,
    list,
    listByLogged,
    exportExcel,
    employeeHRDashboard,
    employeeHRDateRangeDashboard,
    employeeOrgDashboard,
    employeeOrgDateRangeDashboard,
};