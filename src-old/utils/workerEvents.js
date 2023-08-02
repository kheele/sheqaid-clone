import JsExcelTemplate from "js-excel-template/browser/browser";
import updateUser from "../mutations/all/User/updateUser";

//<editor-fold desc="WorkerEvents">
class WorkerEvents {

    constructor() {
        workers.on("excelTemplate", this.excelTemplate);
        workers.on("updateNewUserAuthId", this.updateNewUserAuthId);
    }

    async excelTemplate({arrayBuffer, data}) {
        const excelTemplate = await JsExcelTemplate.fromArrayBuffer(arrayBuffer);
        data.forEach((value, key) => {
            excelTemplate.set(key, data.get(key));
        });
        const blob = await excelTemplate.toBlob();
        return await FileConverters.asDataUrl(blob);
    }

    async updateNewUserAuthId({newUser, auth_id}) {
        return await updateUser(newUser.id, {auth_id});
    }

}

//</editor-fold>

export default new WorkerEvents();
