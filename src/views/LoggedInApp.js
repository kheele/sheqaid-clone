import React from 'react';
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';
import EventListener from 'react-event-listener';

import {ErrorBoundary} from '../components';
import {execWhen, isMobile} from '../utils/Utils';

import Header from './header';
import InitView from './InitView';
import DefaultView from './DefaultView';
import MainView from './MainView';

import EditUserDialog from './default/Users/EditDialog';
import ModuleSetupDialog from '../components/module-management/ModuleSetupDialog';
import TimeActiveSessionExpiredDialog from '../components/dialogs/TimeActiveSessionExpiredDialog';

import style from './LoggedInApp.lazy.css';

@observer
class LoggedInApp extends React.Component {

    @observable
    state = {
        timeActiveSessionExpired: false,
        defaultView: null
    };

    constructor() {
        super();

        window.loggedInApp = this;
        this.openAuth = this.openAuth.bind(this);
        this.updateLastTimeActive = this.updateLastTimeActive.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentWillMount() {
//        style.use();
    }

    componentDidMount() {
        autorun(() => {
            if (storage.is.isLoggedIn) {
                style.use();
                this.updateLastTimeActive();

                const {
                    is: {hasPaymentInterval, isConsultant, isContractor},
                    selected: {selectedClient, selectedClientModules: {list}},
                    list: {clients}
                } = storage;
                
                if(isContractor) {
                    return;
                }

                console.log('LoggedInApp', list.slice(), selectedClient)
                
                const openModuleSetupDialog = () => {
                    if (/*!hasPaymentInterval || */list.isEmpty()) {
                        execWhen(() => this.refs.moduleSetupDialog).then(dialog => {
                            console.log('LoggedInApp', list.length, selectedClient)
                            dialog.open();
                        });
                    }
                };
                
                if(selectedClient) {
                    openModuleSetupDialog();
                } else if(isConsultant && !clients.isEmpty()) {
//                    openModuleSetupDialog();
                }
            } else {
                style.unuse();
            }
        });
    }

    componentWillUnmount() {
//        style.unuse();
    }

    set defaultView(val) {
        window.defaultView = val;
        this.state.defaultView = val;
    }

    @computed get defaultView() {
        return this.state.defaultView;
    }

    @computed
    get isDefaultOverMainView() {
        const {defaultView, mainView} = this;
        return !(!defaultView || !defaultView.isOpen || (defaultView.isOpen && (mainView && !mainView.isOpen)));
    }

    @computed
    get topView() {
        if (!this.hasView)
            return null;
        const {defaultView, mainView} = this;
        return defaultView && defaultView.isOpen ? defaultView : mainView;
    }

    @computed
    get hasView() {
        const {defaultView, mainView} = this;
        return (defaultView && defaultView.isOpen) || (mainView && mainView.isOpen);
    }

    openAuth() {
        this.state.timeActiveSessionExpired = true;
        if (this.lastTimeActiveTO) {
            clearTimeout(this.lastTimeActiveTO);
        }
        return execWhen(() => this.refs.timeActiveSessionExpiredDialog).then(timeActiveSessionExpiredDialog => {
            return timeActiveSessionExpiredDialog.open("Access Permission").then(() => {
                this.checkActiveSessionDialog();
            });
        });
    }

    checkActiveSessionDialog() {
//        execWhen(() => {
//            const {timeActiveSessionExpired: expired} = this.state;
//            if(!expired) {
//                return 0;
//            }
//            const dialog = document.querySelector('.TimeActiveSessionExpiredDialog');
//            if(!dialog) {
//                return 1;
//            }
//            const dialogJQ = $(dialog);
//            if(dialogJQ.length === 0) {
//                return 1;
//            }
//            let visibility = dialogJQ.css('visibility');
//            if(visibility && visibility.contains('hidden')) {
//                return 1;
//            }
//            
//            const {parentNode} = dialog;
//            if(!parentNode) {
//                return 1;
//            }
//            const parentNodeJQ = $(parentNode);
//            if(parentNodeJQ.length === 0) {
//                return 1;
//            }
//            
//            visibility = parentNodeJQ.css('visibility');
//            if(visibility && visibility.contains('hidden')) {
//                return 1;
//            }
//            return 1;
//        }).then(res => {
//            alert('catch: ' + res);
//        });
    }

    updateLastTimeActive() {
        if (isMobile()) {
            return;
        }
        const {timeActiveSessionExpiredDialog: dialog} = this.refs;
//        if(this.state.timeActiveSessionExpired && (!dialog || !dialog.verifyPhoneNum)) {
//            return;
//        } else if(this.state.timeActiveSessionExpired && (dialog && dialog.verifyPhoneNum)) {
//            this.state.timeActiveSessionExpired = false;
//            return;
//        }
        if (this.state.timeActiveSessionExpired) {
            return;
        }
        this.lastTimeActive = new Date();
        if (this.lastTimeActiveTO) {
            clearTimeout(this.lastTimeActiveTO);
        }
        const run = () => {
            this.lastTimeActiveTO = setTimeout(() => {
                const currTime = new Date();
                const secs = this.lastTimeActive.durationNextSeconds(currTime);
                if (secs >= 600) {
                    this.openAuth();
                } else {
                    run();
                }
            }, 1000);
        };
        run();
    }

    onClick(e) {
        this.updateLastTimeActive();
    }

    onKeyUp(e) {
        this.updateLastTimeActive();
    }

    render() {
        if (isFormsApp) return null;
        return storage.is.isLoggedIn && <React.Fragment>
            <EventListener target={window} onClick={this.onClick} onKeyUp={this.onKeyUp}/>
            <ErrorBoundary>
                <InitView/>
                <MainView ref="mainView"/>
                <DefaultView ref="defaultView"/>
                <Header ref="header"/>
                <ModuleSetupDialog ref="moduleSetupDialog"/>
                <EditUserDialog ref="editUserDialog" forShouldSetupPermissions/>
                <TimeActiveSessionExpiredDialog ref="timeActiveSessionExpiredDialog" state={this.state}
                                                updateLastTimeActive={this.updateLastTimeActive}/>
            </ErrorBoundary>
        </React.Fragment>;
    }
}

export default LoggedInApp;