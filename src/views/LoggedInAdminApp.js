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

import TimeActiveSessionExpiredDialog from '../components/dialogs/TimeActiveSessionExpiredDialog';

import style from './LoggedInAdminApp.lazy.css';

@observer
class LoggedInAdminApp extends React.Component {

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
                this.updateLastTimeActive();
                style.use();
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
        if(this.lastTimeActiveTO) {
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
        if(isMobile()) {
            return;
        }
        if(this.state.timeActiveSessionExpired) {
            return;
        }
        this.lastTimeActive = new Date();
        if(this.lastTimeActiveTO) {
            clearTimeout(this.lastTimeActiveTO);
        }
        const run = () => {
            this.lastTimeActiveTO = setTimeout(() => {
                const currTime = new Date();
                const secs = this.lastTimeActive.durationNextSeconds(currTime);
                if(secs >= 600) {
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
        return storage.is.isLoggedIn && <React.Fragment>
            <EventListener target={window} onClick={this.onClick} onKeyUp={this.onKeyUp} />
            <ErrorBoundary>
                <InitView/>
                <MainView ref="mainView"/>
                <DefaultView ref="defaultView"/>
                <Header ref="header"/>
                <TimeActiveSessionExpiredDialog ref="timeActiveSessionExpiredDialog" state={this.state} updateLastTimeActive={this.updateLastTimeActive}/>
            </ErrorBoundary>
        </React.Fragment>;
    }
}

export default LoggedInAdminApp;