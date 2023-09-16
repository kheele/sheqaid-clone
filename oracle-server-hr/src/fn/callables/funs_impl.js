// <editor-fold defaultstate="collapsed" desc="imports">
const fs = require('fs');
const path = require('path');
const os = require('os');
const mime = require('mime');

const {convertMutations} = require("../../graphql/convertMutations");
// </editor-fold>

//<editor-fold desc="addCustomUserClaims">
global.addCustomUserClaims = (uid, claims) => {
    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims = {}}) => {
        if (claims.access_type_list) {
            claims.access_type_list = {...(customClaims.access_type_list || {}), ...claims.access_type_list};
        }
        return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
    });
};
//</editor-fold>

//<editor-fold desc="setCustomUserClaims">
global.setCustomUserClaims = (uid, claims) => {
    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims}) =>
      _auth.setCustomUserClaims(uid, claims));
}
//</editor-fold>

global.isValidAccessType = (access_type) => access_type === "User" || access_type === "ContractorUser" || access_type === "Staff";

global.adminApp = (access_type) => {
    return {
        "User": admin,
        "ContractorUser": admin2,
        "Staff": admin_hr
    }[access_type];
}

global.adminAuth = (access_type) => {
    return {
        "User": admin,
        "ContractorUser": admin2,
        "Staff": admin_hr
    }[access_type].auth();
}

exports.createFaceUrl = (uid) => `faces/${uid}/face.png`;

//<editor-fold desc="uploadDataUri">
global.uploadDataUri = async (datauri, filePath) => {
    const parts = datauri.split(',');
    const contentType = parts[0].replace('data:', '').split(';')[0];
    const base64 = parts[1];
    const buffer = Buffer.from(base64, 'base64');

    const ext = mime.getExtension(contentType);
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

//<editor-fold desc="sendRelay">
global.sendRelay = async (args) => {
    if(!args) return null;
    const {query, variables, operationName} = args;

    const API_URL = "http://cloud.sheqaid.com:8080/v1beta1/relay";
    const result = await fetch(API_URL, {
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
