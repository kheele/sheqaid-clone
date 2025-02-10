import React from 'react';
import {observer} from 'mobx-react';
import {autorun} from 'mobx';
import Footer from '../Footer';

import {execWhen} from 'utils/Utils';

import Login from './Login';

import style from './LoggedOutFormsApp.lazy.css';

@observer
class LoggedOutAppForms extends React.Component {

    constructor() {
        super();

        window.loggedOutApp = this;
    }

    componentWillMount() {
//        style.use();
    }

    async componentDidMount() {
        autorun(() => {
            if (!storage.is.isLoggedIn) {
                style.use();
            } else {
                style.unuse();
            }
        });
        
        const profile_pic = {dlUrls: ['../logo.svg']};
        
        execWhen(() => this.refs.logoImg).then(logoImg => {
            logoImg.src = profile_pic.dlUrls[0]; 
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        if(!isFormsApp) return null;
        return (!storage.is.isLoggedIn && <div className="LoggedOutAppForms nice-scrollbars">
            <div className="logo">
                <img ref="logoImg" src="../logo.svg"/>
            </div>
            <div className="controls-wrapper min-w-475">
                <Login ref="login"/>
            </div>
            <Footer />
        </div>);
    }
}

export default LoggedOutAppForms;
