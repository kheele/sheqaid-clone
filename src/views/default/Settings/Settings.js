import React from "react";
import {observer} from 'mobx-react';
import APage from "views/APage";
import style from "./Settings.lazy.css";
import SettingsCol from "./SettingsCol";
import NotificationsCol from "./NotificationsCol";
import SHEQPermissionsCol from "./SHEQPermissionsCol";
import HRPermissionsCol from "./HRPermissionsCol";
import {execWhen} from "utils/Utils";

//change background, logo, company name
@observer
class Settings extends APage {
    static key = 'Settings';

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    update() {
        execWhen(() => this.refs.settingsCol).then(ref => ref.update());
        execWhen(() => this.refs.notificationsCol).then(ref => ref.update());
        execWhen(() => this.refs.sheqPermissionsCol).then(ref => ref.update());
        execWhen(() => this.refs.hrPermissionsCol).then(ref => ref.update());
    }

    render() {
        return (<div id="settings-page" className={this.classNames + " settings-page"}>
            <div className="page-title">
                {this.renderBackBtn()}<h3>Settings</h3>
            </div>
            <div className="page-content nice-scrollbars grid-4 grid-gap-10 padding-r-10">
                <SettingsCol ref="settingsCol"/>
                <NotificationsCol ref="notificationsCol"/>
                <SHEQPermissionsCol ref="sheqPermissionsCol"/>
                <HRPermissionsCol ref="hrPermissionsCol"/>
            </div>
        </div>);
    }
}

export default Settings;
