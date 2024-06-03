// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Permissions} from 'utils/Utils';

import { Button } from "components/inputs";
import { PageTitle } from "components";
import OHSDocListDialog from "views/plugins/plugin_sheq_assist/00_Document_and_Record_Control/OHSDocs";

import {CompetenciesDialog} from "../../plugin_hr_management/Competencies";
import TrainingRegistryTab from './TrainingRegistryTab';
import TrainingPlanTab from './TrainingPlanTab';
import TrainingRegisterTab from './TrainingRegisterTab';
import TrainingMatrixTab from './TrainingMatrixTab';
import ToolboxTalksTab from './ToolboxTalksTab';
import DashboardTab from "./DashboardTab";

import Tabs from 'components/tabs/Tabs';

import APage from "views/APage";

import style from "./Main.lazy.css";
// </editor-fold>

//[Trainings= crud in hr but in assist only view]
@observer
class Main extends APage {
    static title = 'Training';
    static faIconLeft = 'users';
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = "plugin_sheq_assist/05_Trainings/";
    pageKey = "Trainings";

    @observable
    state = {index: 0, isLoaded: false};
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onViewCompetencies = this.onViewCompetencies.bind(this);
        this.onRenderCompetenciesBtb = this.onRenderCompetenciesBtb.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        super.componentWillMount();
        style.use();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        super.componentDidMount();
        //app.onPageComplete();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }	
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewCompetencies">
    onViewCompetencies() {
        this.refs.competenciesDialog.open();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onRenderCompetenciesBtb">
    onRenderCompetenciesBtb() {
        const {permissions_other} = storage.loggedUser.user.data;
        const permissions_other_Competencies = (permissions_other || []).find(v => v.key === "Competencies");
        
        if(Permissions.allow(permissions_other_Competencies)) {
            return <Button className="btn btn-primary pull-right" onClick={this.onViewCompetencies}>
                Certificates
            </Button>;
        }
        return null;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onRenderCompetenciesBtb, path, props: {permissionKey}} = this;
        
        return (<div key={this.pageKey} id={this.pageKey + '-page'} className={this.classNames}>
            <PageTitle title="Training" renderBackBtn={this.renderBackBtn}>
                <Button
                    text="OHS Documents"
                    hoverText="OHS Act, Legal register, etc"
                    className="btn btn-primary pull-right"
                    onClick={this.onViewOHSDocuments}
                />
            </PageTitle>
            <Tabs key="tabs" permissionKey={permissionKey} index={this.state.index}>
                <DashboardTab ref="dashboard" title="Dashboard"/>
                {/*<TrainingTab ref="training" title="Training Manuals" path={path} onRenderCompetenciesBtb={onRenderCompetenciesBtb}/>*/}
                <TrainingRegistryTab ref="TrainingRegistry" title="Training Courses" path={path} onRenderCompetenciesBtb={onRenderCompetenciesBtb}/>
                <TrainingPlanTab ref="trainingPlan" title="Training Plan" path={path} onRenderCompetenciesBtb={onRenderCompetenciesBtb}/>
                <TrainingMatrixTab ref="trainingMatrix" title="Training Matrix" path={path} onRenderCompetenciesBtb={onRenderCompetenciesBtb}/>
                <TrainingRegisterTab ref="trainingRegister" title="Training Register" path={path} onRenderCompetenciesBtb={onRenderCompetenciesBtb}/>
                <ToolboxTalksTab ref="toolboxTalks" title="Toolbox Talks / Training Meetings" path={path} onRenderCompetenciesBtb={onRenderCompetenciesBtb}/>
            </Tabs>
            
            <CompetenciesDialog ref="competenciesDialog"/>
            <OHSDocListDialog ref="ohsDocListDialog" plugin="plugin_sheq_assist" module="Trainings"/>
        </div>);
    }
    // </editor-fold>
}

export default Main;