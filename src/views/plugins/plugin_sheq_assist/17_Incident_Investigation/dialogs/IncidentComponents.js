// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, extendObservable, observable, toJS} from 'mobx';
import {Dates} from 'utils/Utils';

import {ActionsButton, Button, ClearableInput, Clickable} from 'components/inputs';
import {ATableSavable, ReadonlyListTable, Table, TBody, THead, TRow} from 'components/tables';

import {NewCauseAnalysisImmediateDialog, NewCauseAnalysisRootDialog} from './NewCauseAnalysisDialogs';
import NewCorrectiveActionsDialog from './NewCorrectiveActionsDialog';
import insertIncidentCauseAnalysis
    from "mutations/all/Incident/IncidentCauseAnalysis/insertIncidentCauseAnalysis";
import insertIncidentCauseAnalysisImmediate
    from "mutations/all/Incident/IncidentCauseAnalysisImmediate/insertIncidentCauseAnalysisImmediate";
import insertIncidentCauseAnalysisRoot
    from "mutations/all/Incident/IncidentCauseAnalysisRoot/insertIncidentCauseAnalysisRoot";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CauseAnalysisPanel">
@observer
class CauseAnalysisPanel extends React.Component {

    @observable state = {
        cause_analysis: null,
    };

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
                            } else {
                                infoDialog.open("Record couldn't be updated.");
                            }
                        } else {
                            const savedInvestigation = await insertIncidentCauseAnalysis({
                                investigation_id: investigation.id,
                                immediate_analysis: {data: immediate_analysis},
                            });
                            this.onUpdateIncidentInvestigation(savedInvestigation);
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
                            } else {
                                infoDialog.open("Record couldn't be updated.");
                            }
                        } else {
                            const savedInvestigation = await insertIncidentCauseAnalysis({
                                investigation_id: investigation.id,
                                root_analysis: {data: root_analysis},
                            });
                            this.onUpdateIncidentInvestigation(savedInvestigation);
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
            immediate_analysis_count += sub_standard_practices_or_unsafe_acts.length;
            immediate_analysis_count += sub_standard_practices_or_unsafe_conditions.length;
            immediate_analysis_count += custom_sub_standard_practices_or_unsafe_acts.length;
            immediate_analysis_count += custom_sub_standard_practices_or_unsafe_conditions.length;
        }
        if (!!root_analysis) {
            const {
                personal_factors = [], job_factors = [],
                custom_personal_factors = [], custom_job_factors = []
            } = root_analysis;
            root_analysis_count += personal_factors.length;
            root_analysis_count += job_factors.length;
            root_analysis_count += custom_personal_factors.length;
            root_analysis_count += custom_job_factors.length;
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
        corrective_actions: null,
    };

    constructor(props) {
        super(props);

        const {defaultValue: corrective_actions} = props;
        if (corrective_actions) {
            this.state.corrective_actions = corrective_actions;

            const {onChange, name} = this.props;
            onChange && onChange(corrective_actions, name, this);
        }

        this.onAdded = this.onAdded.bind(this);
        this.onAddCorrectiveActionsToCause = this.onAddCorrectiveActionsToCause.bind(this);
        this.renderReadonly = this.renderReadonly.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
    }

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

    onAddCorrectiveActionsToCause(cause) {
        const {newCorrectiveActionsDialog} = this.refs;
        return newCorrectiveActionsDialog.open(cause);
    }

    set cause_analysis(cause_analysis) {//immediate_analysis, root_analysis
        this.state.cause_analysis = cause_analysis;
    }

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

    render() {
        const {readonly} = this.props;
        return readonly ? this.renderReadonly() : this.renderEditable();
    }
}

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


// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CauseAnalysisTable">
@observer
class CauseAnalysisTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {list} = this.props;
        this.state.list = list;
    }

    // calcItemStats(item) {
    //     const {
    //         text, corrective_actions = {}
    //     } = item;
    //     const {
    //         personal_factors = [], job_factors = [],
    //         custom_personal_factors = [], custom_job_factors = []
    //     } = corrective_actions;
    //     let total_cost = personal_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
    //     total_cost += job_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
    //     total_cost += custom_personal_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
    //     total_cost += custom_job_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
    //     let sum = personal_factors.length + job_factors.length + custom_personal_factors.length + custom_job_factors.length;
    //     console.log('calcItemStats', item, total_cost)
    //     return {total_cost, sum};
    // }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        const {text} = item;

        console.log('renderItem', item)
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
            <div className="td padding-l-0 padding-r-0">{text}</div>
            <div className="td fixed-flex min-w-0 padding-0"></div>
        </TRow>;
        ;
    }

    render() {
        const {title} = this.props;
        return (<Table className="CauseAnalysisTable w-full margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td padding-l-0 padding-r-0 font-size-12">{title}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CorrectiveActionListByCauseTable">
@observer
class CorrectiveActionListByCauseTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {list} = this.props;
        this.state.list = list;

        this.onEdit = this.onEdit.bind(this);
        this.renderReadonly = this.renderReadonly.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
    }

    onEdit(e, btn) {
        const {onAdded, group, title, onAddCorrectiveActionsToCause} = this.props;
        const {idx} = btn.props;
        const {list} = this.state;
        const cause = list[idx];
        onAddCorrectiveActionsToCause(cause).then(new_corrective_actions => {
            cause.corrective_actions = new_corrective_actions;
            list.removeIf((v, n) => n === idx);
            list.insertAt(idx, cause);
            onAdded && onAdded({group, sub_group: title, cause_name: cause.text, new_corrective_actions});
        });
    }

    calcItemStats(item) {
        const {
            text, corrective_actions = {}
        } = item;
        const {
            personal_factors = [], job_factors = [],
            custom_personal_factors = [], custom_job_factors = []
        } = corrective_actions;
        let total_cost = personal_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
        total_cost += job_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
        total_cost += custom_personal_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
        total_cost += custom_job_factors.map(v => v.cost || 0).reduce((v1, v2) => v1 + v2, 0);
        let sum = personal_factors.length + job_factors.length + custom_personal_factors.length + custom_job_factors.length;
        console.log('calcItemStats', item, total_cost)
        return {total_cost, sum};
    }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        const {text, corrective_actions} = item;

        const renderReadonly = () => {
            console.log('renderItem', item)
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td padding-l-0 padding-r-0">{text}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </TRow>;
        };

        const renderEditable = () => {
            const {total_cost, sum} = this.calcItemStats(item);
            console.log('renderItem', item)
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td"><span>{text}</span></div>
                <div className="td fixed-flex min-w-170"><span>{sum}</span></div>
                <div className="td fixed-flex min-w-80"><span>R {total_cost || '0.00'}</span></div>
                <div className="td fixed-flex min-w-100">
                    <Button idx={n} className="btn btn-primary pull-right w-80" onClick={this.onEdit}>
                        Add/Edit
                    </Button>
                </div>
            </TRow>;
        };

        return readonly ? renderReadonly() : renderEditable();
    }

    renderReadonly() {
        const {title} = this.props;
        return (<Table className="CorrectiveActionListByCauseTable w-full margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td padding-l-0 padding-r-0 font-size-12">{title}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }

    renderEditable() {
        const {title} = this.props;
        const total_cost = this.state.list.map(item => this.calcItemStats(item).total_cost).reduce((v1, v2) => v1 + v2, 0);
        const sum = this.state.list.map(item => this.calcItemStats(item).sum).reduce((v1, v2) => v1 + v2, 0);
        return (<Table className="CorrectiveActionListByCauseTable w-full margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td font-size-12">{title}</div>
                <div className="td fixed-flex min-w-170 font-size-12">No. Of Corrective Actions</div>
                <div className="td fixed-flex min-w-80 font-size-12">Sub-Total</div>
                <div className="td fixed-flex min-w-110 padding-0"></div>
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            <div className="stats hor-center">
                <div className="flex">
                    <div>
                        <label className="">Corrective Actions Total No.</label>
                        <span>{sum}</span>
                    </div>
                    <div>
                        <label className="">Corrective Actions Total Cost</label>
                        <span>R {total_cost}</span>
                    </div>
                </div>
            </div>
        </Table>);
    }

    render() {
        const {readonly} = this.props;
        return readonly ? this.renderReadonly() : this.renderEditable();
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InvestigationFindingsTable">
@observer
class InvestigationFindingsTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        this.state.list = (defaultValue || []).map(v => {
            return v ? {text: v.text || v} : null;
        });

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item && item.text) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
                <div className="td"><span>{item.text}</span></div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="text" type="text"
                                    placeholder="Type investigation finding here"
                                    required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10"
                            onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table className="col-lg-12 margin-0 padding-0 min-h-100">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td">Finding</div>
                <div className="td fixed-flex min-w-70 padding-0"></div>
            </THead>
            <TBody ref="body" title="Investigation Finding" renderItem={this.renderItem} onClick={this.onClick}
                   state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentStatus">
@observer
class IncidentStatus extends React.Component {

    @computed get status() {
        let {
            data: {
                status_closed,
                status_approved,
                status_approved_investigation,
                status_awaiting_approval,
                status_investigating,
                status_awaiting_investigation_approval,
                investigation,
            },
        } = this.props.item;

        const {
            investigation_team_list = [],
        } = investigation || {};

        const AssignedInvestigator = !!investigation_team_list && investigation_team_list.isNotEmpty();
        const isInvestigating = !!investigation;

        if (status_closed) {
            return ['Closed Incident'];
        } else if (status_investigating) {
            return ['Investigating'];
        } else if (status_awaiting_approval) {
            return ['Awaiting Approval'];
        } else {
            const status = [];
            if (status_awaiting_investigation_approval) {
                status.push('Awaiting Investigation Approval');
            }
            if (status_approved) {
                status.push('Approved Incident');
            }
            if (status_approved_investigation) {
                status.push('Approved Investigation');
            }
            if (AssignedInvestigator) {
                status.push('Assigned Investigator');
            }
            return status;
        }
    }

    render() {
        const {item} = this.props;
        const {status} = this;

        return <div key={new Date().getTime()} className="td fixed-flex min-w-140">
            <h6 className="xs-shown font-size-13">Status</h6>
            {status.map(v => <span>{v}</span>)}
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentInvestigationStatus">
@observer
class IncidentInvestigationStatus extends React.Component {

    @computed get status() {
        let {
            data: {
                status_closed,
                status_approved,
                status_approved_investigation,
                status_awaiting_approval,
                status_investigating,
                status_awaiting_investigation_approval,
                investigation,
            },
        } = this.props.item;

        const {
            investigation_team_list = [],
        } = investigation || {};

        const AssignedInvestigator = !!investigation_team_list && investigation_team_list.isNotEmpty();
        const isInvestigating = !!investigation;

        if (status_closed) {
            return ['Closed Incident'];
        } else if (status_investigating) {
            return ['Investigating'];
        } else if (status_awaiting_approval) {
            return ['Awaiting Approval'];
        } else {
            const status = [];
            if (status_awaiting_investigation_approval) {
                status.push('Awaiting Investigation Approval');
            }
            if (status_approved_investigation) {
                status.push('Approved Investigation');
            }
            if (AssignedInvestigator) {
                status.push('Assigned Investigator');
            }
            return status;
        }
    }

    render() {
        const {item} = this.props;
        const {status} = this;

        return <div key={new Date().getTime()} className="td fixed-flex min-w-140">
            <h6 className="xs-shown font-size-13">Status</h6>
            {status.map(v => <span>{v}</span>)}
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentTableRow">
@observer
class IncidentTableRow extends React.Component {

    render() {
        const {item, idx, onRenderActionCell, className, onClick} = this.props;

        let {
            id,
            data: {
                created_at,
                client, project, site,
                investigation,
                //
                group,
                incident_date,
                short_desc,
                location,
                exact_location,
                //
                category_list,
                sub_category_list,
                sector_list,
                activity_list,
                //
            }
        } = item;

        const __className = (className || "") + " w-full";

        return <TRow key={id} className={__className}>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Incident Date</h6>
                {Dates.formatDate(incident_date) || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Group</h6>
                {group || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Category</h6>
                {category_list ? category_list.map(({category: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Sub-Category</h6>
                {sub_category_list ? sub_category_list.map(({sub_category: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Sector(s)</h6>
                {sector_list ? sector_list.map(({sector: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Activities</h6>
                {activity_list ? activity_list.map(({activity: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Description</h6>
                {short_desc || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Location</h6>
                {exact_location || 'N/A'}
            </div>
            <IncidentStatus key={new Date().getTime()} item={item}/>
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentInvestigationTableRow">
@observer
class IncidentInvestigationTableRow extends React.Component {

    render() {
        const {item, idx, onRenderActionCell, className, onClick} = this.props;

        let {
            id,
            data: {
                created_at,
                client, project, site,
                investigation: {
                    //1

                    //2
                    investigation_team_list,//
                    due_date,//
                    //3
                    investigation_details,//
                    investigation_findings_list,//
                    investigation_findings_further_desc,//
                    document_list,//
                    //4
                    severity,//{consequence, likelihood}
                    //5
                    cause_analysis,//
                    //6
                    corrective_actions,//
                    //7
                    distribution_list,//
                    //8
                    weather_condition_list,//
                    //9
                    protective_equipment_worn_list,//
                    //10
                    class_list,//
                    //11
                    environment_list,//
                    //12
                    estimated_costs_damages,//
                    estimated_costs_medical,//
                    estimated_costs_salaries_wages,//
                    estimated_costs_investigations,//
                    estimated_costs_others,//
                },
                //
                group,
                incident_date,
                short_desc,
                location,
                exact_location,
                //
                category_list,
                sub_category_list,
                sector_list,
                activity_list,
                //
            }
        } = item;

        console.log('Investigations', item)

        const __className = (className || "") + " w-full";

        return <TRow key={id} className={__className}>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Incident Date</h6>
                {Dates.formatDate(incident_date) || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Incident Date</h6>
                {Dates.formatDate(due_date) || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Group</h6>
                {group || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Category</h6>
                {category_list ? category_list.map(({category: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Sub-Category</h6>
                {sub_category_list ? sub_category_list.map(({sub_category: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Sector(s)</h6>
                {sector_list ? sector_list.map(({sector: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Activities</h6>
                {activity_list ? activity_list.map(({activity: {name}}) => (<span>{name}</span>)) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Description</h6>
                {short_desc || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Location</h6>
                {exact_location || 'N/A'}
            </div>
            <IncidentInvestigationStatus key={new Date().getTime()} item={item}/>
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

export {
    CauseAnalysisPanel, RemedialOrCorrectiveActionPanel,
    InvestigationFindingsTable, IncidentStatus,
    IncidentTableRow, IncidentInvestigationTableRow,
};
