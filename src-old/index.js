import 'react-hot-loader/patch';
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import {createRoot} from "react-dom/client";
import {MaterialUIControllerProvider} from "context";
import './utils/objects.util.js';
import "./constants";
import './utils/app-fn';

import App from './App';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById("root"));

const render = Component => {
    root.render(
        <AppContainer>
            <MaterialUIControllerProvider>
                <Component/>
            </MaterialUIControllerProvider>
        </AppContainer>
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
        render(App);
    });
}

// ReactDOM.render(
//     <App />,
//     document.getElementById("root")
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
//serviceWorker.register();

//Testing purpses
// Polyfill instantiateStreaming for browsers missing it
if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (fetchPromise, importObject) => {
        const bytes = await fetchPromise.then(res => res.arrayBuffer());
        return await WebAssembly.instantiate(bytes, importObject);
    };
}

//const questions = {
//    1: 1,
//    2: {
//        a: [1,2,3]
//    }
//};
//const ser = serialize(questions);
//console.log('serialize questions', ser)
//console.log('deserialize questions', deserialize(ser))
//
//console.time('WebAssembly.instantiateStreaming');
//WebAssembly.instantiateStreaming(fetch("wasm/sheq_aid_wasm.wasm"), {}).then(instantiatedModule => {
//    const {exports} = instantiatedModule.instance;
//
//    const questions = {
//        1: 1,
////        2: 1
//    };
//    console.log('quesPath', serialize(questions))
//    const res = exports.value_path(serialize(questions), serialize(1));
//    const quesPath = deserialize(res);
//    console.log('quesPath', quesPath)
//    console.log('exports', exports)
//    console.timeEnd('WebAssembly.instantiateStreaming');
//});