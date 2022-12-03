global.pdf = require('html-pdf');
global.path = require('path');
global.os = require('os');
global.fs = require('fs');
global.ejs = require("ejs");
global.fetch = require('node-fetch');
const {google} = require('googleapis');
global.google = google;

global.functions = require('firebase-functions');

global.JWT_AUTH_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5G/KvZxHn+cEL\ndSfhKbGgijjhk/iAwBe9gEDGGoWr21KVwuwItjEV4F0/cTze1o2EqbVIg3FBWNsK\nX+LO3zBDG8rGntT/SgbDFftNqUq8n3pkSCPwqbWMEXfu6qm82is864oUckLSUiBJ\neOQVibzlC1+L235wpxlRoQD6gjBRkYrO3KNhhiq9BR8OQ6ROz1zuK01c0BBpK1ky\nOq0vnk1MxXAK6Fq2fCMv8rWAFBdprjome1uZGPgZ4NGQvVcJJwXoyxJhXJus9cGm\nHQ10k7Usa59j4S0LWHYgihCMqVVZo5pJaPXzB6vVBBhQtwvmEeaHGyFA/RJvlQzL\nNGI6KtsdAgMBAAECggEAC91DNkPUbXpgCaR2LGPYOzJwx+CMjnABdYdpX2kmxSeX\nCPtH1p0a00ygnWbcIGo/AtA/ysiF80rHK0iPCHRcqwh2fDmE7GHpwgpAI6+klydf\nmFrZVt0BwlsCRWFsBKs1Fz//hyT1rHZQFHV3pPvBjCqo8pVcassC/+ziW6wJfcjK\n0pGFd5+BnPfQDlXLmB3aiT9eP5ZVzPAxyF7olBI/8UKVk2na35sbBasr46nGbKFr\nADBjvngvJXa2/NeJGVtwur7gFxh6ubPfsLWspcLGcdtzV6Mxdi/9aZHsifVG/ouT\nutMMH4aF7AOl9HWJV++dbEQ6A3q/5uwaCO7dNpLtzwKBgQDqJ4+zIVQsmHn8Q5+E\nEFWOoOxXefaxayuKT1dbfZiDmw5Fq/vBu86Yr5CboAzWkjR/HcWIC2PtlFjAIGDx\nmJRuMXTK8nYFVJ8Y5FZ/J39mfrJE62A7fPm5faQbAid7ZcULAKSj93LwWkL1FGwz\niW6OmLRVbu5+ehAiiUErpCHvZwKBgQDKYQKFtbrFCeo9Q2Hp006WInfiLFA4jLPb\naBJm/zhXTLKDYZwpuezLVJUUAQUlNXZmrfBt4AxmHPVI5UCUEb1XIirdmpBMxfE4\n+n5InUHhuys3mtBJwEGwv5U7Dl+Ky7PCbFeJUQRjE4oi9Gh5/XG+JLmagNyrzwBs\nSCwwITHC2wKBgQDOsYtkyYffMd2EdEEMN8r+c0kNUukT5hFyLuVjKrQFgEsR72X1\ntw4AtAGHjrmmczsJ9sLWe4+DOc86EZrhyRlFSDzbpTnPLMqgE3fTGI+abz54Hfo9\nqO1b8u94s+ccQ1KziqbK4nTAfDzc0GFPAQLptxyAycKXPLKfed9gYatfAwKBgCEc\n3E/KW0PQCn55nvSmOU6BV0IvY/TMuMTmc1Rc3/gQuYibmPSO0jq2nSnHvPLIm5XT\nUep4ZS70AAIsWHOhr2wpUAAwQPn+zSg4fB8fc98eQ8T2VKwsg9MKlb0y7dkE2WWv\nWmdCVUhsswZjHREQseKdmay49uI5nWUaLfi2BbFPAoGBALXcbBlJf10UieiML4AN\niwbI5rqNDxZHJWdczl/fiOydKfL3Na/sCmolHXw37w+MOcFoLuIFP+QrLpVRorEa\n/vXvW1B9xE2zYgZY+0d5tsnLZgr/yscjIdzd2G9UCsJRd+259OPMPe1ykyjkrvBg\n6L3wnhU1oPNaGOk0h+onhfbp\n-----END PRIVATE KEY-----\n";
global.JWT_DEFAULT_SERVICE_ACCOUNT = "sheqsolve@appspot.gserviceaccount.com";

//

const config2 = {
    apiKey: "AIzaSyDSnhxZ4F-zk_z4b6JNiKi5ROampjwkNx0",
    authDomain: "sheqassist-8e36a.firebaseapp.com",
    databaseURL: "https://sheqassist.firebaseio.com",
    projectId: "sheqassist-8e36a",
    storageBucket: "sheqassist-8e36a.appspot.com",
    messagingSenderId: "488697177698",
    appId: "1:488697177698:web:ffa7e66e3a80f62d2e533b",
    measurementId: "G-G8Y9C953WC"
};
const config_hr = {
    apiKey: "AIzaSyADbOHcROu1cf-p74TVCwZPkipX8z87yWI",
    authDomain: "sheqaid-hr.firebaseapp.com",
    databaseURL: "https://sheqaid-hr.firebaseio.com",
    projectId: "sheqaid-hr",
    storageBucket: "sheqaid-hr.appspot.com",
    messagingSenderId: "880045394004",
    appId: "1:880045394004:web:b5f807f0c51ae81f2c05c1",
    measurementId: "G-N9D0H4FRKH"
};

global.admin = require('firebase-admin');
admin.initializeApp();
global.admin2 = admin.initializeApp(config2, "admin_2");
global.admin_hr = admin.initializeApp(config_hr, "admin_hr");

global.db = admin.firestore();
global.db2 = admin2.firestore();
global.db_hr = admin_hr.firestore();

global.db.settings({ignoreUndefinedProperties: true});
global.db2.settings({ignoreUndefinedProperties: true});
global.db_hr.settings({ignoreUndefinedProperties: true});

require('./libs/objects.util');
require('./libs/date-utils');
global.EmailUtils = require('./libs/email.util');
global.DriveUtils = require('./libs/drive.utils');

require('./libs/face.util');

global.authorize = () => {
    // Please set the email and private key of service account.
    //authenticate request
    const auth = new google.auth.JWT(
            JWT_DEFAULT_SERVICE_ACCOUNT,
            null,
            JWT_AUTH_KEY,
            [
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/script.projects",
                "https://www.googleapis.com/auth/iam",
                "https://www.googleapis.com/auth/cloud-platform"
            ]
            );
    return new Promise((resolve, reject) => {
        auth.authorize((err, tokens) => {
            if (err) {
                reject(err);
            } else {
                resolve(auth);
            }
        });
    });
};
global.onDriver = () => {
    return authorize().then(auth => google.drive({auth, version: 'v3'}));
};

const schedulers = require('./fn/schedulers/index.js');

const {execFun} = require('./fn/controllers.js');
const {getDoc, updateDoc} = require('./fn/https');

const callables = require('./fn/callables');
const firestore = require('./fn/firestore');

exports.schedulers = schedulers;
//exports.covidScreeningDailyCheck = covidScreeningDailyCheck;
//exports.incidentsTest = incidentsTest;

//callbale
exports.execFun = execFun;
//http
exports.getDoc = getDoc;
exports.updateDoc = updateDoc;

exports.callables = callables;
exports.firestore = firestore;
