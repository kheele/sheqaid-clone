global.pdf = require('html-pdf');
global.path = require('path');
global.os = require('os');
global.fs = require('fs');
global.ejs = require("ejs");
global.fetch = require('node-fetch');
const {google} = require('googleapis');
global.google = google;

global.functions = require('firebase-functions');
global.admin = require('firebase-admin');

global.JWT_AUTH_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzHgB/IVaNk5aX\nufSD/4J7AGcDSCPWVplgc+kxLIy+hXJmTtX8H03HtTKPV609ATNCSBO6iJU1KulS\nurjX9c6Dj8aE8tNkqfVANV5CH0EdAlDXsV3LMBHZO4iORZ3dvBPAReOvGP1HyGPW\nofK9VptOrIKVSQBKGy2mGi+R6HScXHyt0t7bKi3FurzqpwJwwZ4V6zpuIqMfsqGW\nl7fOAvxcCO/KoGA2zjxHQUDEb23BUsdaZoyTR2hwzuJ1DutqIr6OCcC/qnmIR7nq\nSNMxZXYtmKT0b8gqdfwZ+/Qou/9oTLEvR92sRpb75weMuQD+Dsz40h0qLGcLHddZ\nyznBdZqHAgMBAAECggEAP+bjPHfTXj0aS9Uu0+zTSziwh640AuLwY0XXGxEOwWXw\nk2lq1EECyc3uVM9t4cbM18fJKhJSUR6XEUnGal2qqKshowrSuiYcdiTUFPj7jPLn\njpwbn0LuCzc/F6rkkFfqH/2PJkffDL4ESG2MoVoFnILVL5dUwBuEJK9Q61goSiPn\nZuwxbTXJVuxSsT5q92S9dIiWJ+1SZajxxkFzckuqjI/w1zxAvkI+C3JtXj/fjFzc\nGZRzTSDST1zxdbKwb+rY15wbvcIS7YeoUS816ij63z0bzDdYLbR+HdyBj7LFar+b\nbDtJjzT1H+Oq5qQGmH7ohI+rt7kdOvCbZa1XFKbUoQKBgQDrh9kRRhevWdRfSZrM\nnnfnSyg1hiPBeJ/16ZANQswaeeeExHbx5cGrZo0T6sR0+a/2LJrDj0Fie2ekJxDI\n20MhgktmDML9eRme87VFWIdmNqw63zEIA3gFJatPaLx1T1UV24p+1/WYJ/WLMna4\nT2twY0ooO7Yod8gpTgEZ0OO0MQKBgQDCrw0wpR8JEpeRzl1Z92L2108YCiErnR3S\nrJyFnYq4lLnsUdGeo+D/DPRqVTFJQLpoQpqrRZAyFNA5lB6sk0ho2MEcD4vYKsmH\nZ4g1tADK3NUEDltKXJz61l+bNgweX/5WqtTslNmXn6y9KBzvH8Tua6NN8WuDzkwS\n59uMIKMkNwKBgEjZ4RNNud+8Ckta6e2minHZNluv3PlnxRp8HtlrMtRxpmHTnvLd\nXRUWCEcD07ZW0M11KH2ant/GSd1lU/S8lTwVIBs1kU5zmbAns4b6hg7glE81X+YZ\npJL6/sz2GWyzmB7FpEXtqIJiwblHZ59EuXeuzm45YfOMcTYNcZu5l+TRAoGAbDmD\ny5b/ObvsJlHh8zFjAnWOsn5vEh+1hHgQSvbZNuL2uDiDnvzbBu3csX/Kdj5VYcAk\n2zFAh5aqale89ZKqnh5gu4io5PJkNbGINtJp3lwEzsxsU1pIqeiiHVZeRkR2zxcI\nZrwYegF5tW2nKAcxIpkTnzCl5A+6mofptGwwROECgYBL0v2fg2efV6y1SOpMwZy2\nVEH6/tu/cMiyUJmM4CkDKWsneuD1Vd5SGc2Q99CO56AqZGI+LOOCZkrEfQMu82Dg\nkjYlPx8CPev//xsE2ZNrzAAW6gEwPdwfc+nTift8jldJKHyFxfcMqNlXvX++XpDc\n5/+qRfQajYAXp22M7S93Ng==\n-----END PRIVATE KEY-----\n";
global.JWT_DEFAULT_SERVICE_ACCOUNT = "sheqaid-hr@appspot.gserviceaccount.com";

//
admin.initializeApp();
global.db = admin.firestore();
global.db.settings({ignoreUndefinedProperties: true});

const config1 = {
    apiKey: "AIzaSyBsbSRsokaAGLjZCjPrCNrfK8OYU-2fJoQ",
    authDomain: "sheqsolve.firebaseapp.com",
    databaseURL: "https://sheqsolve.firebaseio.com",
    projectId: "sheqsolve",
    storageBucket: "sheqsolve.appspot.com",
    messagingSenderId: "208481828404",
    appId: "1:208481828404:web:591b8752f906937101d461",
    measurementId: "G-H0YJ7PWJVG"
};
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
global.admin1 = admin.initializeApp(config1, "admin_1");
global.db1 = admin1.firestore();
global.db1.settings({ignoreUndefinedProperties: true});
global.admin2 = admin.initializeApp(config2, "admin_2");
global.db2 = admin2.firestore();
global.db2.settings({ignoreUndefinedProperties: true});

require('./libs/objects.util');
require('./libs/date-utils');
global.EmailUtils = require('./libs/email.util');

global.Counter = require("./libs/distributed_counter");

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

const callables = require('./fn/callables');
const firestore = require('./fn/firestore');

exports.callables = callables;
exports.firestore = firestore;
