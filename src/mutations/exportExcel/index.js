/* eslint-disable camelcase */

const exportExcel = path => async (args) => {
    try {
        const socket = sockets.of(path);
        return await socket.exportExcel(args);
    } catch (err) {
        throw err;
    }
};

//Assets
export const exportExcelAssets = exportExcel("assets");
export const exportExcelAssetDocs = exportExcel("assets/docs");
