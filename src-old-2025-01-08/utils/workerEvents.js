import JsExcelTemplate from "js-excel-template/browser/browser";
import {updateEmployee, updateUser} from "mutations/update";
import findByUsernameUser from "mutations/all/User/findByUsernameUser";
import findByUsernameEmployee from "../mutations/all/Employee/findByUsernameEmployee";
import findByUsernameContractorUser from "../mutations/all/ContractorUser/findByUsernameContractorUser";
import findByUsernameContractor from "../mutations/all/Contractor/findByUsernameContractor";
import findByContractorIdContractorUser from "../mutations/all/ContractorUser/findByContractorIdContractorUser";
import updateContractorUser from "../mutations/all/ContractorUser/updateContractorUser";
import findByPhoneUser from "../mutations/all/User/findByPhoneUser";
import findByPhoneContractorUser from "../mutations/all/ContractorUser/findByPhoneContractorUser";
import findByPhoneEmployee from "../mutations/all/Employee/findByPhoneEmployee";
import {findByIdEmployee, findByIdUser} from "mutations/findById";
import findByIdContractorUser from "../mutations/all/ContractorUser/findByIdContractorUser";

//<editor-fold desc="WorkerEvents">
class WorkerEvents {

    constructor() {
        workers.on("excelTemplate", this.excelTemplate);
        workers.on("cookie", this.cookie);

        workers.on("updateNewUser", this.updateNewUser);
        workers.on("updateNewContractorUser", this.updateNewContractorUser);

        workers.on("updateUser", updateUser);
        workers.on("updateContractorUser", updateContractorUser);
        workers.on("updateEmployee", updateEmployee);

        workers.on("findByUsernameUser", findByUsernameUser);
        workers.on("findByUsernameContractorUser", findByUsernameContractorUser);
        workers.on("findByUsernameEmployee", findByUsernameEmployee);
        workers.on("findByUsernameContractor", findByUsernameContractor);

        workers.on("findByPhoneUser", findByPhoneUser);
        workers.on("findByPhoneContractorUser", findByPhoneContractorUser);
        workers.on("findByPhoneEmployee", findByPhoneEmployee);

        workers.on("findByIdUser", findByIdUser);
        workers.on("findByIdContractorUser", findByIdContractorUser);
        workers.on("findByIdEmployee", findByIdEmployee);

        workers.on("findByContractorIdContractorUser", findByContractorIdContractorUser);
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

    async updateNewUser({id, auth_id, profile_pic}) {
        return await updateUser({id, auth_id, profile_pic, checkLogin: false});
    }

    async updateNewContractorUser({id, auth_id, profile_pic}) {
        return await updateContractorUser({id, auth_id, profile_pic});
    }

}

//</editor-fold>

export default new WorkerEvents();
