// <editor-fold defaultstate="collapsed" desc="imports">
import React, {lazy, Suspense} from 'react';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import 'react-grid-calendar/lib/styles/index.css';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";

import 'exceljs';

import './test/test1';

import './utils/app-menu';
import './utils/auto-updater';
import './utils/file-utils-win-msw';
import './utils/file-utils-win-ext';
import './utils/windowVars';
import './utils/app-logged-in-fn';
import './utils/app-logged-out-fn';
import './utils/workerEvents';

import './utils/firebase-posgresql-transfer';//todo: remove after all transfers from firebase to posgresql

import './App.css';

import {execWhen} from './utils/Utils';

import storage from './storage/Storage';

import pluginManager from './app/PluginManager';
import moduleManager from './app/ModuleManager';
import staticModuleManager from './app/StaticModuleManager';

import {Button} from './components/inputs';

import ChatBox from './components/popovers/ChatBox';
import ChatBoxClaims from './components/popovers/ChatBoxClaims';
import Popover from './components/popovers/Popover';
import {
    AccountPaymentDueDialog,
    AutoUpdateDialog,
    ConfirmDialog,
    DateDialog,
    InfoDialog,
    InputDialog,
    NoProjectsDialog,
    ProgressDialog,
    TrailExiredDialog,
    CookieNoticePanelDialog,
} from './components/dialogs';
import {ErrorBoundary, PageLoadingProgress} from './components';

const LoggedInFormsApp = lazy(() => import('./views/LoggedInFormsApp'/* webpackChunkName:"LoggedInFormsApp" */));
const LoggedInApp = lazy(() => import('./views/LoggedInApp'/* webpackChunkName:"LoggedInApp" */));
const LoggedOutFormsApp = lazy(() => import('./views/LoggedOutFormsApp/index.js'/* webpackChunkName:"LoggedOutFormsApp" */));
const LoggedOutApp = lazy(() => import('./views/LoggedOutApp/index.js'/* webpackChunkName:"LoggedOutApp" */));

const LoggedInAdminApp = lazy(() => import('./views/LoggedInAdminApp'/* webpackChunkName:"LoggedInAdminApp" */));
const LoggedOutAdminApp = lazy(() => import('./views/LoggedOutAdminApp/index.js'/* webpackChunkName:"LoggedOutAdminApp" */));

// const theme = createMuiTheme({});

// </editor-fold>

@observer
class App extends React.Component {

    @observable _isConnected = false;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        window.app = this;
        window.pluginManager = pluginManager;
        window.moduleManager = moduleManager;
        window.staticModuleManager = staticModuleManager;
        window.isFormsApp = this.isFormsApp;
        window.isAdminApp = this.isAdminApp;

        // window.socket = io("http://localhost:5000");
        // window.socket = io("https://cloud.sheqaid.com:5000");
        window.socket = io("https://cloud.sheqaid.com", {
            withCredentials: true,
            transports: ['websocket'], // Only allow WebSocket transport
        });
        // window.socket = io("https://server.cloud.sheqaid.com");
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        this.onConnected = this.onConnected.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {

    }

    componentDidMount() {
        // console.log(Dates.formatDate(1677758520136), );

        window.pluginManager.start();
        storage.load.loadPermissionOtherKeys();

        execWhen(() => this.refs.cookieNoticePanelDialog).then(ref => {
            ref.open();
        });
        execWhen(() => this.refs.popover).then(popover => {
            window.popover = popover;
        });
        execWhen(() => this.refs.infoDialog).then(infoDialog => {
            window.infoDialog = infoDialog;
        });
        execWhen(() => this.refs.confirmDialog).then(confirmDialog => {
            window.confirmDialog = confirmDialog;
        });
        execWhen(() => this.refs.progressDialog).then(progressDialog => {
            window.progressDialog = progressDialog;
        });
        execWhen(() => this.refs.dateDialog).then(dateDialog => {
            window.dateDialog = dateDialog;
        });
        execWhen(() => this.refs.inputDialog).then(inputDialog => {
            window.inputDialog = inputDialog;
        });
        execWhen(() => this.refs.autoUpdateDialog).then(autoUpdateDialog => {
            window.autoUpdateDialog = autoUpdateDialog;
        });
        execWhen(() => this.refs.noProjectsDialog).then(noProjectsDialog => {
            window.noProjectsDialog = noProjectsDialog;
        });

        execWhen(() => this.refs.chatBox).then(chatBox => {
            window.chatBox = chatBox;
        });
        execWhen(() => this.refs.chatBoxClaims).then(chatBoxClaims => {
            window.chatBoxClaims = chatBoxClaims;
        });

        execWhen(() => document.querySelector('#root-bg')).then(el => {
            const rootBg = $(el);
            let n = 1;

            function change() {
                rootBg.attr('class', 'sheq_assist_bg' + n);
//                rootBg.attr('class', 'human_resource_bg' + n);
                if (n === 5) {
                    n = 1;
                } else {
                    n++;
                }
                setTimeout(change, 10000);
            }

            change();

            //check updates
        });

        this.onConnected();
        setInterval(this.onConnected, 2000);

        if (storage.list.countries.isEmpty()) {
            storage.load.loadCountries();
            pluginManager.start();
        }
//        (function(w, d, s, u) {
//		w.RocketChat = function(c) { w.RocketChat._.push(c) }; 
//                w.RocketChat._ = []; 
//                w.RocketChat.url = u;
//		var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
//		j.async = true; 
//                j.src = 'https://rhespo.rocket.chat/livechat/rocketchat-livechat.min.js?_=201903270000';
//		h.parentNode.insertBefore(j, h);
//	})(window, document, 'script', 'https://rhespo.rocket.chat/livechat');
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="restart">
    restart() {
        if (window.electronRemote) {
            electronRemote.getCurrentWindow().webContents.session.clearCache(async () => {
                //
                storage.update.updateDBUser(storage.loggedUser);
                localStorage.setItem("loggedUserRestarting", true);

                const {app} = electronRemote;
                app.relaunch({args: electronRemote.process.argv.slice(1).concat(['--relaunch'])});
                app.exit(0);
            });
        } else {
            storage.update.updateDBUser(storage.loggedUser);
            localStorage.setItem("loggedUserRestarting", true);
            const {location} = document;
            document.location = location;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onConnected">
    onConnected() {
        this._isConnected = navigator.onLine;
    }

    // </editor-fold>

    @computed get isConnected() {
        return this._isConnected;
    }

    // <editor-fold defaultstate="collapsed" desc="isFormsApp">
    get isFormsApp() {
        if (document.location.hostname === 'forms.sheqaid.com') {
            return true;
        }
        let loc = document.location.toString().replace("index.html", "");
        if (loc.contains('#')) {
            loc = loc.replace(document.location.hash, "").replace("#", "");
        }
        return loc.contains('~forms/') || loc.contains('~forms');
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="isAdminApp">
    get isAdminApp() {
        if (document.location.hostname === 'admin.sheqaid.com') {
            return true;
        }
        let loc = document.location.toString().replace("index.html", "");
        if (loc.contains('#')) {
            loc = loc.replace(document.location.hash, "").replace("#", "");
        }
        return loc.contains('~admin/') || loc.contains('~admin');
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return (<ThemeProvider theme={theme}>
            <CssBaseline/>
            <div>
                <Popover ref="popover"/>
                <InfoDialog ref="infoDialog"/>
                <ConfirmDialog ref="confirmDialog"/>
                <ProgressDialog ref="progressDialog"/>
                <DateDialog ref="dateDialog"/>
                <InputDialog ref="inputDialog"/>
                <AutoUpdateDialog ref="autoUpdateDialog"/>
                <NoProjectsDialog ref="noProjectsDialog"/>
                <CookieNoticePanelDialog ref="cookieNoticePanelDialog"/>

                <ChatBox ref="chatBox"/>
                <ChatBoxClaims ref="chatBoxClaims"/>

                <NetworkStatus/>

                <AppMain/>
                <AppAdmin/>
            </div>
        </ThemeProvider>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="AppMain">
@observer
class AppMain extends React.Component {
    render() {
        if (isAdminApp) return null;
        return <React.Fragment>
            <AccountPaymentDueDialog ref="accountPaymentDueDialog"/>
            <TrailExiredDialog ref="trailExiredDialog"/>
            <ErrorBoundary>
                <AppMainContent/>
            </ErrorBoundary>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AppAdmin">
@observer
class AppAdmin extends React.Component {
    render() {
        if (!isAdminApp) return null;
        return <React.Fragment>
            <ErrorBoundary>
                <AppAdminContent/>
            </ErrorBoundary>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AppContent">
@observer
class AppMainContent extends React.Component {
    render() {
        const {isLoggedUserAuthChecked, isLoadedCountries, isLoadedPermissionOtherKeys} = storage.is;
        // alert(isLoggedUserAuthChecked)
        // console.log('AppMainContent', isLoggedUserAuthChecked, isLoadedCountries, isLoadedPermissionOtherKeys)
        if (isLoggedUserAuthChecked && isLoadedCountries && isLoadedPermissionOtherKeys && pluginManager.isLoaded) {
            return <Suspense fallback={<PageLoadingProgress/>}>
                <React.Fragment>
                    <LoggedInFormsApp/>
                    <LoggedInApp/>
                    <LoggedOutFormsApp/>
                    <LoggedOutApp/>
                </React.Fragment>
            </Suspense>;
        }
        return <PageLoadingProgress text="Loading components..."/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AppAdminContent">
@observer
class AppAdminContent extends React.Component {
    render() {
        const {isLoggedUserAuthChecked, isLoadedCountries} = storage.is;
        if (isLoggedUserAuthChecked && isLoadedCountries) {
            return <Suspense fallback={<PageLoadingProgress/>}>
                <React.Fragment>
                    <LoggedInAdminApp/>
                    <LoggedOutAdminApp/>
                </React.Fragment>
            </Suspense>;
        }
        return <PageLoadingProgress text="Loading components..."/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NetworkStatus">
@observer
class NetworkStatus extends React.Component {
    render() {
        let className = storage.is.isLoggedIn ? "loggedin" : "loggedoff";
        className += (app.isConnected ? " online" : " offline");
        return <Button key={new Date().getTime()} className={"NetworkStatus btn " + className}
                       text={app.isConnected ? "Online" : "Offline"}/>
    }
}

// </editor-fold>

export default App;