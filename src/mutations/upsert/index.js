/* eslint-disable camelcase */

const upsert = path => async (attrs) => {
    try {
        const {upsert} = sockets.of(path);
        return await upsert(attrs);
    } catch (err) {
        throw err;
    }
};

export const upsertAssetMaintenancePlan = upsert("assets/maintenance-plans");
export const upsertAssetCalibrationRecord = upsert("assets/calibration-records");
