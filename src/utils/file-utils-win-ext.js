import mime from 'mime';
import {isWeb} from './Utils';

const file_types = {
    PDF: {
        extensions: ['pdf'],
        name: 'PDF'
    },
    Word: {
        extensions: ['doc', 'docx'],
        name: 'Word'
    },
    Excel: {
        extensions: ['xls', 'xlsx'],
        name: 'Spreadsheet'
    },
    Image: {
        extensions: ['png', 'gif', 'jpg', 'jpeg', 'tiff'],
        name: 'Image'
    },
    Photo: {
        extensions: ['png', 'gif', 'jpg', 'jpeg', 'tiff'],
        name: 'Image'
    },
    Audio: {
        extensions: ['mp3'],
        name: 'Audio'
    },
    Video: {
        extensions: ['mp4', 'avi', 'flv', 'mkv', 'mov', 'mpeg'],
        name: 'Video'
    }
};

const openFileImpl = (name, extensions) => {
    if (isWeb()) {
        return new Promise((resolve, reject) => {
            const id = "upload-input";
            let input = $("#" + id);
            if (input.length === 0) {
                input = $(document.createElement('input')).css("display", "none").appendTo($("body"));
                extensions = extensions.map(ext => "." + ext);
                const mimes = extensions.map(ext => mime.getType(ext));
                input.attr("id", id).attr("type", "file").attr("accept", [...extensions, ...mimes]);
            }
            input.change(evt => {
                const {files, multiple} = evt.target;
                const file = files[0];
//                alert(file)
                resolve(file);
                setTimeout(() => input.remove());
            }).click();
        });
    } else {
        const fs = electronRemote.require('fs');
        const {dialog} = electronRemote;
        return dialog.showOpenDialog(electronRemote.getCurrentWindow(), {
            properties: ['openFile'], // set to use openFileDialog
            filters: [{name: name + " Files", extensions}] // limit the picker to just pdfs
        }).then(result => {
            if (result.canceled) {
                return;
            }
            const {filePaths} = result;
            if (!!filePaths) {
                // Since we only allow one file, just use the first one
                const filePath = filePaths[0];
                return filePath;
            }
        });
    }
};

window.electronDialog = {
    showOpenDialogPDF: () => {
        return electronDialog.showOpenDialogDocs(['PDF']);
    },
    showOpenDialogWord: () => {
        return electronDialog.showOpenDialogDocs(['Word']);
    },
    showOpenDialogWordRaw: () => {
        const {extensions, name} = file_types['Word'];
        return openFileImpl(name, extensions).then(filePath => {
            return {
                isPDF: false,
                path: filePath
            };
        });
    },
    showOpenDialogSpreadsheet: () => {
        return electronDialog.showOpenDialogDocs(['Excel']);
    },
    showOpenDialogSpreadsheetRaw: () => {
        const {extensions, name} = file_types['Excel'];
        return openFileImpl(name, extensions).then(filePath => {
            return {
                isPDF: false,
                path: filePath
            };
        });
    },
    showOpenDialogImage: () => {
        return electronDialog.showOpenDialogDocs(['Image']);
    },
    //
    showOpenDialogDocOrImage: () => {
        return electronDialog.showOpenDialogDocs(['PDF', 'Word', 'Image']);
    },
    showOpenDialogPDFOrImage: () => {
        return electronDialog.showOpenDialogDocs(['PDF', 'Word', 'Image']);
    },
    showOpenDialogDocOrVideo: () => {
        return electronDialog.showOpenDialogDocs(['PDF', 'Word', 'Video']);
    },
    showOpenDialogPDFOrSpreadsheet: () => {
        return electronDialog.showOpenDialogDocs(['PDF', 'Word', 'Excel']);
    },
    showOpenDialogDocs: (types) => {
        const createOpts = () => {
            const extensions = [];
            const name = [];
            (types || Object.keys(file_types)).forEach(type => {
                const o = file_types[type];
                extensions.push(...o.extensions);
                name.push(o.name);
            });
            return {extensions, name: name.join(' / ')};
        };
        const {extensions, name} = createOpts();
        return openFileImpl(name, extensions).then(async filePath => {
            let isPDF = FileTypes.isPDF(filePath);
            let isWord = FileTypes.isWord(filePath);
            let isExcel = FileTypes.isExcel(filePath);
            let isPic = FileTypes.isPic(filePath);
            let isVideo = FileTypes.isVideo(filePath);

            const createPreviewPath = async (filePath) => {
                let dataUri;
                if (isWeb() && filePath instanceof File) {
                    dataUri = await FileConverters.asDataUrl(filePath);
                } else {
                    const fs = electronRemote.require('fs');
                    const base64 = fs.readFileSync(filePath, {encoding: 'base64'});
                    dataUri = `data:${mime.getType(filePath)};base64,${base64}`;
                }
                return dataUriToUrl(dataUri);
            };

            let previewPath;
            if (isPDF) {
                if (filePath instanceof File) {
                    previewPath = URL.createObjectURL(filePath);
                } else {
                    previewPath = await createPreviewPath(filePath);
                }
                previewPath = createReactPDFPreviewUrl(previewPath);
            } else if (isWord || isExcel) {
                if (filePath instanceof File) {
                    previewPath = await FileConverters.asDataUrl(filePath);
                    const wordToPDF = functions.httpsCallable('callables-wordToPDF');
                    const res = await wordToPDF(previewPath);
                    if(res && res.data) {
                        const {data: dataUrl} = res;
                        previewPath = dataUriToUrl(dataUrl);
                    }
                } else {
                    const filePathDest = filePath.replace(mime.getExtension(filePath), "pdf");
                    const fn = isWord ? 'wordToPDF' : 'excelToPDF';
                    await neonBinding.events.emit(fn, filePath, filePathDest);
                    previewPath = await createPreviewPath(filePathDest);
                }

                previewPath = createReactPDFPreviewUrl(previewPath);
            } else {
                previewPath = await createPreviewPath(filePath);
            }

            return {
                isPDF,
                isWord,
                isExcel,
                isPic,
                isVideo,
                previewPath,
                path: filePath
            };
        });
    }
};

window.createPDFPreviewUrlFromRemote = filePath => {
    if (!filePath)
        return null;

    let loc = document.location.toString().replace("index.html", "");
    if (loc.contains('#')) {
        loc = loc.replace(document.location.hash, "").replace("#", "");
    }
    if (filePath.startsWith('blob')) {
//        filePath = loc + filePath;
//        alert(filePath)
    }
    return `${loc}js/lib/pdfjs-2.3.200-dist/web/viewer.html?file=${encodeURIComponent(filePath)}`;
};
window.createReactPDFPreviewUrl = createPDFPreviewUrlFromRemote;
window.createPDFPreviewUrl = async filePath => {
    if (!filePath)
        return null;

    if (filePath.contains('.docx') || filePath.contains('.doc')) {
        filePath = await neonBinding.events.emit('wordToPDFOnline', filePath);
        return createPDFPreviewUrlFromRemote(filePath);
    } else {
        return createPDFPreviewUrlFromRemote(filePath);
    }
};

window.FileTypes = {
    isFileType: (filePath, exts) => {
        if (!filePath || !exts || !isArray(exts))
            return false;
        return exts.map(ext => ext.startsWith('.') ? ext : ('.' + ext)).anyMatch(ext => {
            if (isObject(filePath)) {
                if ('isPDF' in filePath && 'isWord' in filePath && 'isExcel' in filePath && 'isPic' in filePath && 'isVideo' in filePath && 'previewPath' in filePath && 'path' in filePath) {
                    return FileTypes.isFileType(filePath.path);
                }
            }
            if (isString(filePath)) {
                return filePath.endsWith(ext) || filePath.contains(ext);
            } else if (filePath.dlUrls && filePath.dlUrls[0]) {
                return filePath.dlUrls[0].contains(ext);
            } else if (filePath instanceof File) {
                return mime.getExtension(filePath.type) === ext.substring(1) || mime.getType(ext) === filePath.type;
            } else if (filePath.path) {
                const {path} = filePath;
                return path.endsWith(ext) || path.contains(ext);
            }
        });
    },
    isPDF: (filePath) => {
        return FileTypes.isFileType(filePath, ['pdf']);
    },
    isWord: (filePath) => {
        return FileTypes.isFileType(filePath, ['doc', 'docx']);
    },
    isExcel: (filePath) => {
        return FileTypes.isFileType(filePath, ['xsl', 'xsls']);
    },
    isPic: (filePath) => {
        return FileTypes.isFileType(filePath, ['png', 'gif', 'jpg', 'jpeg', 'tiff']);
    },
    isVideo: (filePath) => {
        return FileTypes.isFileType(filePath, ['mp4', 'avi', 'flv', 'mkv', 'mov', 'mpeg']);
    }
};

window.FileConverters = {
    asDataUrl: async (filePath) => {
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(filePath);
            reader.onload = function () {
                resolve(reader.result);//base64encoded string
            };
            reader.onerror = function (err) {
                console.error(err);
                reject(err);
            };
        });
    }
};

export default {};
//437