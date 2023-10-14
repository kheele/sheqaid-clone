// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from 'views/plugins/utils';
import {Dates, execWhen, ShouldUpdate} from 'utils/Utils';
import {AddFilesGridViewInput, ClearableInput, Clickable, ProfileField, RowOrgs} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import {mapIncidentCorrectiveActions, mapIncidentPersonDetails} from 'utils/ArrayMapperUtils';
import {CauseAnalysisPanel, InvestigationFindingsTable, RemedialOrCorrectiveActionPanel} from './IncidentComponents';
import {FormControls, NavButtons, RiskRating, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import style from "./NewIncidentInvestigationDialog.lazy.css";
import insertProxyEmployeeIncidentInvestigator
    from "mutations/all/ProxyEmployeeIncidentInvestigator/insertProxyEmployeeIncidentInvestigator";
import deleteProxyEmployeeIncidentInvestigator
    from "mutations/all/ProxyEmployeeIncidentInvestigator/deleteProxyEmployeeIncidentInvestigator";
import findByIdIncidentInvestigation
    from "mutations/all/Incident/IncidentInvestigation/findByIdIncidentInvestigation";
import updateIncidentInvestigation
    from "../../../../../mutations/all/Incident/IncidentInvestigation/updateIncidentInvestigation";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewIncidentInvestigationDialog";
    title = "Create Incident Investigation";
    findById = findByIdIncidentInvestigation;

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
                corrective_actions_ref.cause_analysis = val;
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
    async onSubmit(e, btn, onSaved) {
        let {
            form,
            item: {
                data: old_data,
                data: {
                    severity: old_severity = {},
                    cause_analysis: old_cause_analysis = {},
                    corrective_actions: old_corrective_actions = {},
                }
            }
        } = this;
        if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
            infoDialog.open('Investigation Team is required');
            return;
        }
        if (!form.isValid('investigation_due_date')) {
            infoDialog.open('Investigation Due Date is required');
            return;
        }

        const {
            //2
            investigation_team_list,//saved internally
            due_date,//
            //3
            investigation_details,//
            investigation_findings_list,//saved internally
            investigation_findings_further_desc,//
            document_list,//saved internally
            //4
            // severity,//{consequence, likelihood}
            consequence,
            likelihood,
            //5
            cause_analysis,//saved internally
            //6
            corrective_actions,//saved internally
            //7
            distribution_list,//saved internally
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
        } = form.data;

        const data = {};

        //2
        ShouldUpdate.checkDate(data, old_data, due_date, 'due_date');
        //3
        ShouldUpdate.check(data, old_data, investigation_details, 'investigation_details');
        ShouldUpdate.check(data, old_data, investigation_findings_further_desc, 'investigation_findings_further_desc');
        //8
        ShouldUpdate.checkBoxList(data, old_data, weather_condition_list, 'weather_condition_list');
        //9
        ShouldUpdate.checkBoxList(data, old_data, protective_equipment_worn_list, 'protective_equipment_worn_list');
        //10
        ShouldUpdate.checkBoxList(data, old_data, class_list, 'class_list');
        //11
        ShouldUpdate.checkBoxList(data, old_data, environment_list, 'environment_list');
        //12
        ShouldUpdate.check(data, old_data, estimated_costs_damages, 'estimated_costs_damages');
        ShouldUpdate.check(data, old_data, estimated_costs_medical, 'estimated_costs_medical');
        ShouldUpdate.check(data, old_data, estimated_costs_salaries_wages, 'estimated_costs_salaries_wages');
        ShouldUpdate.check(data, old_data, estimated_costs_investigations, 'estimated_costs_investigations');
        ShouldUpdate.check(data, old_data, estimated_costs_others, 'estimated_costs_others');

        //4
        {
            if(!old_severity) {
                old_severity = {};
            }
            const severity_data = {};
            ShouldUpdate.check(severity_data, old_severity, consequence, 'consequence');
            ShouldUpdate.check(severity_data, old_severity, likelihood, 'likelihood');
            // severity
            // consequence,
            // likelihood,

            if(Object.values(severity_data).isNotEmpty()) {
                if(old_severity.id) {
                    await updateIncidentInvestigationSeverity({id: old_severity.id, ...severity_data});
                } else {
                    const savedSeverity = await insertIncidentInvestigationSeverity(severity_data);
                    if(savedSeverity) {
                        data.severity_id = savedSeverity.id;
                    }
                }
            }
        }

        //6
        if(corrective_actions) {
            if(corrective_actions.id) {

            } else {
                // data.corrective_actions_id = ;
            }
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateIncidentInvestigation({id: this.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    get incident() {
        return this.props.dialog.extraProp('incident');
    }

    @computed get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;

        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog,
            },
            item, item: {
                id, data: {
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
            },
            incident,
        } = this;

        const {
            id: incidentId,
            data: {
                created_at,
                //0
                site,
                project,
                client,
                //1
                group,
                short_desc,
                desc,
                location,
                exact_location,
                // document_list,
                //2
                incident_date,
                incident_time,
                date_reported,
                time_reported,
                time_shift,
                //3
                category_list,
                //4
                sub_category_list,
                //7.4
                severity: incident_severity,
            },
        } = incident;

        console.log('=', item)

        const {
            consequence: incident_consequence,
            likelihood: incident_likelihood,
        } = incident_severity || {};

        const consequence = severity ? severity.consequence : incident_consequence;
        const likelihood = severity ? severity.likelihood : incident_likelihood;

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
                                value={incidentId}
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
                    savable
                    targetItem={{key: "investigation_id", item}}
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
                <CauseAnalysisPanel
                    name="cause_analysis"
                    investigation={item}
                    defaultValue={cause_analysis}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Preventative / Corrective / Containment Actions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <RemedialOrCorrectiveActionPanel
                    ref="corrective_actions"
                    name="corrective_actions"
                    investigation={item}
                    defaultValue={corrective_actions}
                    onChange={this.form.onChange}
                    onBack={onFormBack}
                />
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Distribution List"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewEmployeeListTable
                    name="distribution_list"
                    defaultValue={distribution_list}
                    savable
                    targetItem={{key: "investigation_id", item}}
                    insertFn={insertProxyEmployeeIncidentInvestigator}
                    deleteFn={deleteProxyEmployeeIncidentInvestigator}
                    onAttrs={({employee, other_person}) => ({
                        employee_id: employee && employee.id,
                        other_person_id: other_person && other_person.id ? other_person.id : null,
                        other_person: other_person && !other_person.id ? {data: other_person} : null
                    })}
                    className="w-full-calc-add-10 -margin-l-10"
                    onChange={this.form.onChange}
                />
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
