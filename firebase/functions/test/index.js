// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

// Require and initialize firebase-functions-test in "online mode" with your project's
// credentials and service account key.
const projectConfig = {
    apiKey: "AIzaSyBsbSRsokaAGLjZCjPrCNrfK8OYU-2fJoQ",
    authDomain: "sheqsolve.firebaseapp.com",
    databaseURL: "https://sheqsolve.firebaseio.com",
    projectId: "sheqsolve",
    storageBucket: "sheqsolve.appspot.com",
    messagingSenderId: "208481828404",
    appId: "1:208481828404:web:b5c963cf7e24bf9d01d461",
    measurementId: "G-SN8C9ECS7H"
};

const test = require('firebase-functions-test')(projectConfig, './service-account-key.json');

describe('Cloud Functions', (done) => {
    this.timeout(1500);
    setTimeout(done, 1300);

    let testFunctions;

    before(() => {
        // Require index.js and save the exports inside a namespace called testFunctions.
        // This includes our cloud functions, which can now be accessed at testFunctions.makeUppercase
        // and testFunctions.addMessage
        testFunctions = require('../index');
    });

    after(() => {
        // Do cleanup tasks.
        test.cleanup();
        // Reset the database.
//        admin.database().ref('messages').remove();
    });

    describe('schedulers-notifications-taskRunner', () => {
//        this.timeout(5000); // this test can take up to 5 seconds
//
        // Test Case: setting messages/11111/original to 'input' should cause 'INPUT' to be written to
        // messages/11111/uppercase
        it('should upper case input and write it to /uppercase', (done) => {
            this.timeout(1500);
            setTimeout(done, 1300);
            // [START assertOnline]
            // Create a DataSnapshot with the value 'input' and the reference path 'messages/11111/original'.
//            const snap = test.database.makeDataSnapshot('input', 'messages/11111/original');

            // Wrap the makeUppercase function
            const wrapped = test.wrap(testFunctions['schedulers-notifications-taskRunner']);
//            // Call the wrapped function with the snapshot you constructed.
            return wrapped().then(() => {
                // Read the value of the data at messages/11111/uppercase. Because `admin.initializeApp()` is
                // called in functions/index.js, there's already a Firebase app initialized. Otherwise, add
                // `admin.initializeApp()` before this line.
//                return admin.database().ref('messages/11111/uppercase').once('value').then((createdSnap) => {
//                    // Assert that the value is the uppercased version of our input.
//                    assert.equal(createdSnap.val(), 'INPUT');
//                });
                return null;
            });
//            done();
            // [END assertOnline]
        });
    });

//    describe('addMessage', () => {
//        it('should return a 303 redirect', (done) => {
//            // A fake request object, with req.query.text set to 'input'
//            const req = {query: {text: 'input'}};
//            // A fake response object, with a stubbed redirect function which does some assertions
//            const res = {
//                redirect: (code, url) => {
//                    // Assert code is 303
//                    assert.equal(code, 303);
//                    // If the database push is successful, then the URL sent back will have the following format:
//                    const expectedRef = new RegExp(projectConfig.databaseURL + '/messages/');
//                    assert.isTrue(expectedRef.test(url));
//                    done();
//                }
//            };
//
//            // Invoke addMessage with our fake request and response objects. This will cause the
//            // assertions in the response object to be evaluated.
//            testFunctions.addMessage(req, res);
//        });
//    });
});