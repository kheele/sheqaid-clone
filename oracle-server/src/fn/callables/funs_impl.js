// <editor-fold defaultstate="collapsed" desc="imports">
const fs = require('fs');
const path = require('path');
const os = require('os');
const mime = require('mime');
const {fileTypeFromBuffer} = require('file-type');

// const faceapi = require('face-api.js');

// const canvas = require('canvas');
const {convertMutations} = require("../../graphql/convertMutations");
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
// const {Canvas, Image, ImageData} = canvas;
// faceapi.env.monkeyPatch({Canvas, Image, ImageData});

const {CONTRACTORS_ENDPOINT, HR_ENDPOINT} = process.env;
// </editor-fold>

//<editor-fold desc="addCustomUserClaims">
global.addCustomUserClaims = (uid, claims, access_type) => {
    if(access_type === 'ContractorUser') {
        return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/addCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }
    if(access_type === 'Staff') {
        return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/addCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }

    const _auth = adminAuth(access_type);
    return _auth.getUser(uid).then(({customClaims = {}}) => {
        if (claims.access_type_list) {
            claims.access_type_list = {...(customClaims.access_type_list || {}), ...claims.access_type_list};
        }
        return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
    });
};
//</editor-fold>

//<editor-fold desc="setCustomUserClaims">
global.setCustomUserClaims = (uid, claims, access_type) => {
    if(access_type === 'ContractorUser') {
        return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/setCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }
    if(access_type === 'Staff') {
        return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/setCustomUserClaims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid, claims}),
        }).then(res => res.text());
    }

    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims}) =>
      _auth.setCustomUserClaims(uid, claims));
}
//</editor-fold>

//<editor-fold desc="createCustomToken">
global.createCustomToken = (uid, data) => {
    const {access_type} = data;
    if(access_type === 'ContractorUser') {
        return fetch(`${CONTRACTORS_ENDPOINT}api/callables/accounts/sign/createCustomToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid}),
        }).then(res => res.text());
    }
    if(access_type === 'Staff') {
        return fetch(`${HR_ENDPOINT}api/callables/accounts/sign/createCustomToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid}),
        }).then(res => res.text());
    }

    return admin.auth().createCustomToken(uid, {access_type});
}
//</editor-fold>

global.isValidAccessType = (access_type) => access_type === "User" || access_type === "ContractorUser" || access_type === "Staff";

global.adminAuth = (access_type) => {
    return {
        "User": admin,
        "ContractorUser": admin2,
        "Staff": admin_hr
    }[access_type].auth();
}

exports.createFaceUrl = (uid) => `faces/${uid}/face.png`;

//<editor-fold desc="uploadDataUri">
global.uploadDataUri = async (datauri_or_buffer, filePath) => {
    let buffer, contentType, ext;
    if(typeof datauri_or_buffer === 'string') {
        const parts = datauri_or_buffer.split(',');
        contentType = parts[0].replace('data:', '').split(';')[0];
        const base64 = parts[1];
        buffer = Buffer.from(base64, 'base64');
        ext = mime.getExtension(contentType);
    } else {
        const res = await fileTypeFromBuffer(datauri_or_buffer);//=> {ext: 'png', mime: 'image/png'}
        contentType = res.mime;
        ext = res.ext;
    }

    const newName = `${filePath}.${ext}`;

    const storageBucket = admin.storage().bucket(DEFAULT_BUCKET);
    let bucketFile = await storageBucket.file(newName);
    const stream = bucketFile.createWriteStream({
        metadata: {
            contentType, // Set the content type according to your dataURI
        },
    });

    // Pipe buffer to write stream
    stream.end(buffer);

    return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', async () => {
            const gcsUri = "gs://" + DEFAULT_BUCKET + "/" + newName;
            const dlUrls = await bucketFile.getSignedUrl({
                action: 'read',
                expires: '03-17-2099'
            });
            resolve({gcsUri, dlUrls});
        });
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

//<editor-fold desc="sendRelay">
global.sendRelay = async (args) => {
    if(!args) return null;
    const {query, variables, operationName} = args;

    const result = await fetch(process.env.HASURA_RELAY_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-access-key": "rhespo-g",
            "X-Hasura-Role": "admin",
            // ...headers,
        },
        body: JSON.stringify({
            query,
            variables,
            operationName
        })
    });

    const {errors, data} = await result.json();
    if (errors) {
        // handle those errors like a pro
        console.error(errors);
        return null;
    }

    // console.log('sendRelay res', data);

    return data;
};
//</editor-fold>

//<editor-fold desc="listRelay">
global.listRelay = async ({query, operationName, variables}) => {
    const query_res = await sendRelay({
        query,
        operationName,
        variables,
    });
    if (!query_res) {
        return;
    }

    const key = Object.keys(query_res)[0];
    const connection = query_res[key];
    // console.log('connection', connection)
    const {edges = []} = connection;
    const nodes = edges.map(({cursor, node}) => {
        node = convertMutations(node);
        if (node.id) {
            return {data: node, id: node.id, cursor};
        } else {
            return node;
        }
    });
    // console.log("onCompleted nodes", nodes);
    return nodes;
};
//</editor-fold>

//<editor-fold desc="getRelayOne">
global.getRelayOne = async ({query, operationName, variables, multi_queries = false}) => {
    const query_res = await sendRelay({
        query,
        operationName,
        variables,
    });
    if (!query_res) {
        return;
    }

    if(multi_queries) {
        Object.keys(query_res).forEach(key => {
            const connection = query_res[key];
            const {edges = []} = connection;
            const nodes = edges.map(({cursor, node}) => {
                node = convertMutations(node);
                if (node.id) {
                    return {data: node, id: node.id, cursor};
                } else {
                    return node;
                }
            });

            query_res[key] = nodes;
        });
        return query_res;
    } else {
        const key = Object.keys(query_res)[0];
        const connection = query_res[key];
        const {edges = []} = connection;
        let [edge] = edges;
        let {node = null} = edge || {};
        if (node && node.id) {
            const id = convertIdToBigint(node.id);
            const data = {...node, id};
            node = {data, id};
        }
        return convertMutations(node);
    }
};
//</editor-fold>

//<editor-fold desc="insertRelay">
global.insertRelay = async ({query, operationName, input}) => {
    return await sendRelay({
        query,
        operationName,
        variables: {object: input}
    });
};
//</editor-fold>

//<editor-fold desc="updateRelay">
global.updateRelay = async ({mutation, operationName, id, attrs}) => {
    if(attrs.id) {
        delete attrs.id;
    }
    return await sendRelay({
        query: mutation,
        operationName,
        variables: {
            id: { id },
            _set: attrs,
        },
    });
};
//</editor-fold>
