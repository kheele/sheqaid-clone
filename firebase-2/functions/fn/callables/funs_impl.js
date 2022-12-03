// <editor-fold defaultstate="collapsed" desc="imports">
const fs = require('fs');
const path = require('path');
const os = require('os');

const mammoth = require("mammoth");
const pdf = require('html-pdf');

const optionsPhantomjs = {
    "phantomPath": "./node_modules/phantomjs-prebuilt/bin/phantomjs"
};

const faceapi = require('face-api.js');

const canvas = require('canvas');
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const {Canvas, Image, ImageData} = canvas;
faceapi.env.monkeyPatch({Canvas, Image, ImageData});
// </editor-fold>

global.addCustomUserClaims = (uid, claims) => {
    return admin.auth().getUser(uid).then(({customClaims = {}}) => {
        if (claims.access_type_list) {
            claims.access_type_list = {...(customClaims.access_type_list || {}), ...claims.access_type_list};
        }
        return admin.auth().setCustomUserClaims(uid, {...customClaims, ...claims});
    });
};

global.setCustomUserClaims = (uid, claims) =>
    admin.auth().getUser(uid).then(({customClaims}) =>
        admin.auth().setCustomUserClaims(uid, claims));

exports.createFaceUrl = (uid) => `faces/${uid}/face.png`;

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

global.wordToPDF = async (dataUrl) => {
    if (!dataUrl)
        throw new Error('No source file supplied.');

    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');//data_url

    function docxConverter(buffer, callback) {
        const promise = mammoth.convertToHtml({
            buffer
        }).then(async (result) => {
            const html = result.value; // The generated HTML 
            const messages = result.messages; // Any messages, such as warnings during conversion 
//            console.log(messages);
            try {
                const res = await new Promise((resolve, reject) => {
                    pdf.create(html, optionsPhantomjs).toBuffer((err, buffer) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(buffer);
                        }
                    });
                });
                return callback(null, res);
            } catch (err) {
                return callback(err);
            }
        }).catch(err => {
            return callback(err);
        });
        promise.done();
    }

    return new Promise((resolve, reject) => {
        docxConverter(buffer, (err, buffer) => {
//            console.log('wordToPDF result', buffer);
            if (err) {
                reject(err);
            } else {
                resolve(`data:application/pdf;base64,${buffer.toString('base64')}`);
            }
        });
    });
};