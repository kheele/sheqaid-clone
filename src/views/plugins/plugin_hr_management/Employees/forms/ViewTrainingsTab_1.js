import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Button} from 'components/inputs';
import {Table, TBody, THead} from 'components/tables';
import NewRiskAssessmentTrainingDialog from '../dialogs/NewRiskAssessmentTrainingDialog';
import NewSWPOrSOPTrainingDialog from '../dialogs/NewSWPOrSOPTrainingDialog';
import NewStandardsAndProceduresTrainingDialog from '../dialogs/NewStandardsAndProceduresTrainingDialog';

import AListTab from '../AListTab';

@observer
class TrainingsTab extends AListTab {
    pageKey = "TrainingsTab";

    @observable
    state = {
        listRiskAssessmentTraining: [],
        listSafeWorkingProceduresTraining: [],
        listStandardsAndProceduresTraining: [],
        listOHSTraining: []
    };
    
    constructor(props) {
        super(props);
        const {item: {data: {risk_assessment_trainings, safe_working_procedure_trainings, standards_and_procedure_trainings, ohs_trainings}}} = this.props;
        this.state.listRiskAssessmentTraining = risk_assessment_trainings || [];
        this.state.listSafeWorkingProceduresTraining = safe_working_procedure_trainings || [];
        this.state.listStandardsAndProceduresTraining = standards_and_procedure_trainings || [];
        this.state.listOHSTraining = ohs_trainings || [];
        
        this.onAddRiskAssessmentTraining = this.onAddRiskAssessmentTraining.bind(this);
        this.onAddSWPOrSOPTraining = this.onAddSWPOrSOPTraining.bind(this);
        this.onAddStandardsAndProceduresTraining = this.onAddStandardsAndProceduresTraining.bind(this);
                
        this.onLoadListRiskAssessmentTraining = this.onLoadListRiskAssessmentTraining.bind(this);
        this.onLoadListSafeWorkingProceduresTraining = this.onLoadListSafeWorkingProceduresTraining.bind(this);
        this.onLoadListStandardsAndProceduresTraining = this.onLoadListStandardsAndProceduresTraining.bind(this);
        this.onLoadListOHSTraining = this.onLoadListOHSTraining.bind(this);
        
        this.renderRiskAssessmentTrainingItem = this.renderRiskAssessmentTrainingItem.bind(this);
        this.renderSafeWorkingProceduresTrainingItem = this.renderSafeWorkingProceduresTrainingItem.bind(this);
        this.renderStandardsAndProceduresTrainingItem = this.renderStandardsAndProceduresTrainingItem.bind(this);
        this.renderOHSTrainingItem = this.renderOHSTrainingItem.bind(this);
    }
    
    onAddRiskAssessmentTraining() {
        this.refs.newRiskAssessmentTrainingDialog.extraProp("employee", this.props.item).open();
    }
    
    onAddSWPOrSOPTraining() {
        this.refs.newSWPOrSOPTrainingDialog.extraProp("employee", this.props.item).open();
    }
    
    onAddStandardsAndProceduresTraining() {
        this.refs.newStandardsAndProceduresTrainingDialog.extraProp("employee", this.props.item).open();
    }

    onLoadListRiskAssessmentTraining() {
        return Promise.resolve(this.state.listRiskAssessmentTraining);
    }

    onLoadListSafeWorkingProceduresTraining() {
        return Promise.resolve(this.state.listSafeWorkingProceduresTraining);
    }

    onLoadListStandardsAndProceduresTraining() {
        return Promise.resolve(this.state.listStandardsAndProceduresTraining);
    }

    onLoadListOHSTraining() {
        return Promise.resolve(this.state.listOHSTraining);
    }

    renderRiskAssessmentTrainingItem(n, onClick) {
        const item = this.refs.root.list[n];
        return this.renderItem(n, item, onClick, <React.Fragment>
            <div className="td">{item.risk_assessment_type}</div>
            <div className="td fixed-flex min-w-150">{item.training_date}</div>
        </React.Fragment>);
    }

    renderSafeWorkingProceduresTrainingItem(n, onClick) {
        const item = this.refs.root.list[n];
        return this.renderItem(n, item, onClick, <React.Fragment>
            <div className="td">{item.swp_type}</div>
            <div className="td fixed-flex min-w-150">{item.training_date}</div>
        </React.Fragment>);
    }

    renderStandardsAndProceduresTrainingItem(n, onClick) {
        const item = this.refs.root.list[n];
        return this.renderItem(n, item, onClick, <React.Fragment>
            <div className="td">{item.standard_or_procedure_name}</div>
            <div className="td fixed-flex min-w-150">{item.training_date}</div>
        </React.Fragment>);
    }

    renderOHSTrainingItem(n, onClick) {
        const item = this.refs.root.list[n];
        return this.renderItem(n, item, onClick, <React.Fragment>
            <div className="td">{item.type}</div>
            <div className="td">{item.conducted}</div>
            <div className="td fixed-flex min-w-150">{item.date}</div>
        </React.Fragment>);
    }

    render() {
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="row">
                    <label>Risk Assessment Training <Button className="btn btn-primary pull-right" onClick={this.onAddRiskAssessmentTraining}>Add Risk Assessment Training</Button></label>
                    <Table>
                        <THead>
                        <div className="td">Risk Assessment Type</div>
                        <div className="td">Training Date</div>
                        <div className="td fixed-flex"></div>
                        </THead>
                        <TBody ref="body" title="Risk Assessment Trainings" renderItem={this.renderRiskAssessmentTrainingItem} onClick={this.onClick} listName="listRiskAssessmentTraining" state={this.state} onLoadList={this.onLoadListRiskAssessmentTraining} disablePullToRefresh={true}/>
                    </Table>
                </div>
                <div className="row">
                    <label>Safe Working Procedures Training <Button className="btn btn-primary pull-right" onClick={this.onAddSWPOrSOPTraining}>Add SWP/SOP Training</Button></label>
                    <Table>
                        <THead>
                        <div className="td">SWP Type</div>
                        <div className="td">Training Date</div>
                        <div className="td fixed-flex"></div>
                        </THead>
                        <TBody ref="body" title="Safe Working Procedures Trainings" renderItem={this.renderSafeWorkingProceduresTrainingItem} onClick={this.onClick} listName="listSafeWorkingProceduresTraining" state={this.state} onLoadList={this.onLoadListSafeWorkingProceduresTraining} disablePullToRefresh={true}/>
                    </Table>
                </div>
                <div className="row">
                    <label>Standards & Procedures Training <Button className="btn btn-primary pull-right" onClick={this.onAddStandardsAndProceduresTraining}>Add Standards & Procedures Training</Button></label>
                    <Table>
                        <THead>
                        <div className="td">Standard/Procedure Name</div>
                        <div className="td">Training Date</div>
                        <div className="td fixed-flex"></div>
                        </THead>
                        <TBody ref="body" title="Standards And Procedures Trainings" renderItem={this.renderStandardsAndProceduresTrainingItem} onClick={this.onClick} listName="listStandardsAndProceduresTraining" state={this.state} onLoadList={this.onLoadListStandardsAndProceduresTraining} disablePullToRefresh={true}/>
                    </Table>
                </div>
                <div className="row">
                    <label>OHS Training</label>
                    <Table>
                        <THead>
                        <div className="td">Type</div>
                        <div className="td">Conducted</div>
                        <div className="td">Date</div>
                        <div className="td fixed-flex"></div>
                        </THead>
                        <TBody ref="body" title="OHS Trainings" renderItem={this.renderOHSTrainingItem} onClick={this.onClick} listName="listOHSTraining" state={this.state} onLoadList={this.onLoadListOHSTraining} disablePullToRefresh={true}/>
                    </Table>
                </div>
            </div>
            <NewRiskAssessmentTrainingDialog ref="newRiskAssessmentTrainingDialog"/>
            <NewSWPOrSOPTrainingDialog ref="newSWPOrSOPTrainingDialog"/>
            <NewStandardsAndProceduresTrainingDialog ref="newStandardsAndProceduresTrainingDialog"/>
        </div>;
    }
}

export default TrainingsTab;