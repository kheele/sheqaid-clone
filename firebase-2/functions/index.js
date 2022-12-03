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

global.JWT_AUTH_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDoHExmQDaJt7o/\ncwW3lAk0DVZgbJ44dATIGK7IfJi0pcIzB68ttrFgLxT0ck7VKGNUlcIcl3hsBYlu\n3K29XJqbGbb7iSWRFUpSsakgdMY7RgNqQAe1UtnPeDuSDsmC/bNHksZ6tHzQSobg\nLCJujS23mpQoe+OjJlRi6MSIOU1yDChroriAWGCtdCLBO2OeLBf4nMKOKscCdz/a\n2hsMD2YFZ+JUW5x72E6Cn6Y5ZXKh69x0OYZhh1zY9B8QCyYWBWM2yEgVHAd0aNNK\nMgM/hDk9LKvwDuD/nQILCnFDf2U30MalKIG32+WGLWMq5FWyZvl3BBzetBewI5hT\njjN9vndlAgMBAAECggEATKRLddfuKjtIfHr2gE+ZWl6tDtnOxMVKbuf3jqvVoJC7\nNy5qYaXZm/Dv8mdsMGZNpjhtCBPb549MehbUJ5rUUjKDgTsf9HAbQoL3XYgxjJDp\nv8O0x+K7mQ4SXYAUefRbpl6Iuyutqvlw38Sy+d4UInQgR93gpJabdq11d6W0NNu9\n30tlJi9cFK36HoybaOqL1DIgZOqzB8J1RmbxpFfMG4OwJ+EoQsJf88Tzt0s5KNKY\nFSnKfowZWGviylq46sr5Jk6Mq72qV1sf8dIAVaDDJBnAO5u8IKgs8JlKmHMf6prr\nchpe0aU0somoTedfkUoohlwfuZM1Ilwnmhm5+xeDYQKBgQD2hVAQbuaQmZL9KH7c\n5POr1V1pv7eH8ux5sPj/Fyq4qO+63ZamwE2LO5lmluU/RDO4lJS1YzSmDohRAE+Q\nO6RCqely1CRyFLgwd/8Ir1TlcCkNyM7xnoPhZfphITYlEz4J9NirnwUA+dPzduDb\n6vPKqSrY9UUkMduDT5R1uYJ6JwKBgQDxCSKfJ0DDQOdQCUcmaOVF0tP4qfoz9XOH\nH5u85k0/ooFKcDlFLvibdMWdqACfBJ57awaVRZpzu4A1hfeMUud3+2m6ic/biXS8\nydkLsoarqdhQ9Wwihv9p+zSmlxkrWVk4Ikih/22sVds/iW35oRm6G34maVn02NYc\n5CkzuZ31kwKBgQDQfdFIBLNFSk1RhGU+5vfatRpK7JUJCn/LL8x22Z4NDPurW+sk\n3nD2t5I2fJooFsNzcV4PxnZpltLdRtkDkB2NL+y7bAXi4fkhLOtp6fdwEJr4CIRV\nPw4knD3U1eTYGF0YyJZTF6uAtsn2F+12sVA8bzRIx68RPIV9mdlic2GRcwKBgQDj\nsUKAX99A003vgGQy94Il/Gv7Ce7uKF7S9Vv0DQZKJ6PFAtBG94EnsR6AuNSlYwKn\nCco1NoQZ8bTCWuQnLaW05M3Sxh6Rf37EXFTpROMMxKwwhjZ5Q1eB8SiiejfviD7M\n1S4Rwi4DTzOHCLbXyoR4F0KK3Jh6wF86+ZmmYCDEewKBgBP6tzqxdrsnXwAo6dxf\nQXlXfM4FSKBaByw/cP0T7WsGB3jO9gFAcUsjjY7hZH3PUnXGtE36WfDYl2QerWvi\nfOGoLvu8FLOdbzqC5dHbzboWnq79UqioujYUBrK75VZ4rR7BViXg+dpCxhoxkbDb\nyj/2+9ZlIxkWS3NUvZw4LxHb\n-----END PRIVATE KEY-----\n";
global.JWT_DEFAULT_SERVICE_ACCOUNT = "sheqassist-8e36a@appspot.gserviceaccount.com";

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
global.admin1 = admin.initializeApp(config1, "admin_1");
global.db1 = admin1.firestore();
global.db1.settings({ignoreUndefinedProperties: true});
global.admin_hr = admin.initializeApp(config_hr, "admin_hr");
global.db_hr = admin_hr.firestore();
global.db_hr.settings({ignoreUndefinedProperties: true});

require('./libs/objects.util');
require('./libs/date-utils');
global.EmailUtils = require('./libs/email.util');

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
