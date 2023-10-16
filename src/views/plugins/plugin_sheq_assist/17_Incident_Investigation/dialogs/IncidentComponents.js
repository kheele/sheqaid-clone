// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';

import {Button, Clickable} from 'components/inputs';
import {ReadonlyListTable, THead} from 'components/tables';

import {NewCauseAnalysisImmediateDialog, NewCauseAnalysisRootDialog} from './NewCauseAnalysisDialogs';
import NewCorrectiveActionsDialog from './NewCorrectiveActionsDialog';
import insertIncidentCauseAnalysis
    from "mutations/all/Incident/IncidentCauseAnalysis/insertIncidentCauseAnalysis";
import insertIncidentCauseAnalysisImmediate
    from "mutations/all/Incident/IncidentCauseAnalysisImmediate/insertIncidentCauseAnalysisImmediate";
import insertIncidentCauseAnalysisRoot
    from "mutations/all/Incident/IncidentCauseAnalysisRoot/insertIncidentCauseAnalysisRoot";
import {calcLengths, CauseAnalysisTable, CorrectiveActionListByCauseTable} from "./IncidentComponentTables";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CauseAnalysisPanel">
@observer
class CauseAnalysisPanel extends React.Component {

    @observable state = {
        cause_analysis: null,
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        const {defaultValue: cause_analysis} = props;
        if (cause_analysis) {
            this.state.cause_analysis = cause_analysis;

            const {onChange, name} = this.props;
            onChange && onChange(cause_analysis, name, this);
        }

        this.onAdd = this.onAdd.bind(this);
        this.renderReadonly = this.renderReadonly.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
    }

    //</editor-fold>

    //<editor-fold desc="onAdd">
    onAdd(e, btn) {
        const {onChange, name, investigation} = this.props;
        const {newImmediateDialog, newRootDialog} = this.refs;
        const {action} = btn.props;
        const {immediate_analysis, root_analysis, cause_analysis} = this;

        if (action === 'immediate') {
            newImmediateDialog.extraProp('cause_analysis', cause_analysis).extraProp('investigation', investigation).open(immediate_analysis).then(async immediate_analysis => {
                if (immediate_analysis.id) {
                    extendObservable(this.immediate_analysis, immediate_analysis);
                } else {
                    progressDialog.open();
                    try {
                        if (this.cause_analysis) {
                            const savedCauseAnalysis = await insertIncidentCauseAnalysisImmediate({
                                cause_analysis_id: this.cause_analysis.id,
                                ...immediate_analysis,
                            });
                            if (savedCauseAnalysis === "INCIDENT_CAUSE_ANALYSIS_NOT_FOUND") return infoDialog.open("Incident Cause Analysis no longer exist.");

                            if (savedCauseAnalysis) {
                                this.immediate_analysis = savedCauseAnalysis.data.immediate_analysis;

                                infoDialog.open("Record successfully updated.");
                                infoDialog.close(2000);
                                newImmediateDialog.close();
                            } else {
                                infoDialog.open("Record couldn't be updated.");
                            }
                        } else {
                            const savedInvestigation = await insertIncidentCauseAnalysis({
                                investigation_id: investigation.id,
                                immediate_analysis: {data: immediate_analysis},
                            });
                            this.onUpdateIncidentInvestigation(savedInvestigation);
                            newImmediateDialog.close();
                        }
                    } catch (err) {
                        console.error(err);
                        infoDialog.open("An error occurred. Please try again.");
                    } finally {
                        setTimeout(() => progressDialog.close());
                    }
                }

                onChange && onChange(this.cause_analysis, name, this);
            });
        } else if (action === 'root') {
            newRootDialog.extraProp('cause_analysis', cause_analysis).extraProp('investigation', investigation).open(root_analysis).then(async root_analysis => {
                if (root_analysis.id) {
                    extendObservable(this.root_analysis, root_analysis);
                } else {
                    progressDialog.open();
                    try {
                        if (this.cause_analysis) {
                            const savedCauseAnalysis = await insertIncidentCauseAnalysisRoot({
                                cause_analysis_id: this.cause_analysis.id,
                                ...root_analysis,
                            });
                            if (savedCauseAnalysis === "INCIDENT_CAUSE_ANALYSIS_NOT_FOUND") return infoDialog.open("Incident Cause Analysis no longer exist.");

                            if (savedCauseAnalysis) {
                                this.root_analysis = savedCauseAnalysis.data.root_analysis;

                                infoDialog.open("Record successfully updated.");
                                infoDialog.close(2000);
                                newRootDialog.close();
                            } else {
                                infoDialog.open("Record couldn't be updated.");
                            }
                        } else {
                            const savedInvestigation = await insertIncidentCauseAnalysis({
                                investigation_id: investigation.id,
                                root_analysis: {data: root_analysis},
                            });
                            this.onUpdateIncidentInvestigation(savedInvestigation);
                            newRootDialog.close();
                        }
                    } catch (err) {
                        console.error(err);
                        infoDialog.open("An error occurred. Please try again.");
                    } finally {
                        setTimeout(() => progressDialog.close());
                    }
                }

                onChange && onChange(this.cause_analysis, name, this);
            });
        }
    }

    //</editor-fold>

    //<editor-fold desc="onUpdateIncidentInvestigation">
    async onUpdateIncidentInvestigation(savedInvestigation) {
        if (savedInvestigation === "INVESTIGATION_NOT_FOUND") return infoDialog.open("Incident Investigation no longer exist.");

        if (savedInvestigation) {
            this.cause_analysis = savedInvestigation.data.cause_analysis;

            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
        } else {
            infoDialog.open("Record couldn't be updated.");
        }
    }

    //</editor-fold>

    @computed get cause_analysis() {
        return this.state.cause_analysis;
    }

    set cause_analysis(value) {
        this.state.cause_analysis = value;
    }

    set immediate_analysis(immediate_analysis) {
        this.state.cause_analysis.immediate_analysis = immediate_analysis;
    }

    set root_analysis(root_analysis) {
        this.state.cause_analysis.root_analysis = root_analysis;
    }

    @computed get immediate_analysis() {
        const {immediate_analysis} = this.cause_analysis || {};
        return immediate_analysis;
    }

    @computed get root_analysis() {
        const {root_analysis} = this.cause_analysis || {};
        return root_analysis;
    }

    //<editor-fold desc="renderReadonly">
    renderReadonly() {
        const {immediate_analysis, root_analysis} = this;
        return (<div className={"CauseAnalysisPanel col-lg-12 margin-0 padding-0 readonly"}>
            {immediate_analysis && <div className="CauseAnalysisPanel-Immediate">
                <ReadonlyImmediateCauseAnalysis item={immediate_analysis}/>
            </div>}
            {root_analysis && <div className="CauseAnalysisPanel-Root">
                <ReadonlyRootCauseAnalysis item={root_analysis}/>
            </div>}
        </div>);
    }

    //</editor-fold>

    //<editor-fold desc="renderEditable">
    renderEditable() {
        const {immediate_analysis, root_analysis} = this;
        let immediate_analysis_count = 0;
        let root_analysis_count = 0;

        if (!!immediate_analysis) {
            const {
                sub_standard_practices_or_unsafe_acts = [],
                sub_standard_practices_or_unsafe_conditions = [],
                custom_sub_standard_practices_or_unsafe_acts = [],
                custom_sub_standard_practices_or_unsafe_conditions = []
            } = immediate_analysis;

            immediate_analysis_count = calcLengths(
                sub_standard_practices_or_unsafe_acts,
                sub_standard_practices_or_unsafe_conditions,
                custom_sub_standard_practices_or_unsafe_acts,
                custom_sub_standard_practices_or_unsafe_conditions,
            );
        }
        if (!!root_analysis) {
            const {
                personal_factors = [], job_factors = [],
                custom_personal_factors = [], custom_job_factors = []
            } = root_analysis;

            root_analysis_count = calcLengths(
                personal_factors,
                job_factors,
                custom_personal_factors,
                custom_job_factors,
            );
        }
        return (<div className={"CauseAnalysisPanel col-lg-12 margin-0 padding-0"}>
            <div className="CauseAnalysisPanel-Immediate">
                <label className="w-full text-center">Direct/Immediate Cause(s)</label>
                <div className="CauseAnalysisPanel-count hor-center text-center"><span
                    className="counter">{immediate_analysis_count}</span> Direct/Immediate Cause(s) added
                </div>
                <Button className="btn btn-primary hor-center margin-t-10" action="immediate" onClick={this.onAdd}>
                    <i className="fa fa-plus"/> Add/Edit
                </Button>
            </div>
            <div className="CauseAnalysisPanel-Root">
                <label className="w-full text-center">Indirect/Basic/Root Cause(s)</label>
                <div className="CauseAnalysisPanel-count hor-center text-center"><span
                    className="counter">{root_analysis_count}</span> Indirect/Basic/Root Cause(s) added
                </div>
                <Button className="btn btn-primary hor-center margin-t-10" action="root" onClick={this.onAdd}>
                    <i className="fa fa-plus"/> Add/Edit
                </Button>
            </div>

            <NewCauseAnalysisImmediateDialog ref="newImmediateDialog"/>
            <NewCauseAnalysisRootDialog ref="newRootDialog"/>
        </div>);
    }

    //</editor-fold>

    render() {
        const {readonly} = this.props;
        return readonly ? this.renderReadonly() : this.renderEditable();
    }
}

@observer
class ReadonlyImmediateCauseAnalysis extends React.Component {
    render() {
        const {item: immediate_analysis} = this.props;
        if (!immediate_analysis) return null;
        const {
            sub_standard_practices_or_unsafe_acts, sub_standard_practices_or_unsafe_conditions,
            custom_sub_standard_practices_or_unsafe_acts, custom_sub_standard_practices_or_unsafe_conditions
        } = immediate_analysis;
        return <div className="CauseAnalysisPanel-Immediate">
            <label className="w-full text-center">Direct/Immediate Cause(s)</label>
            <div className="CauseAnalysisPanelListCover">
                {!!sub_standard_practices_or_unsafe_acts && <CauseAnalysisTable
                    readonly
                    group="Immediate Cause"
                    title="Sub-Standard Practices / Unsafe Acts"
                    className="col-lg-12 no-padding"
                    list={sub_standard_practices_or_unsafe_acts}/>}
                {!!custom_sub_standard_practices_or_unsafe_acts && <CauseAnalysisTable
                    readonly
                    group="Immediate Cause"
                    title="Custom Sub-Standard Practices / Unsafe Acts"
                    className="col-lg-12 no-padding"
                    list={custom_sub_standard_practices_or_unsafe_acts}/>}
                {!!sub_standard_practices_or_unsafe_conditions && <CauseAnalysisTable
                    readonly
                    group="Immediate Cause"
                    title="Sub-Standard Conditions / Unsafe Conditions"
                    className="col-lg-12 no-padding"
                    list={sub_standard_practices_or_unsafe_conditions}/>}
                {!!custom_sub_standard_practices_or_unsafe_conditions && <CauseAnalysisTable
                    readonly
                    group="Immediate Cause"
                    title="Custom Sub-Standard Conditions / Unsafe Conditions"
                    className="col-lg-12 no-padding"
                    list={custom_sub_standard_practices_or_unsafe_conditions}/>}
            </div>
        </div>;
    }
}

@observer
class ReadonlyRootCauseAnalysis extends React.Component {
    render() {
        const {item: root_analysis} = this.props;
        if (!root_analysis) return null;
        const {
            personal_factors, job_factors,
            custom_personal_factors, custom_job_factors
        } = root_analysis;
        return <div className="CauseAnalysisPanel-Root">
            <label className="w-full text-center">Indirect/Basic/Root Cause(s)</label>
            <div className="CauseAnalysisPanelListCover">
                {!!personal_factors && <CauseAnalysisTable
                    readonly
                    group="Root Cause"
                    title="Personal Factors"
                    className="col-lg-12 no-padding"
                    list={personal_factors}/>}
                {!!custom_personal_factors && <CauseAnalysisTable
                    readonly
                    group="Root Cause"
                    title="Custom Personal Factors"
                    className="col-lg-12 no-padding"
                    list={custom_personal_factors}/>}
                {!!job_factors && <CauseAnalysisTable
                    readonly
                    group="Root Cause"
                    title="Job Factors"
                    className="col-lg-12 no-padding"
                    list={job_factors}/>}
                {!!custom_job_factors && <CauseAnalysisTable
                    readonly
                    group="Root Cause"
                    title="Custom Job Factors"
                    className="col-lg-12 no-padding"
                    list={custom_job_factors}/>}
            </div>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RemedialOrCorrectiveActionPanel">
@observer
class RemedialOrCorrectiveActionPanel extends React.Component {

    @observable state = {
        cause_analysis: null,
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onAdded = this.onAdded.bind(this);
        this.onAddCorrectiveActionsToCause = this.onAddCorrectiveActionsToCause.bind(this);
        this.renderReadonly = this.renderReadonly.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
    }

    //</editor-fold>

    //<editor-fold desc="onAdded">
    onAdded(cause_updated) {//{group, sub_group: title, cause_name: cause.text, new_corrective_actions};
        const {onChange, name} = this.props;
        const {corrective_actions: corrective_actions_list} = this.state;
        const {new_corrective_actions} = cause_updated;//{group, sub_group: title, cause_name: cause.text, new_corrective_actions}
//            console.log('cause', cause, cause_updated)
        delete cause_updated.new_corrective_actions;
        const {
            personal_factors = [], job_factors = [],
            custom_personal_factors = [], custom_job_factors = []
        } = new_corrective_actions;
        [...personal_factors, ...job_factors, ...custom_personal_factors, ...custom_job_factors].forEach(action => {
            //cause_updated = {group, sub_group: title, cause_name: cause.text}
            //action = {text, responsible_person, ...};
            corrective_actions_list.push({...action, ...cause_updated});//
        });
        console.log('final corrective actions to do', toJS(corrective_actions_list))
        onChange && onChange(toJS(corrective_actions_list), name, this);
    }

    //</editor-fold>

    onAddCorrectiveActionsToCause(cause) {
        const {newCorrectiveActionsDialog} = this.refs;
        return newCorrectiveActionsDialog.open(cause);
    }

    set cause_analysis(cause_analysis) {//immediate_analysis, root_analysis
        this.state.cause_analysis = cause_analysis;
    }

    //<editor-fold desc="renderReadonly">
    renderReadonly() {
        const {state: {corrective_actions}} = this;
        console.log('corrective_actions', corrective_actions)
        const renderTHead = ({desc}) => {
            return <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td font-size-12">{desc}</div>
                <div className="td font-size-12">Cause</div>
                <div className="td fixed-flex min-w-10 padding-0"></div>
            </THead>;
        };
        const renderItem = (item, n, onClick) => {
            const {cause_name, text} = item;
            return <React.Fragment>
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td">{text}</div>
                <div className="td">{cause_name}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </React.Fragment>;
        };

        const immediate_cause_group = corrective_actions.filter(({group}) => group === "Immediate Cause");
        const sub_standard_practices_or_unsafe_acts = immediate_cause_group.filter(({sub_group}) => sub_group === "Sub-Standard Practices / Unsafe Acts");
        const sub_standard_practices_or_unsafe_conditions = immediate_cause_group.filter(({sub_group}) => sub_group === "Sub-Standard Conditions / Unsafe Conditions");

        const root_cause_group = corrective_actions.filter(({group}) => group === "Root Cause");
        const personal_factors = root_cause_group.filter(({sub_group}) => sub_group === "Personal Factors");
        const job_factors = root_cause_group.filter(({sub_group}) => sub_group === "Job Factors");

        return (<div className="RemedialOrCorrectiveActionPanel col-lg-12 margin-0 padding-0">
            {!immediate_cause_group.isEmpty() && <div className="RemedialOrCorrectiveActionPanel-Immediate">
                <label className="w-full text-center">Direct/Immediate Cause(s)</label>
                <div className="RemedialOrCorrectiveActionPanelListCover">
                    {!sub_standard_practices_or_unsafe_acts.isEmpty() && <ReadonlyListTable
                        desc="Corrective Action (Sub-Standard Practices / Unsafe Acts)"
                        list={sub_standard_practices_or_unsafe_acts}
                        className="w-full padding-0 margin-0"
                        renderTHead={renderTHead}
                        renderItem={renderItem}
                        replaceCols/>}
                    {!sub_standard_practices_or_unsafe_conditions.isEmpty() && <ReadonlyListTable
                        desc="Corrective Action (Sub-Standard Conditions / Unsafe Conditions)"
                        list={sub_standard_practices_or_unsafe_conditions}
                        className="w-full padding-0 margin-0"
                        renderTHead={renderTHead}
                        renderItem={renderItem}
                        replaceCols/>}
                </div>
            </div>}
            {!root_cause_group.isEmpty() && <div className="RemedialOrCorrectiveActionPanel-Root">
                <label className="w-full text-center">Indirect/Basic/Root Cause(s)</label>
                <div className="RemedialOrCorrectiveActionPanelListCover">
                    {!personal_factors.isEmpty() && <ReadonlyListTable
                        desc="Corrective Action (Personal Factors)"
                        list={personal_factors}
                        className="w-full padding-0 margin-0"
                        renderTHead={renderTHead}
                        renderItem={renderItem}
                        replaceCols/>}
                    {!job_factors.isEmpty() && <ReadonlyListTable
                        desc="Corrective Action (Job Factors)"
                        list={job_factors}
                        className="w-full padding-0 margin-0"
                        renderTHead={renderTHead}
                        renderItem={renderItem}
                        replaceCols/>}
                </div>
            </div>}
        </div>);
    }

    //</editor-fold>

    //<editor-fold desc="renderEditable">
    renderEditable() {
        const {state: {cause_analysis}} = this;
        console.log('cause_analysis', cause_analysis)
        return (<div className="RemedialOrCorrectiveActionPanel col-lg-12 margin-0 padding-0">
            {!!cause_analysis && <>
                <ImmediateCorrectiveActions
                    onAdded={this.onAdded}
                    item={cause_analysis.immediate_analysis}
                    onAddCorrectiveActionsToCause={this.onAddCorrectiveActionsToCause}
                />
                <RootCorrectiveActions
                    onAdded={this.onAdded}
                    item={cause_analysis.root_analysis}
                    onAddCorrectiveActionsToCause={this.onAddCorrectiveActionsToCause}
                />
            </>}
            {!cause_analysis && <p className="no-content text-center">
                Please complete previous section <Clickable idx={5} onClick={this.props.onBack}>
                <b>(Cause Analysis)</b>
            </Clickable> in order to complete this section.
            </p>}

            <NewCorrectiveActionsDialog ref="newCorrectiveActionsDialog"/>
        </div>);
    }

    //</editor-fold>

    render() {
        const {readonly} = this.props;
        return readonly ? this.renderReadonly() : this.renderEditable();
    }
}

//<editor-fold desc="ImmediateCorrectiveActions">
@observer
class ImmediateCorrectiveActions extends React.Component {
    render() {
        const {onAdded, onAddCorrectiveActionsToCause, item: immediate_analysis} = this.props;
        if (!immediate_analysis) return null;

        const {
            sub_standard_practices_or_unsafe_acts, sub_standard_practices_or_unsafe_conditions,
            custom_sub_standard_practices_or_unsafe_acts, custom_sub_standard_practices_or_unsafe_conditions
        } = immediate_analysis;
        return <div className="RemedialOrCorrectiveActionPanel-Immediate">
            <label className="w-full text-center">Direct/Immediate Cause(s)</label>
            <div className="RemedialOrCorrectiveActionPanelListCover">
                {!!sub_standard_practices_or_unsafe_acts && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Immediate Cause"
                    title="Sub-Standard Practices / Unsafe Acts"
                    className="col-lg-12 no-padding"
                    list={sub_standard_practices_or_unsafe_acts}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
                {!!custom_sub_standard_practices_or_unsafe_acts && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Immediate Cause"
                    title="Custom Sub-Standard Practices / Unsafe Acts"
                    className="col-lg-12 no-padding"
                    list={custom_sub_standard_practices_or_unsafe_acts}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
                {!!sub_standard_practices_or_unsafe_conditions && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Immediate Cause"
                    title="Sub-Standard Conditions / Unsafe Conditions"
                    className="col-lg-12 no-padding"
                    list={sub_standard_practices_or_unsafe_conditions}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
                {!!custom_sub_standard_practices_or_unsafe_conditions && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Immediate Cause"
                    title="Custom Sub-Standard Conditions / Unsafe Conditions"
                    className="col-lg-12 no-padding"
                    list={custom_sub_standard_practices_or_unsafe_conditions}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
            </div>
        </div>;
    }
}

//</editor-fold>

//<editor-fold desc="RootCorrectiveActions">
@observer
class RootCorrectiveActions extends React.Component {
    render() {
        const {onAdded, onAddCorrectiveActionsToCause, item: root_analysis} = this.props;
        if (!root_analysis) return null;

        const {
            personal_factors, job_factors,
            custom_personal_factors, custom_job_factors
        } = root_analysis;
        return <div className="RemedialOrCorrectiveActionPanel-Root">
            <label className="w-full text-center">Indirect/Basic/Root Cause(s)</label>
            <div className="RemedialOrCorrectiveActionPanelListCover">
                {!!personal_factors && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Root Cause"
                    title="Personal Factors"
                    className="col-lg-12 no-padding"
                    list={personal_factors}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
                {!!custom_personal_factors && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Root Cause"
                    title="Custom Personal Factors"
                    className="col-lg-12 no-padding"
                    list={custom_personal_factors}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
                {!!job_factors && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Root Cause"
                    title="Job Factors"
                    className="col-lg-12 no-padding"
                    list={job_factors}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
                {!!custom_job_factors && <CorrectiveActionListByCauseTable
                    onAdded={onAdded}
                    group="Root Cause"
                    title="Custom Job Factors"
                    className="col-lg-12 no-padding"
                    list={custom_job_factors}
                    onAddCorrectiveActionsToCause={onAddCorrectiveActionsToCause}/>}
            </div>
        </div>;
    }
}

//</editor-fold>
// </editor-fold>

export {
    CauseAnalysisPanel, RemedialOrCorrectiveActionPanel,
};
