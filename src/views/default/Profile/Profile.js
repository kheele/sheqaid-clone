import React from "react";
import {observer} from 'mobx-react';

import APage from "../../APage";

import CompanyProfile from './CompanyProfile';
import CompanyBilling from './CompanyBilling';

import style from "./profile.lazy.css";

@observer
class Profile extends APage {
    static key = 'Profile';

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    render() {
        return (<div id="profile-page" className={this.classNames}>
            <div className="page-title">
                {this.renderBackBtn()}
                <h3>Company Account</h3>
            </div>
            <div className="page-content">
                <CompanyProfile />
                <CompanyBilling />
            </div>
        </div>);
    }
}

export default Profile;
//402, 328