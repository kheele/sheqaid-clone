// <editor-fold defaultstate="collapsed" desc="imports">
const {fileTypeFromBuffer} = require('./file-type');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mime = require('mime');
// const faceapi = require('face-api.js');
// const canvas = require('canvas');
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
// const {Canvas, Image, ImageData} = canvas;
// faceapi.env.monkeyPatch({Canvas, Image, ImageData});
// </editor-fold>

exports.createFaceUrl = (uid) => `faces/${uid}/face.png`;

//<editor-fold desc="uploadDataUri">
global.uploadDataUri = async (datauri_or_buffer, filePath) => {
    let buffer, contentType, ext;
    // console.log('uploadDataUri is string', typeof datauri_or_buffer, typeof datauri_or_buffer === 'string')
    console.log('uploadDataUri', datauri_or_buffer)
    if (typeof datauri_or_buffer === 'string') {
        const parts = datauri_or_buffer.split(',');
        contentType = parts[0].replace('data:', '').split(';')[0];
        const base64 = parts[1];
        buffer = Buffer.from(base64, 'base64');
        console.log('uploadDataUri datauri', contentType)
    } else {
        buffer = datauri_or_buffer;
        const res = fileTypeFromBuffer(buffer);//=> {ext: 'png', mime: 'image/png'}
        contentType = res.contentType;
        console.log('uploadDataUri buffer', contentType)
    }

    ext = mime.getExtension(contentType);

    const newName = `${filePath}.${ext}`;

    const storageBucket = admin.storage().bucket(DEFAULT_BUCKET);
    let bucketFile = await storageBucket.file(newName);
    return bucketFile.save(buffer, {contentType}).then(async () => {
        const gcsUri = "gs://" + DEFAULT_BUCKET + "/" + newName;
        const dlUrls = await bucketFile.getSignedUrl({
            action: 'read',
            expires: '03-17-2099',
        });
        return {gcsUri, dlUrls};
    });
};
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="loadFaceModels">
exports.loadFaceModels = () => {
    return Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
        faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
        //detectors
        faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
        faceapi.nets.tinyFaceDetector.loadFromDisk('./models'),
        faceapi.nets.mtcnn.loadFromDisk('./models'),
        //others
//        faceapi.nets.faceLandmark.loadFromDisk('./models'),
//        faceapi.nets.faceLandmarkTinyModel.loadFromDisk('./models'),
//        faceapi.nets.faceRecognition.loadFromDisk('./models'),
//        faceapi.nets.faceExpression.loadFromDisk('./models')

//        faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
//        faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
//        faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')
    ]);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="loadImage">
exports.loadImage = async (bucketFile, uid) => {
    const tempFile = path.join(os.tmpdir(), `faces-${uid}-face.png`);
    await new Promise((resolve, reject) => {
        bucketFile.createReadStream().on('error', (err) => {
            reject(err);
        }).on('response', (res) => {
            // Server connected and responded with the specified status and headers.
        }).on('end', () => {
            // The file is fully downloaded.
            resolve();
        }).pipe(fs.createWriteStream(tempFile));
    });

    const userImage = await canvas.loadImage(tempFile);
    return userImage;
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="deleteTmpImage">
exports.deleteTmpImage = (uid) => {
    const tempFile = path.join(os.tmpdir(), `faces-${uid}-face.png`);
    fs.stat(tempFile, (err, stats) => {
        if (err) {
            return console.error(err);
        }
        fs.unlink(tempFile, (err) => {
            if (err)
                return console.error(err);
        });
    });
};
// </editor-fold>

//<editor-fold desc="wordPreviewUrl">
global.wordPreviewUrl = async (dataUrl) => {
    console.log('wordPreviewUrl', dataUrl)
    if (!dataUrl)
        throw new Error('No source file supplied.');

    const new_name = `docs-office-preview/docx`;
    return uploadDataUri(dataUrl, new_name);
};
//</editor-fold>

//<editor-fold desc="excelPreviewUrl">
global.excelPreviewUrl = async (dataUrl) => {
    console.log('excelPreviewUrl', dataUrl)
    if (!dataUrl)
        throw new Error('No source file supplied.');

    const new_name = `docs-office-preview/excel`;
    return uploadDataUri(dataUrl, new_name);
};
//</editor-fold>

global.uploadFilesUpdate = async ({id, doc, key, new_name, onUpdate}) => {
    if (!doc || !new_name) {
        return;
    }

    const attrs = {};

    if (doc.path || doc.data) {
        let {path, data} = doc;
        data = data || path.data;

        key = key || 'doc';

        if(data) {
            console.log('uploadFilesUpdate doc data', data)
            attrs[key] = await uploadDataUri(data, new_name);
        } else {
            console.log('uploadFilesUpdate doc path', path)
            attrs[key] = await uploadDataUri(path, new_name);
        }
    }

    if (Object.keys(attrs).isNotEmpty()) {
        await onUpdate({id, ...attrs});
    }
};