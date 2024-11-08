//<editor-fold desc="imports">
import updateAsset from "mutations/all/Asset/updateAsset";
import upsertAssetDetails from "mutations/all/Asset/upsertAssetDetails";
import upsertAssetPurchaseInfo from "mutations/all/Asset/upsertAssetPurchaseInfo";
import upsertAssetDepreciation from "mutations/all/Asset/upsertAssetDepreciation";
import {upsertAssetCalibrationRecord, upsertAssetMaintenancePlan,} from "mutations/upsert";
//</editor-fold>

const onSubmit = (btn, data, onProgress) => {
    if (Object.keys(data).isEmpty()) {
        infoDialog.open("Nothing changed!");
        return;
    }

    console.log(data)

    if (!onProgress) {
        btn.text("Saving...").disabled();
        progressDialog.open();
    }
    return updateAsset({id: this.item.id, ...data}).then(res => {
        console.log("res", res)
        // onSaved && onSaved(res);
        infoDialog.open("Record successfully updated.");
        infoDialog.close(2000);
        // this.props.close();
        return true;
    }).finally(() => {
        btn.text("Save").enabled();
        setTimeout(() => progressDialog.close());
    });
};

const onSubmitAssetDetails = (btn, data, asset_detail) => {
    if (Object.keys(data).isEmpty()) {
        infoDialog.open("Nothing changed!");
        return;
    }

    console.log(data)

    btn.text("Saving...").disabled();
    progressDialog.open();
    upsertAssetDetails({
        id: asset_detail.id,
        ...data,
    }).then(res => {
        console.log("res", res)
        infoDialog.open("Record successfully updated.");
        infoDialog.close(2000);
        // this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
        setTimeout(() => progressDialog.close());
    });
};

const onSubmitAssetPurchaseInfo = (btn, data, purchase_info) => {
    if (Object.keys(data).isEmpty()) {
        infoDialog.open("Nothing changed!");
        return;
    }

    console.log(data)

    btn.text("Saving...").disabled();
    progressDialog.open();
    upsertAssetPurchaseInfo({
        id: purchase_info && purchase_info.id,
        ...data,
    }).then(res => {
        console.log("res", res)
        infoDialog.open("Record successfully updated.");
        infoDialog.close(2000);
        // this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
        setTimeout(() => progressDialog.close());
    });
};

const onSubmitAssetDepreciation = (btn, data, depreciation) => {
    if (Object.keys(data).isEmpty()) {
        infoDialog.open("Nothing changed!");
        return;
    }

    console.log(data)

    btn.text("Saving...").disabled();
    progressDialog.open();
    upsertAssetDepreciation({
        id: depreciation && depreciation.id,
        ...data,
    }).then(res => {
        console.log("res", res)
        infoDialog.open("Record successfully updated.");
        infoDialog.close(2000);
        // this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
        setTimeout(() => progressDialog.close());
    });
};

const onSubmitAssetMaintenancePlan = (btn, data, maintenance_plan) => {
    if (Object.keys(data).isEmpty()) {
        infoDialog.open("Nothing changed!");
        return;
    }

    console.log(data)

    btn.text("Saving...").disabled();
    progressDialog.open();
    upsertAssetMaintenancePlan({
        id: maintenance_plan && maintenance_plan.id,
        ...data,
    }).then(res => {
        console.log("res", res)
        infoDialog.open("Record successfully updated.");
        infoDialog.close(2000);
        // this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
        setTimeout(() => progressDialog.close());
    });
};

const onSubmitAssetCalibrationRecord = (btn, data, calibration_record) => {
    if (Object.keys(data).isEmpty()) {
        infoDialog.open("Nothing changed!");
        return;
    }

    console.log(data)

    btn.text("Saving...").disabled();
    progressDialog.open();
    upsertAssetCalibrationRecord({
        id: calibration_record && calibration_record.id,
        ...data,
    }).then(res => {
        console.log("res", res)
        infoDialog.open("Record successfully updated.");
        infoDialog.close(2000);
        // this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
        setTimeout(() => progressDialog.close());
    });
};

export {
    onSubmit,
    onSubmitAssetDetails,
    onSubmitAssetPurchaseInfo,
    onSubmitAssetDepreciation,
    onSubmitAssetMaintenancePlan,
    onSubmitAssetCalibrationRecord,
};
