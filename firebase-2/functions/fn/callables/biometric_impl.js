// <editor-fold defaultstate="collapsed" desc="imports">
const faceapi = require('face-api.js');
// </editor-fold>

const {loadFaceModels, loadImage, createFaceUrl, deleteTmpImage} = require('./funs_impl');

// <editor-fold defaultstate="collapsed" desc="onLoginBiometric">
exports.onLoginBiometric = ({funs, access_type, tbl}) => {
    const {getDBUser} = funs;
    return async (data, ctx) => {
        await authorize();
        if (data) {
            console.log('onLoginBiometric', JSON.stringify(data))
            const {username, match, displaySize} = data;
            return admin.auth().getUserByEmail(username).then(async (userRecord) => {
                if (!userRecord) {
                    return "NO_USER_AUTH";
                }

                const {uid, email, phoneNumber} = userRecord;

                let user_res;
                if (access_type === 'ContractorUser') {
                    user_res = await getDBUser(tbl, uid);
                } else {
                    user_res = await getDBUser(uid);
                }

                if (!user_res) {
                    return "NO_USER_DB";
                }

                const {db_user} = user_res;
                const {auth_type = "MultiFactor", has_biometric} = db_user.data;
                if (auth_type === "Biometric") {
                    if (!has_biometric) {
                        return "SETUP_BIOMETRIC";
                    }
                } else {
                    return "NO_BIOMETRIC_PERMISSION";
                }

                try {
                    await loadFaceModels();
                } catch (err) {
                    console.error(err)
                    return "ERR_LOAD_MODELS";
                }

                const currentCustomClaims = {
                    tbl
                };
//            await admin.auth().setCustomUserClaims(uid, currentCustomClaims);
                await setCustomUserClaims(uid, currentCustomClaims);

                const storageBucket = admin.storage().bucket('sheqsolve-biometrics');
                const facePath = createFaceUrl(uid);
                let bucketFile = await storageBucket.file(facePath);

                const userImage = await loadImage(bucketFile, uid);

                //remove custom claims
                currentCustomClaims.tbl = null;
//            await admin.auth().setCustomUserClaims(uid, null);
                await setCustomUserClaims(uid, currentCustomClaims);

                console.log('onLoginBiometric userImage', userImage, userImage.width, userImage.height)
                const detection = await faceapi.detectSingleFace(userImage).withFaceLandmarks().withFaceDescriptor();
                console.log('onLoginBiometric detection', !!detection, displaySize)
                if (detection) {
                    const resizedDetection = faceapi.resizeResults(detection, displaySize);
                    const faceMatcher = faceapi.FaceMatcher.fromJSON(match);
                    const bestMatch = faceMatcher.findBestMatch(resizedDetection.descriptor);
                    const {label, distance} = bestMatch;
                    console.log('onLoginBiometric label, distance', label, distance)

                    deleteTmpImage(uid);

                    if (label === "unknown") {
                        return "UNKNOWN_DETECTION";
                    } else {
                        try {
                            const token = await admin.auth().createCustomToken(uid, {access_type});
                            return {token};
                        } catch (err) {
                            console.error(err)
                            return "ERR_CREATING_TOKEN";
                        }
                    }
                } else {
                    deleteTmpImage(uid);
                }

                return "NO_DETECTION";
            });
        } else {
            return null;
        }
    };
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onSetupBiometric">
exports.onSetupBiometric = ({funs, access_type, tbl}) => {
    const {getDBUser} = funs;
    return async (data, ctx) => {
        await authorize();
        if (data) {
            const {uid, imgSrc} = data;
            return admin.auth().getUser(uid).then(async (userRecord) => {
                if (!userRecord) {
                    return "NO_USER_AUTH";
                }

                const {uid, email, phoneNumber} = userRecord;

                let user_res;
                if (access_type === 'ContractorUser') {
                    user_res = await getDBUser(tbl, uid);
                } else {
                    user_res = await getDBUser(uid);
                }

                if (!user_res) {
                    return "NO_USER_DB";
                }

                const storageBucket = admin.storage().bucket('sheqsolve-biometrics');
                const facePath = createFaceUrl(uid);
                let bucketFile = await storageBucket.file(facePath);
                try {
                    const base64 = imgSrc.split(',')[1];
                    const buffer = Buffer.from(base64, 'base64');//data_url
                    await bucketFile.save(buffer, {
                        metadata: {
                            contentType: 'image/png',
                            metadata: {
                                faceTable: tbl,
                                faceUserId: uid
                            },
                            public: false,
                            validation: 'md5'
                        }
                    });
                } catch (err) {
                    console.error(err)
                    return "ERR_UPLOAD";
                }

                try {
                    const {doc_ref} = user_res;
                    await doc_ref.set({has_biometric: true}, {merge: true});
                } catch (err) {
                    return "ERR_UPDATE_USER";
                }
                try {
                    const token = await admin.auth().createCustomToken(uid, {access_type});
                    return {token};
                } catch (err) {
                    console.error(err)
                    return "ERR_CREATING_TOKEN";
                }
            });
        } else {
            return null;
        }
    };
};
// </editor-fold>