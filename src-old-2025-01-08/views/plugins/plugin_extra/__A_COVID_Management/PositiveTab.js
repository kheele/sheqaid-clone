import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Permissions} from 'utils/Utils';

import APage from "../../../APage";

import Tabs from 'components/tabs/Tabs';
import PositiveAllTab from './PositiveAllTab.js';
import PositiveApprovedTab from './PositiveApprovedTab.js';
import PositiveUnApprovedTab from './PositiveUnApprovedTab.js';

import style from "./PositiveTab.lazy.css";

@observer
class PositiveTab extends APage {

    path;
    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);

        this.path = props.path + 'positive/';
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentDidMount() {
        super.componentDidMount();
        //app.onPageComplete();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    render() {
        const {permissionKey} = this.props;
        const {permissions_other} = storage.loggedUser.user.data;
        const permissions_other_COVIDPositiveCaseApproval = (permissions_other || []).find(v => v.key === "COVID Positive Case Approval");
        const allowPositive = Permissions.allow(permissions_other_COVIDPositiveCaseApproval);
        return (<div key="PositiveTab-page" id="PositiveTab-page" className={this.classNames + " " + (!allowPositive ? "disallow-positive" : "")}>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} position="bottom" index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <PositiveAllTab ref="positiveAll" title="All Cases" path={this.path}/>
                {allowPositive && <PositiveApprovedTab ref="positiveApproved" title="Cases Approved" path={this.path}/>}
                {allowPositive && <PositiveUnApprovedTab ref="positiveUnApproved" title="Cases Not Approved" path={this.path}/>}
            </Tabs>
        </div>);
    }
}

export default PositiveTab;
