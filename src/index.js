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