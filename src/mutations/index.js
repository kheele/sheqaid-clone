import create from "./create";
import update from "./update";
import _delete from "./delete";
import upsert from "./upsert";
import findById from "./findById";
import list from "./list";

export default {
    create,
    update,
    delete: _delete,
    upsert,
    findById,
    list,
};