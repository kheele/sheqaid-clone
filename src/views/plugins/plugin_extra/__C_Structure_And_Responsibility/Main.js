import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./Main.lazy.css";

import { Button } from "components/inputs";
import { PageTitle } from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";

import APage from "../../../APage";
import Tabs from 'components/tabs/Tabs';

import OrganogramsTab from './OrganogramsTab';
import AppointmentsTab from './AppointmentsTab';

@observer
class Main extends APage {
    static key = 'StructureAndResponsibility';
    static title = 'Structure And Responsibility';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/StructureAndResponsibility/";
    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);
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
        return (<div key="StructureAndResponsibility-page" id="StructureAndResponsibility-page" className={this.classNames}>
            <PageTitle title="Structure & Responsibility" renderBackBtn={this.renderBackBtn}>
                <Button
                    text="OHS Documents"
                    hoverText="OHS Act, Legal register, etc"
                    className="btn btn-primary pull-right"
                    onClick={this.onViewOHSDocuments}
                />
            </PageTitle>
            <Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index} onPreChange={this.onPreChange} onPostChange={this.onPostChange}>
                <OrganogramsTab ref="organograms" title="Organograms" path={this.path}/>
                <AppointmentsTab ref="appointments" title="Job Appointments" path={this.path}/>
            </Tabs>
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_extra" module="__C_Structure_And_Responsibility"/>
        </div>);
    }
}

export default Main;
