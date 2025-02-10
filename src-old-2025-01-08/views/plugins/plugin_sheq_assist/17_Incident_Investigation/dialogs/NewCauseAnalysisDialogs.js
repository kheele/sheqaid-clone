//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, SelectTable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewCauseAnalysisDialogs.lazy.css";
import updateIncidentCauseAnalysisRoot
    from "mutations/all/Incident/IncidentCauseAnalysisRoot/updateIncidentCauseAnalysisRoot";
import updateIncidentCauseAnalysisImmediate
    from "mutations/all/Incident/IncidentCauseAnalysisImmediate/updateIncidentCauseAnalysisImmediate";
import {FormControls, Row} from "components/FormComponents";
//</editor-fold>

//<editor-fold desc="NewCauseAnalysisRootDialog">
@observer
class NewCauseAnalysisRootDialog extends ANewDialog {
    pageKey = "NewCauseAnalysisDialogs";
    title = "Create Indirect/Basic/Root Cause Analysis";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return ControlsRoot;
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel"
                    onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }
}

//</editor-fold>

//<editor-fold desc="NewCauseAnalysisImmediateDialog">
@observer
class NewCauseAnalysisImmediateDialog extends ANewDialog {
    pageKey = "NewCauseAnalysisDialogs";
    title = "Create Direct/Immediate Cause Analysis";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return ControlsImmediate;
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel"
                    onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }
}

//</editor-fold>

//<editor-fold desc="ControlsImmediate">
@observer
class ControlsImmediate extends React.Component {

    @observable
    state = {
        lists: {
            sub_standard_practices_or_unsafe_acts: [
                'Operating Equipment Without Authority',
                'Failure To Warn',
                'Failure To Secure Or Contain',
                'Operating In Improper Manner e.g. Speed',
                'Making Safety Or Control Devices Inoperable',
                'Removing Safety Or Control Devices',
                'Using Defective Equipment',
                'Using Equipment Improperly Or Incorrectly',
                'Failure To Use PPE',
                'Improper Loading',
                'Improper Placement',
                'Improper Lifting',
                'Improper Position For Task',
                'Servicing Equipment In Operation',
                'Under The Influence Of Alcohol Or Drugs',
                'Improper Resource Use Or Disposal'
            ].map(text => ({text})),
            sub_standard_practices_or_unsafe_conditions: [
                'Inadequate Guards Or Barriers',
                'Inadequate Protective/Control Equipment',
                'Improper Protective/Control Equipment',
                'Defective Tools/Equipment/Material',
                'Congestion Or Restricted Movement',
                'Inadequate Warning Systems',
                'Fire And Explosion Hazards',
                'Poor Housekeeping Or Disorderly Workplace',
                'Hazardous Environment',
                'Noise Exposures',
                'Radiation Exposures',
                'High/Low Temperature Exposures',
                'HCS Exposures (Dust, Fume, Vapour, etc.)',
                'Inadequate/Excessive Illumination',
                'Inadequate/Inappropriate Ventilation',
                'Inappropriate/Unsafe Design/Construction'
            ].map(text => ({text})),
        }
    };

    constructor() {
        super();

        this.form = new Form();
        this.form.addChangeMany([
            "sub_standard_practices_or_unsafe_acts",
            "sub_standard_practices_or_unsafe_conditions",
        ], this.on_change_sub_standard_practices_or_unsafe_any.bind(this));
        // this.form.addChangeOne("custom_sub_standard_practices_or_unsafe_acts", this.on_change_custom_sub_standard_practices_or_unsafe_acts.bind(this));
        // this.form.addChangeOne("custom_sub_standard_practices_or_unsafe_conditions", this.on_change_custom_sub_standard_practices_or_unsafe_conditions.bind(this));
    }

    // <editor-fold defaultstate="collapsed" desc="onChange">
    on_change_sub_standard_practices_or_unsafe_any(el, name, val) {
        if (val) {
            if (name === 'sub_standard_practices_or_unsafe_acts') {

            } else if (name === 'sub_standard_practices_or_unsafe_conditions') {

            }

            if (val.id) {

            } else {
                val.type = name;
            }
        }
    }

    on_change_custom_sub_standard_practices_or_unsafe_acts(el, val) {
        if (val) {

        }
    }

    on_change_custom_sub_standard_practices_or_unsafe_conditions(el, val) {
        if (val) {

        }
    }

    // </editor-fold>

    //<editor-fold desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, investigation, cause_analysis} = this;

        if (!form.isValid('sub_standard_practices_or_unsafe_acts') && !form.isValid('sub_standard_practices_or_unsafe_conditions') &&
            !form.isValid('custom_sub_standard_practices_or_unsafe_acts') && !form.isValid('custom_sub_standard_practices_or_unsafe_conditions')) {
            infoDialog.open('Please add at least one Direct/Immediate Cause');
            return;
        }

        const {
            sub_standard_practices_or_unsafe_acts, sub_standard_practices_or_unsafe_conditions,
            custom_sub_standard_practices_or_unsafe_acts, custom_sub_standard_practices_or_unsafe_conditions
        } = form.data;

        if (this.isNew) {
            const data = {
                cause_analysis_cause_list: {
                    data: [
                        ...(sub_standard_practices_or_unsafe_acts || []).filter(v => !!v).map(v => ({type: 'sub_standard_practices_or_unsafe_acts', ...v})),
                        ...(sub_standard_practices_or_unsafe_conditions || []).filter(v => !!v).map(v => ({type: 'sub_standard_practices_or_unsafe_conditions', ...v})),
                        ...(custom_sub_standard_practices_or_unsafe_acts || []).filter(v => !!v).map(v => ({type: 'custom_sub_standard_practices_or_unsafe_acts', ...v})),
                        ...(custom_sub_standard_practices_or_unsafe_conditions || []).filter(v => !!v).map(v => ({type: 'custom_sub_standard_practices_or_unsafe_conditions', ...v})),
                    ],
                },
            };

            console.log(data)

            onSaved && onSaved(data);
        } else {
            progressDialog.open();
            try {
                const data = {
                    cause_analysis_cause_list: [
                        ...(sub_standard_practices_or_unsafe_acts || []).filter(v => !!v).map(v => ({type: 'sub_standard_practices_or_unsafe_acts', ...v})),
                        ...(sub_standard_practices_or_unsafe_conditions || []).filter(v => !!v).map(v => ({type: 'sub_standard_practices_or_unsafe_conditions', ...v})),
                        ...(custom_sub_standard_practices_or_unsafe_acts || []).filter(v => !!v).map(v => ({type: 'custom_sub_standard_practices_or_unsafe_acts', ...v})),
                        ...(custom_sub_standard_practices_or_unsafe_conditions || []).filter(v => !!v).map(v => ({type: 'custom_sub_standard_practices_or_unsafe_conditions', ...v})),
                    ],
                };

                const savedCauseAnalysisImmediate = await updateIncidentCauseAnalysisImmediate({id: this.immediate_analysis.id, ...data});
                if (savedCauseAnalysisImmediate) {
                    onSaved && onSaved(savedCauseAnalysisImmediate.data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    this.props.close();
                } else {
                    infoDialog.open("Record couldn't be updated.");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setTimeout(() => progressDialog.close());
            }
        }
    }
    //</editor-fold>

    get isNew() {
        return !this.immediate_analysis.id;
    }

    get investigation() {
        return this.dialog.extraProp('investigation');
    }

    get cause_analysis() {
        return this.dialog.extraProp('cause_analysis');
    }

    get immediate_analysis() {
        return this.props.state.item || {};
    }

    renderItem(item, n) {
        return item.text;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.immediate_analysis)
            return null;

        let {
            props: {onFormOpen, onFormBack, onFormNext,},
            immediate_analysis, immediate_analysis: {
                sub_standard_practices_or_unsafe_acts: default_sub_standard_practices_or_unsafe_acts,
                sub_standard_practices_or_unsafe_conditions: default_sub_standard_practices_or_unsafe_conditions,
                custom_sub_standard_practices_or_unsafe_acts: default_custom_sub_standard_practices_or_unsafe_acts,
                custom_sub_standard_practices_or_unsafe_conditions: default_custom_sub_standard_practices_or_unsafe_conditions
            }
        } = this;
        const {sub_standard_practices_or_unsafe_acts, sub_standard_practices_or_unsafe_conditions} = this.state.lists;
        // if (default_sub_standard_practices_or_unsafe_acts) {
        //     default_sub_standard_practices_or_unsafe_acts = default_sub_standard_practices_or_unsafe_acts.map(({text}) => text);
        // }
        // if (default_sub_standard_practices_or_unsafe_conditions) {
        //     default_sub_standard_practices_or_unsafe_conditions = default_sub_standard_practices_or_unsafe_conditions.map(({text}) => text);
        // }
        if (default_custom_sub_standard_practices_or_unsafe_acts) {
            default_custom_sub_standard_practices_or_unsafe_acts = [...default_custom_sub_standard_practices_or_unsafe_acts, null];
        }
        if (default_custom_sub_standard_practices_or_unsafe_conditions) {
            default_custom_sub_standard_practices_or_unsafe_conditions = [...default_custom_sub_standard_practices_or_unsafe_conditions, null];
        }
        console.log('immediate_analysis', immediate_analysis)
        return <FormControls>
            <Row
                rendered
                idx={1}
                title="1. Sub-Standard Practices / Unsafe Acts"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectTable
                    name="sub_standard_practices_or_unsafe_acts"
                    desc="Sub-Standard Practices / Unsafe Acts"
                    className="col-lg-12 no-padding"
                    list={sub_standard_practices_or_unsafe_acts}
                    defaultValue={default_sub_standard_practices_or_unsafe_acts}
                    renderItem={this.renderItem}
                    isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Sub-Standard Conditions / Unsafe Conditions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectTable
                    name="sub_standard_practices_or_unsafe_conditions"
                    desc="Sub-Standard Conditions / Unsafe Conditions"
                    className="col-lg-12 no-padding"
                    list={sub_standard_practices_or_unsafe_conditions}
                    defaultValue={default_sub_standard_practices_or_unsafe_conditions}
                    renderItem={this.renderItem}
                    isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Sub-Standard Practices / Unsafe Acts"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <CustomCauseTable
                    name="custom_sub_standard_practices_or_unsafe_acts"
                    desc="Sub-Standard Practices / Unsafe Acts"
                    className="col-lg-12 no-padding"
                    defaultValue={default_custom_sub_standard_practices_or_unsafe_acts}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Sub-Standard Conditions / Unsafe Conditions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <CustomCauseTable
                    name="custom_sub_standard_practices_or_unsafe_conditions"
                    desc="Sub-Standard Conditions / Unsafe Conditions"
                    className="col-lg-12 no-padding"
                    defaultValue={default_custom_sub_standard_practices_or_unsafe_conditions}
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}
//</editor-fold>

//<editor-fold desc="ControlsRoot">
@observer
class ControlsRoot extends React.Component {

    @observable
    state = {
        lists: {
            personal_factors: [
                'Unsuitable Physical/Physiological Capability',
                'Unsuitable Mental/Psychological Capability',
                'Physical Stress',
                'Lack Of Knowledge',
                'Lack Of Skill',
                'Improper Motivation',
                'Task Rarely Performed'
            ].map(text => ({text})),
            job_factors: [
                'Inadequate Leadership And/Or Supervision',
                'Inadequate Engineering Or Planning',
                'Inadequate Purchasing',
                'Inadequate Maintanance',
                'Inadequate Tools And Equipment',
                'Inadequate Work Standards/Procedures',
                'Wear And Tear',
                'Abuse Or Misuse'
            ].map(text => ({text})),
        }
    };

    constructor() {
        super();

        this.form = new Form();
    }

    //<editor-fold desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, investigation, cause_analysis} = this;

        if (!form.isValid('personal_factors') && !form.isValid('job_factors') &&
            !form.isValid('custom_personal_factors') && !form.isValid('custom_job_factors')) {
            infoDialog.open('Please add at least one Indirect/Basic/Root Cause');
            return;
        }

        const {
            personal_factors, job_factors,
            custom_personal_factors, custom_job_factors
        } = form.data;

        if (this.isNew) {
            const data = {
                cause_analysis_cause_list: {
                    data: [
                        ...(personal_factors || []).filter(v => !!v).map(v => ({type: 'personal_factors', ...v})),
                        ...(job_factors || []).filter(v => !!v).map(v => ({type: 'job_factors', ...v})),
                        ...(custom_personal_factors || []).filter(v => !!v).map(v => ({type: 'custom_personal_factors', ...v})),
                        ...(custom_job_factors || []).filter(v => !!v).map(v => ({type: 'custom_job_factors', ...v})),
                    ],
                },
            };

            console.log(data)

            onSaved && onSaved(data);
        } else {
            progressDialog.open();
            try {
                const data = {
                    cause_analysis_cause_list: [
                        ...(personal_factors || []).filter(v => !!v).map(v => ({type: 'personal_factors', ...v})),
                        ...(job_factors || []).filter(v => !!v).map(v => ({type: 'job_factors', ...v})),
                        ...(custom_personal_factors || []).filter(v => !!v).map(v => ({type: 'custom_personal_factors', ...v})),
                        ...(custom_job_factors || []).filter(v => !!v).map(v => ({type: 'custom_job_factors', ...v})),
                    ],
                };

                const savedCauseAnalysisRoot = await updateIncidentCauseAnalysisRoot({id: this.root_analysis.id, ...data});
                if (savedCauseAnalysisRoot) {
                    onSaved && onSaved(savedCauseAnalysisRoot.data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    this.props.close();
                } else {
                    infoDialog.open("Record couldn't be updated.");
                }
            } catch (err) {
                console.error(err);
                infoDialog.open("An error occurred. Please try again.");
            } finally {
                setTimeout(() => progressDialog.close());
            }
        }
    }
    //</editor-fold>

    get isNew() {
        return !this.root_analysis.id;
    }

    get investigation() {
        return this.dialog.extraProp('investigation');
    }

    get cause_analysis() {
        return this.dialog.extraProp('cause_analysis');
    }

    get root_analysis() {
        return this.props.state.item || {};
    }

    renderItem(item, n) {
        return item.text;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.root_analysis)
            return null;
        let {
            props:{onFormOpen, onFormBack, onFormNext,},
            root_analysis, root_analysis: {
                personal_factors: default_personal_factors,
                job_factors: default_job_factors,
                custom_personal_factors: default_custom_personal_factors,
                custom_job_factors: default_custom_job_factors
            }
        } = this;

        const {personal_factors, job_factors} = this.state.lists;

        if (default_custom_personal_factors) {
            default_custom_personal_factors = [...default_custom_personal_factors, null];
        }
        if (default_custom_job_factors) {
            default_custom_job_factors = [...default_custom_job_factors, null];
        }

        console.log('root_analysis', root_analysis)
        return <FormControls>
            <Row
                rendered
                idx={1}
                title="1. Personal Factors"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectTable
                    name="personal_factors" desc="Personal Factors" className="col-lg-6 no-padding"
                    list={personal_factors} defaultValue={default_personal_factors}
                    renderItem={this.renderItem}
                    isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Job Factors"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectTable
                    name="job_factors" desc="Job Factors" className="col-lg-6 no-padding"
                    list={job_factors} defaultValue={default_job_factors}
                    renderItem={this.renderItem}
                    isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Custom Personal Factors"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <CustomCauseTable name="custom_personal_factors" desc="Personal Factors"
                                  className="col-lg-12 no-padding" defaultValue={default_custom_personal_factors}
                                  onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Custom Job Factors"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <CustomCauseTable name="custom_job_factors" desc="Job Factors" className="col-lg-12 no-padding"
                                  defaultValue={default_custom_job_factors} onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    //</editor-fold>
}
//</editor-fold>

//<editor-fold desc="CustomCauseTable">
@observer
class CustomCauseTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        if (defaultValue) {
            this.state.list = defaultValue;
            const {onChange, name} = this.props;
            onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);
        }

        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item && item.text) {
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
                <div className="td"><span>{item.text}</span></div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="text" type="text" placeholder="Type here" required
                                    className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-v-15"
                            onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        const {desc} = this.props;
        return (<Table className="col-lg-6 margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td">Custom {desc}</div>
                <div className="td fixed-flex min-w-70 padding-0"></div>
            </THead>
            <TBody ref="body" title={"Custom " + desc} renderItem={this.renderItem} onClick={this.onClick}
                   state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}
//</editor-fold>

export {NewCauseAnalysisRootDialog, NewCauseAnalysisImmediateDialog};
