// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from 'views/plugins/utils';
import {Dates, execWhen} from 'utils/Utils';
import {AddFilesGridViewInput, ClearableInput, Clickable, ProfileField, RowOrgs} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import {mapIncidentCorrectiveActions, mapIncidentPersonDetails} from 'utils/ArrayMapperUtils';
import {CauseAnalysisPanel, InvestigationFindingsTable, RemedialOrCorrectiveActionPanel} from './IncidentComponents';
import {FormControls, NavButtons, RiskRating, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
// </editor-fold>
import style from "./NewIncidentInvestigationDialog.lazy.css";
import insertProxyEmployeeIncidentInvestigator
    from "../../../../../mutations/all/ProxyEmployeeIncidentInvestigator/insertProxyEmployeeIncidentInvestigator";
import deleteProxyEmployeeIncidentInvestigator
    from "../../../../../mutations/all/ProxyEmployeeIncidentInvestigator/deleteProxyEmployeeIncidentInvestigator";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewIncidentInvestigationDialog";
    title = "Create Incident Investigation";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/17_Incident_Investigation/";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            weather_condition_list: ['Hot', 'Warm', 'Cool', 'Fine', 'Rainy', 'Windy', 'Snow', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            protective_equipment_worn_list: ['Hard Hat', 'Safety Boots', 'Eye Protection', 'Ear Protection', 'Fall Protection', 'Respiratory', 'Face Shield', 'Gloves'].map(value => {
                return {value, text: value, checked: false};
            }),
            class_list: ['Employee', 'Sub-Contractor', 'Visitor / Public', 'Client', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            disease_list: ['Safety', 'Health', 'Environment', 'Quality', 'Financial', 'Food Safety', 'Audit / Non-Conformance'].map(value => {
                return {value, text: value, checked: false};
            }),
            damage_list: ['Buildings', 'Machinery', 'Equipment', 'Tools', 'Vehicles', 'Product', 'Safety', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            environment_list: ['Waste Management', 'Hazardous Material', 'Public Safety', 'Public Complaint', 'Legal Non-Compliant', 'Spillage', 'Contractor'].map(value => {
                return {value, text: value, checked: false};
            }),
            consequence: getRiskRatingConsequenceList(),
            likelihood: getRiskRatingLikelihoodList()
        },
        riskRatingSelected: {
            consequence: null,
            likelihood: null
        }
    };

    // </editor-fold>

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("consequence", this.onChangeConsequence.bind(this));
        this.form.addChangeOne("likelihood", this.onChangeLikelihood.bind(this));
        this.form.addChangeOne("risk_rating", this.onChangeRiskRating.bind(this));
        this.form.addChangeOne("cause_analysis", this.onChangeCauseAnalysis.bind(this));
    }

    // <editor-fold defaultstate="collapsed" desc="onChange">
    onChangeConsequence(el, val) {
        if (val) {
            execWhen(() => this.refs.likelihood).then(() => {
                const {likelihood: likelihood_ref, risk_rating} = this.refs;
                this.state.riskRatingSelected.consequence = val;
                if (likelihood_ref.hasValue) {
                    this.state.riskRatingSelected.likelihood = likelihood_ref.value;
                }
            });
        }
    }

    onChangeLikelihood(el, val) {
        if (val) {
            execWhen(() => this.refs.consequence).then(() => {
                const {consequence: consequence_ref, risk_rating} = this.refs;
                this.state.riskRatingSelected.likelihood = val;
                if (consequence_ref.hasValue) {
                    this.state.riskRatingSelected.consequence = consequence_ref.value;
                }
            });
        }
    }

    onChangeRiskRating(el, val) {
        if (val) {
            const {consequence: consequence_ref, likelihood: likelihood_ref} = this.refs;
            this.state.riskRatingSelected.consequence = val.consequence;
            this.state.riskRatingSelected.likelihood = val.likelihood;

            const consequence = this.state.lists.consequence.find(item => item.value === val.consequence);
            const likelihood = this.state.lists.likelihood.find(item => item.value === val.likelihood);
            consequence && consequence_ref.onChange(consequence);
            likelihood && likelihood_ref.onChange(likelihood);
        }
    }

    onChangeCauseAnalysis(el, val) {
        if (val) {
            execWhen(() => this.refs.corrective_actions).then(corrective_actions_ref => {
                corrective_actions_ref.setCauseAnalysis(val);
            });
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
                infoDialog.open('Investigation Team is required');
                return;
            }
            if (!form.isValid('investigation_due_date')) {
                infoDialog.open('Investigation Due Date is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
            infoDialog.open('Investigation Team is required');
            return;
        }
        if (!form.isValid('investigation_due_date')) {
            infoDialog.open('Investigation Due Date is required');
            return;
        }

        const {
            //1
            investigation_team_list,
            investigation_due_date,
            //2
            investigation_details,
            investigation_findings_list,
            investigation_findings_further_desc,
            document_list,
            //3
            consequence,
            likelihood,
            risk_rating,
            //4
            cause_analysis,
            //5
            corrective_actions,
            //6
            distribution_list,
            //7
            weather_condition_list,
            //8
            protective_equipment_worn_list,
            //9
            class_list,
            //10
            environment_list,
            //11
            estimated_costs_damages,
            estimated_costs_medical,
            estimated_costs_salaries_wages,
            estimated_costs_investigations,
            estimated_costs_others
        } = form.data;

        const data = {};

        if (this.investigation) {
            data.investigation = {};
            if (this.investigation.status && (isArray(this.investigation.status) || isObservableArray(this.investigation.status))) {
                data.investigation.status = toJS(this.investigation.status);
            } else {
                data.investigation.status = [];
            }

            //sec1_data
            const {sec1_data: old_sec1_data} = this.investigation;
            if (investigation_team_list && (!old_sec1_data || !old_sec1_data.investigation_team_list || toJS(old_sec1_data.investigation_team_list.map(v => v.id)) !== toJS(investigation_team_list.filter(v => !!v).map(v => v.other_person || v.id || v.employee.id)))) {
                data.investigation.sec1_data = {
                    investigation_team_list: investigation_team_list.filter(v => !!v).map(mapIncidentPersonDetails)
                };
            }
            if (investigation_due_date && (!old_sec1_data || old_sec1_data.investigation_due_date !== investigation_due_date.getTime())) {
                if (!data.investigation.sec1_data) {
                    data.investigation.sec1_data = {};
                }
                data.investigation.sec1_data.investigation_due_date = investigation_due_date.getTime();
            }

            //sec2_data
            const {sec2_data: old_sec2_data} = this.investigation;
            if (!old_sec2_data || old_sec2_data.investigation_details !== investigation_details) {
                data.investigation.sec2_data = {
                    investigation_details
                };
            }
            if (investigation_findings_list && (!old_sec2_data || !old_sec2_data.investigation_findings_list || toJS(old_sec2_data.investigation_findings_list) !== toJS(investigation_findings_list.filter(v => !!v).map(v => isString(v) ? v : v.text)))) {
                if (!data.investigation.sec2_data) {
                    data.investigation.sec2_data = {};
                }
                data.investigation.sec2_data.investigation_findings_list = toJS(investigation_findings_list.filter(v => !!v).map(v => isString(v) ? v : v.text));
            }
            if (!old_sec2_data || old_sec2_data.investigation_findings_further_desc !== investigation_findings_further_desc) {
                if (!data.investigation.sec2_data) {
                    data.investigation.sec2_data = {};
                }
                data.investigation.sec2_data.investigation_findings_further_desc = investigation_findings_further_desc;
            }
            if (document_list && (!old_sec2_data || !old_sec2_data.document_list || toJS(old_sec2_data.document_list) !== toJS(document_list.filter(v => !!v).map(v => v.path ? v.path : v)))) {
                if (!data.investigation.sec2_data) {
                    data.investigation.sec2_data = {};
                }
                data.investigation.sec2_data.document_list = toJS(document_list.filter(v => !!v).map(v => v.path ? v.path : v));
            }

            //sec3_data
            const {sec3_data: old_sec3_data} = this.investigation;
            if (!old_sec3_data || old_sec3_data.consequence !== consequence) {
                data.investigation.sec3_data = {
                    consequence
                };
            }
            if (!old_sec3_data || old_sec3_data.likelihood !== likelihood) {
                if (!data.investigation.sec3_data) {
                    data.investigation.sec3_data = {};
                }
                data.investigation.sec3_data.likelihood = likelihood;
            }
            if (!old_sec3_data || old_sec3_data.risk_rating !== risk_rating) {
                if (!data.investigation.sec3_data) {
                    data.investigation.sec3_data = {};
                }
                data.investigation.sec3_data.risk_rating = risk_rating;
            }

            //sec4_data
            const {sec4_data: old_sec4_data} = this.investigation;
            if (cause_analysis && (!old_sec4_data || !old_sec4_data.cause_analysis || toJS(old_sec4_data.cause_analysis) !== toJS(cause_analysis))) {
                data.investigation.sec4_data = {
                    cause_analysis: toJS(cause_analysis)
                };
            }

            //sec5_data
            const {sec5_data: old_sec5_data} = this.investigation;
            if (corrective_actions && (!old_sec5_data || !old_sec5_data.corrective_actions || toJS(old_sec5_data.corrective_actions.map(mapIncidentCorrectiveActions)) !== toJS(corrective_actions.filter(v => !!v).map(mapIncidentCorrectiveActions)))) {
                data.investigation.sec5_data = {
                    corrective_actions: toJS(corrective_actions.filter(v => !!v).map(mapIncidentCorrectiveActions))
                };
            }

            //sec6_data
            const {sec6_data: old_sec6_data} = this.investigation;
            if (distribution_list && (!old_sec6_data || !old_sec6_data.distribution_list || toJS(old_sec6_data.distribution_list.map(mapIncidentPersonDetails)) !== toJS(distribution_list.filter(v => !!v).map(mapIncidentPersonDetails)))) {
                data.investigation.sec6_data = {
                    distribution_list: toJS(distribution_list.map(mapIncidentPersonDetails))
                };
            }

            let {
                //7
                weather_condition_list: old_weather_condition_list = [],
                //8
                protective_equipment_worn_list: old_protective_equipment_worn_list = [],
                //9
                class_list: old_class_list = [],
                //10
                environment_list: old_environment_list = [],
                //11
                estimated_costs_damages: old_estimated_costs_damages,
                estimated_costs_medical: old_estimated_costs_medical,
                estimated_costs_salaries_wages: old_estimated_costs_salaries_wages,
                estimated_costs_investigations: old_estimated_costs_investigations,
                estimated_costs_others: old_estimated_costs_others
            } = this.investigation;
            //7
            if (weather_condition_list && weather_condition_list.slice() !== old_weather_condition_list.slice()) {
                data.investigation.weather_condition_list = toJS(weather_condition_list);
            }
            //8
            if (protective_equipment_worn_list && protective_equipment_worn_list.slice() !== old_protective_equipment_worn_list.slice()) {
                data.investigation.protective_equipment_worn_list = toJS(protective_equipment_worn_list);
            }
            //9
            if (class_list && class_list.slice() !== old_class_list.slice()) {
                data.investigation.class_list = toJS(class_list);
            }
            //10
            if (environment_list && environment_list.slice() !== old_environment_list.slice()) {
                data.investigation.environment_list = toJS(environment_list);
            }
            //11
            if (estimated_costs_damages && estimated_costs_damages !== old_estimated_costs_damages) {
                data.investigation.estimated_costs_damages = estimated_costs_damages;
            }
            if (estimated_costs_medical && estimated_costs_medical !== old_estimated_costs_medical) {
                data.investigation.estimated_costs_medical = estimated_costs_medical;
            }
            if (estimated_costs_salaries_wages && estimated_costs_salaries_wages !== old_estimated_costs_salaries_wages) {
                data.investigation.estimated_costs_salaries_wages = estimated_costs_salaries_wages;
            }
            if (estimated_costs_investigations && estimated_costs_investigations !== old_estimated_costs_investigations) {
                data.investigation.estimated_costs_investigations = estimated_costs_investigations;
            }
            if (estimated_costs_others && estimated_costs_others !== old_estimated_costs_others) {
                data.investigation.estimated_costs_others = estimated_costs_others;
            }
        } else {
            data.investigation = {
                status: [],
                sec1_data: {},
                sec2_data: {},
                sec3_data: {},
                sec4_data: {},
                sec5_data: {},
                sec6_data: {}
            };
            //sec1_data
            if (investigation_team_list) {
                console.log('investigation_team_list', investigation_team_list)
                data.investigation.sec1_data.investigation_team_list = toJS(investigation_team_list.map(mapIncidentPersonDetails));
            }
            if (investigation_due_date) {
                data.investigation.sec1_data.investigation_due_date = investigation_due_date.getTime();
            }

            //sec2_data
            if (investigation_details) {
                data.investigation.sec2_data.investigation_details = investigation_details;
            }
            if (investigation_findings_list) {
                data.investigation.sec2_data.investigation_findings_list = toJS(investigation_findings_list);
            }
            if (investigation_findings_further_desc) {
                data.investigation.sec2_data.investigation_findings_further_desc = investigation_findings_further_desc;
            }
            if (document_list) {
                data.investigation.sec2_data.document_list = toJS(document_list.map(({path}) => path));
            }
            //sec3_data
            if (consequence) {
                data.investigation.sec3_data.consequence = consequence;
            }
            if (likelihood) {
                data.investigation.sec3_data.likelihood = likelihood;
            }
            if (risk_rating) {
                data.investigation.sec3_data.risk_rating = risk_rating;
            }
            //sec4_data
            if (cause_analysis) {
                data.investigation.sec4_data.cause_analysis = toJS(cause_analysis);
            }
            //sec5_data
            if (corrective_actions) {
                data.investigation.sec5_data.corrective_actions = toJS(corrective_actions.filter(v => !!v).map(mapIncidentCorrectiveActions));
            }
            //sec6_data
            if (distribution_list) {
                data.investigation.sec6_data.distribution_list = toJS(distribution_list.map(mapIncidentPersonDetails));
            }

            //7
            if (weather_condition_list) {
                data.investigation.weather_condition_list = toJS(weather_condition_list);
            }
            //8
            if (protective_equipment_worn_list) {
                data.investigation.protective_equipment_worn_list = toJS(protective_equipment_worn_list);
            }
            //9
            if (class_list) {
                data.investigation.class_list = toJS(class_list);
            }
            //10
            if (environment_list) {
                data.investigation.environment_list = toJS(environment_list);
            }
            //11
            if (estimated_costs_damages) {
                data.investigation.estimated_costs_damages = estimated_costs_damages;
            }
            if (estimated_costs_medical) {
                data.investigation.estimated_costs_medical = estimated_costs_medical;
            }
            if (estimated_costs_salaries_wages) {
                data.investigation.estimated_costs_salaries_wages = estimated_costs_salaries_wages;
            }
            if (estimated_costs_investigations) {
                data.investigation.estimated_costs_investigations = estimated_costs_investigations;
            }
            if (estimated_costs_others) {
                data.investigation.estimated_costs_others = estimated_costs_others;
            }
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "investigation", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    get investigation() {
        return this.item.data.investigation;
    }

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
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
                }
            }
        } = this;

        console.log('=', item)

        return <FormControls>
            <RowOrgs
                client={client}
                project={project}
                site={site}
                readonly
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Incident Summary"
                >
                    <FormControls>
                        <Row
                            rendered
                            idx={1.1}
                            title="1.1 Basic Incident Details"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                        >
                            <ProfileField
                                name="incident_num"
                                title="Incident No."
                                value={id}
                                className="col-lg-6"
                            />
                            <ProfileField
                                name="group"
                                title="Incident Group"
                                value={group}
                                className="col-lg-6"
                            />
                            <ProfileField
                                name="short_desc"
                                title="Short Description"
                                value={short_desc}
                                className="col-lg-12"
                            />
                            <ProfileField
                                name="desc"
                                title="Incident Description"
                                value={desc}
                                className="col-lg-12"
                            />

                            <ProfileField
                                name="location"
                                title="Location"
                                value={location}
                                className="col-lg-6"
                            />
                            <ProfileField
                                name="exact_location"
                                title="Exact Location"
                                value={exact_location}
                                className="col-lg-6"
                            />
                        </Row>
                        <Row
                            rendered
                            idx={1.2}
                            title="1.2. Date & Time"
                            onFormOpen={onFormOpen}
                            onFormBack={onFormBack}
                            onFormNext={onFormNext}
                        >
                            <ProfileField name="incident_date" type="date" title="Date Incident Occurred"
                                          value={incident_date} className="col-lg-6"/>
                            <ProfileField name="incident_time" title="Time Incident Occurred"
                                          value={incident_time} className="col-lg-6"/>

                            <ProfileField name="date_reported" type="date" title="Date Reported"
                                          value={date_reported} className="col-lg-6"/>
                            <ProfileField name="time_reported" title="Time Reported"
                                          value={time_reported}
                                          className="col-lg-6"/>

                            <ProfileField name="time_shift" title="Time Shift"
                                          value={time_shift}
                                          className="col-lg-12"/>
                        </Row>
                        <Row
                            rendered
                            idx={1.3}
                            title="1.3. Incident Category/Sub-Category"
                            onFormOpen={onFormOpen}
                            onFormBack={onFormBack}
                        >
                            <ProfileField name="category_list" title="Category"
                                          value={(category_list || []).map(v => v.category.name).join(', ')}
                                          className="col-lg-12"/>
                            <ProfileField name="sub_category_list" title="Sub-Category"
                                          value={(sub_category_list || []).map(v => v.sub_category.name).join(', ')}
                                          className="col-lg-12"/>
                        </Row>
                    </FormControls>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Investigation Due Date & Team"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewEmployeeListTable
                    name="investigation_team_list"
                    defaultValue={investigation_team_list}
                    savable={!!this.investigation}
                    targetItem={this.investigation && {key: "investigation_id", item: this.investigation} || null}
                    insertFn={insertProxyEmployeeIncidentInvestigator}
                    deleteFn={deleteProxyEmployeeIncidentInvestigator}
                    onAttrs={({employee, other_person}) => ({
                        investigator_id: employee && employee.id,
                        investigator_other_id: other_person && other_person.id ? other_person.id : null,
                        investigator_other: other_person && !other_person.id ? {data: other_person} : null
                    })}
                    className="w-full-calc-add-10 -margin-l-10"
                    onChange={this.form.onChange}
                />
                <ClearableInput name="due_date" type="date" placeholder="Investigation Due Date..."
                                defaultValue={due_date} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Investigation Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="investigation_details" type="textarea" defaultValue={investigation_details}
                                placeholder="Details Of Investigation" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <label className="margin-t-10 w-full">Investigation Findings</label>
                <InvestigationFindingsTable name="investigation_findings_list"
                                            defaultValue={investigation_findings_list}
                                            onChange={this.form.onChange}/>
                <ClearableInput name="investigation_findings_further_desc" type="textarea"
                                defaultValue={investigation_findings_further_desc}
                                placeholder="Further Incident Investigation Findings" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <label className="margin-t-25 margin-l-20 w-full">Evidence Documents/Files</label>
                <AddFilesGridViewInput name="document_list" title="Add Document/File" defaultValue={document_list}
                                       onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Potential Risk(s) of Incident"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="consequence" name="consequence" type="radio" defaultValue={consequence}
                                placeholder="Consequence / Severity" className="col-lg-6 form-control" vertical
                                onChange={this.form.onChange} values={this.state.lists.consequence} returnValue/>
                <ClearableInput ref="likelihood" name="likelihood" type="radio" defaultValue={likelihood}
                                placeholder="Likelihood / Probability" className="col-lg-6 form-control" vertical
                                onChange={this.form.onChange} values={this.state.lists.likelihood} returnValue/>
                <label className="margin-t-10 hor-center w-full">Incident Risk Rating Index</label>
                <RiskRating selected={this.state.riskRatingSelected} ref="risk_rating" name="risk_rating"
                            onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Cause Analysis"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <CauseAnalysisPanel name="cause_analysis" defaultValue={cause_analysis} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Preventative / Corrective / Containment Actions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <RemedialOrCorrectiveActionPanel ref="corrective_actions" name="corrective_actions"
                                                 defaultValue={corrective_actions} onChange={this.form.onChange}
                                                 onBack={onFormBack}/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Distribution List"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewEmployeeListTable name="distribution_list" defaultValue={distribution_list}
                                      onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. Weather Conditions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="weather_condition_list" type="checkbox" placeholder="Weather Conditions"
                                defaultValue={weather_condition_list} vertical={3} className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.weather_condition_list}
                                returnValue/>
            </Row>
            <Row
                rendered
                idx={9}
                title="9. Protective Equipment Worn"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="protective_equipment_worn_list" type="checkbox"
                                placeholder="Protective Equipment Worn"
                                defaultValue={protective_equipment_worn_list} vertical={3}
                                className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.protective_equipment_worn_list}
                                returnValue/>
            </Row>
            <Row
                rendered
                idx={10}
                title="10. Class"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="class_list" type="checkbox" placeholder="Class" defaultValue={class_list}
                                vertical={3}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.class_list} returnValue/>
            </Row>
            <Row
                rendered
                idx={11}
                title="11. Environment"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="environment_list" type="checkbox" placeholder="Environment"
                                defaultValue={environment_list} vertical={3} className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.environment_list} returnValue/>
            </Row>
            <Row
                rendered
                idx={12}
                title="12. Estimated Costs"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput name="estimated_costs_damages" type="number" isCurrency placeholder="Damages"
                                defaultValue={estimated_costs_damages} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="estimated_costs_medical" type="number" isCurrency placeholder="Medical"
                                defaultValue={estimated_costs_medical} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="estimated_costs_salaries_wages" type="number" isCurrency
                                placeholder="Salaries / Wages"
                                defaultValue={estimated_costs_salaries_wages} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="estimated_costs_investigations" type="number" isCurrency
                                placeholder="Investigations"
                                defaultValue={estimated_costs_investigations} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="estimated_costs_others" type="number" isCurrency placeholder="Others"
                                defaultValue={estimated_costs_others} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default NewDialog;
