import create from "./create";
import update from "./update";
import _delete from "./delete";
import upsert from "./upsert";
import findById from "./findById";
import list from "./list";
import listByLogged from "./listByLogged";
import exportExcel from "./exportExcel";

export default {
    create,
    update,
    delete: _delete,
    upsert,
    findById,
    list,
    listByLogged,
    exportExcel,
};