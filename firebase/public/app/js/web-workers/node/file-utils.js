// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

((self) => {
    const isWebWorker = !!self.require;

    let os, path, fs, mime, request;
    if (isWebWorker) {
        os = self.require('os');
        path = self.require('path');
        fs = self.require('fs-extra');
        mime = self.require('mime');
        request = self.require('request');
    }

    // <editor-fold defaultstate="collapsed" desc="fileUtils. Click on the + sign on the left to edit the code.">
    self.fileUtils = {
        toArrayBuffer: function (filePath) {
            if (isWebWorker) {
                try {
                    const raw = fs.readFileSync(filePath);
                    return raw.buffer;
                } catch (e) {
                    return new Promise((resolve, reject) => {
                        function binaryStringToArrayBuffer(binaryString) {
//                    const binaryString = window.atob(base64); // Comment this if not using base64
                            let bytes = new Uint8Array(binaryString.length);
//                    bytes = bytes.map((byte, i) => binaryString.charCodeAt(i));
                            const buffer = new ArrayBuffer(bytes.length);
                            bytes.map((b, i) => buffer[i] = binaryString.charCodeAt(i));
                            return buffer;
                        }
                        request.get(filePath, function (err, res, body) {
                            if (err) {
                                reject(err);
                            } else if (res.statusCode === 200) {
                                const buffer = binaryStringToArrayBuffer(body);
                                resolve(buffer);
                            } else {
                                reject(new Error('Error reading url[' + filePath + '] (' + res.statusCode + ')'));
                            }
                        });
                    });
                }
            }
        },

        toUint8Array: function (filePath) {
            if (isWebWorker) {
                const raw = fs.readFileSync(filePath);
                return new Uint8Array(raw);
            }
        },

        toFile: function (filePath) {
            if (isWebWorker) {
                const raw = fs.readFileSync(filePath);
                const arrayBuffer = raw.buffer;
                let name = this.getFileName(filePath);
                return new File([arrayBuffer], name, {type: mime.getType(filePath), path: filePath});
            }
        },

        toBlob: function (filePath) {
            if (isWebWorker) {
                const raw = fs.readFileSync(filePath);
                const arrayBuffer = raw.buffer;
                return new Blob([arrayBuffer], {type: mime.getType(filePath)});
            }
        },

        toDataURI: function (filePath) {
            if (isWebWorker) {
                const raw = fs.readFileSync(filePath);
                const arrayBuffer = raw.buffer;
                return `data:${mime.getType(filePath)};base64,${raw.toString('base64')}`;
            }
        },

        getMimeType: function (filePath) {
            if (isWebWorker) {
                return mime.getType(filePath);
            }
        },

        getFileName: function (filePath) {
            return filePath.split('\\').pop().split('/').pop();
        },

        getExtension: function (filePath) {
            if(!filePath.contains('.')) {
                return filePath.split('/').pop();
            }
//            console.log('getExtension', filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length))
            return filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length) || filePath;
        }
    };
    // </editor-fold>

    if (isWebWorker) {
        const dir = path.join(os.homedir(), 'AppData', 'Roaming', 'SheqAssist');
        console.log(dir);

        Events.on("delete-all-cache", async db => {
            console.log('delete-all-cache', dir);
            return await new Promise((resolve, reject) => {
                fs.remove(dir, () => {
                    console.log('delete-all-cache', dir, 'done!');
                    resolve();
                });
            });
        });
    }
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);