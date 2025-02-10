import JsExcelTemplate from "js-excel-template/browser/browser";
import {updateContractorUser} from "mutations/update";
import {findByIdContractorUser, findByIdEmployee, findByIdUser} from "mutations/findById";

//<editor-fold desc="WorkerEvents">
class WorkerEvents {

    constructor() {
        workers.on("excelTemplate", this.excelTemplate);
        workers.on("cookie", this.cookie);

        workers.on("updateNewContractorUser", this.updateNewContractorUser);

        workers.on("findByIdUser", findByIdUser);
        workers.on("findByIdContractorUser", findByIdContractorUser);
        workers.on("findByIdEmployee", findByIdEmployee);
    }

    async excelTemplate({arrayBuffer, data}) {
        const workbook = await JsExcelTemplate.fromArrayBuffer(arrayBuffer);
        data.forEach((value, key) => {
            workbook.set(key, data.get(key));
        });
        const blob = await workbook.toBlob();
        return await FileConverters.asDataUrl(blob);
    }

    async cookie(key) {
        const cookiesArray = document.cookie.split(";").map((cookie) => cookie.trim());
        console.log("cookiesArray", cookiesArray)
        const cookies = cookiesArray.reduce((all, cookie) => {
            const [cookieName, value] = cookie.split("=");
            return {
                [cookieName]: value,
                ...all,
            };
        }, {});
        return cookies[key];
    }

    async updateNewContractorUser({id, auth_id, profile_pic}) {
        return await updateContractorUser({id, auth_id, profile_pic});
    }

}

//</editor-fold>

export default new WorkerEvents();
