
const {fileTypeFromBuffer} = require('../../../../libs/file-type/win32');

eventManager.on("convert", (socket, data = []) => {
    return fileTypeFromBuffer(data);
});
