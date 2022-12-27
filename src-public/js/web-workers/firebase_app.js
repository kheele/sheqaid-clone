((self) => {
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

    // Polyfill instantiateStreaming for browsers missing it
//    if (!WebAssembly.instantiateStreaming) {
//        WebAssembly.instantiateStreaming = async (fetchPromise, importObject) => {
//            const bytes = await fetchPromise.then(res => res.arrayBuffer());
//            return await WebAssembly.instantiate(bytes, importObject);
//        };
//    }
//
//    console.time('WebAssembly.instantiateStreaming');
//    WebAssembly.instantiateStreaming(fetch(self.locationRoot + "/wasm/sheq_aid_wasm.wasm"), {}).then(instantiatedModule => {
//        const {exports} = instantiatedModule.instance;
//        self.wasmExports = exports;
////        console.log('wasmExports', wasmExports)
//        console.timeEnd('WebAssembly.instantiateStreaming');
//    });

    if (isWorker) {
        importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/app.js");
        importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/auth.js");
        importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/functions.js");
        importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/firestore.js");
        importScripts(self.locationRoot + "/js/lib/firebase-8.0.2/storage.js");
        //importScripts(self.locationRoot + "/js/lib/firebase-9.2.0/app-check.js");
    }

    console.time('firebase.initializeApp');

    const createApp = ({name, appName, db, auth, functions, storage}, config) => {
        try {
            self[appName] = firebase.initializeApp(config, name);
            const app = self[appName];
            const authGeneralApp = firebase.initializeApp(config, `authGeneral-${name}`);

            self[auth] = app.auth();
            self[auth].setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            self[`${auth}General`] = authGeneralApp.auth();

            if (functions) {
                self[functions] = app.functions();
            }

            self[db] = app.firestore();
            self[db].settings({ignoreUndefinedProperties: true, cacheSizeBytes: self[db].CACHE_SIZE_UNLIMITED});
            self[db].enablePersistence({experimentalForce: true});

            if (isWorker) {
                if (storage) {
                    self[storage] = app.storage();
                }

                // app.functions().useEmulator("localhost", 5002);
                // self[db].useEmulator("localhost", 8081);
            }
        } catch (e) {
            console.log(`Firestore ${name} already started`, e)
        }
    };

    createApp({
        name: 'sheqaid',
        appName: 'firebase_app_1',
        db: 'db',
        auth: 'auth',
        functions: 'functions',
        storage: 'storage'
    }, {
        apiKey: "AIzaSyBsbSRsokaAGLjZCjPrCNrfK8OYU-2fJoQ",
        authDomain: "sheqsolve.firebaseapp.com",
        databaseURL: "https://sheqsolve.firebaseio.com",
        projectId: "sheqsolve",
        storageBucket: "sheqsolve.appspot.com",
        messagingSenderId: "208481828404",
        appId: "1:208481828404:web:591b8752f906937101d461",
        measurementId: "G-H0YJ7PWJVG"
    });

    createApp({
        name: 'sheqaid2',
        appName: 'firebase_app_2',
        db: 'db2',
        auth: 'auth2',
        functions: 'functions2',
        storage: 'storage2'
    }, {
        apiKey: "AIzaSyDSnhxZ4F-zk_z4b6JNiKi5ROampjwkNx0",
        authDomain: "sheqassist-8e36a.firebaseapp.com",
        databaseURL: "https://sheqassist.firebaseio.com",
        projectId: "sheqassist-8e36a",
        storageBucket: "sheqassist-8e36a.appspot.com",
        messagingSenderId: "488697177698",
        appId: "1:488697177698:web:ffa7e66e3a80f62d2e533b",
        measurementId: "G-G8Y9C953WC"
    });

    createApp({
        name: 'sheqaid-hr',
        appName: 'firebase_app_hr',
        db: 'db_hr',
        auth: 'auth_hr',
        functions: 'functions_hr',
        storage: 'storage_hr'
    }, {
        apiKey: "AIzaSyADbOHcROu1cf-p74TVCwZPkipX8z87yWI",
        authDomain: "sheqaid-hr.firebaseapp.com",
        // databaseURL: "http://localhost:8081/emulator/v1/projects/sheqaid-hr",
        databaseURL: "https://sheqaid-hr.firebaseio.com",
        projectId: "sheqaid-hr",
        storageBucket: "sheqaid-hr.appspot.com",
        messagingSenderId: "880045394004",
        appId: "1:880045394004:web:b5f807f0c51ae81f2c05c1",
        measurementId: "G-N9D0H4FRKH"
    });

    console.timeEnd('firebase.initializeApp');

    if (isWorker) {
        const {FieldPath, FieldValue, Timestamp} = firebase.firestore;
        self.FBSettings = {
            FieldPath, FieldValue, Timestamp
        };
    }
})(self || window);