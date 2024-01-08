//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {ShouldUpdate} from "utils/Utils";
import {
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import RiskAssessmentItemBaselineTable from './RiskAssessmentItemBaselineTable';

import style from "./EditBaselineRiskAssessmentDialog.lazy.css";
import findByIdBaselineRA from "mutations/all/HIRA_And_Opportunities/BaselineRA/findByIdBaselineRA";
import updateBaselineRA from "mutations/all/HIRA_And_Opportunities/BaselineRA/updateBaselineRA";
import {CircularProgress} from "@mui/material";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class EditBaselineRiskAssessmentDialog extends AEditDialog {
    pageKey = "EditBaselineRiskAssessmentDialog";
    className = 'ANewTableFormDialog';
    findById = findByIdBaselineRA;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Baseline Risk Assessment";
    }

    get topButtonsHiddenSave() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}
//</editor-fold>

@observer
class Controls extends React.Component {

    //<editor-fold desc="fields">
    @observable
    state = {
        lists: {
            risk_tolerance: [1, 2, 3, 4].map(value => {
                return {label: String(value), value}
            })
        },
    };
    //</editor-fold>

    constructor() {
        super();

        this.form = new Form();
    }

    //<editor-fold desc="onFormSave">
    onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateBaselineRA({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;
        if (idx === 0) {
            // const {isConsultant} = storage.is;
            // if (isConsultant && !form.isValid('client')) {
            //     infoDialog.open('Company is required');
            //     return;
            // }

            const {
                //0
                site, project, client,
            } = form.data;

            const data = {};

            if(isContractor) {
                ShouldUpdate.checkSite(data, old_data, site, 'contractor_site_id');
            } else {
                ShouldUpdate.checkClient(data, old_data, client);
                ShouldUpdate.checkProject(data, old_data, project);
                ShouldUpdate.checkSite(data, old_data, site);
            }

            onSubmit(data);
            return;
        }

        if (idx === 1) {
            if (!form.isValid('activity')) {
                infoDialog.open('Activity is required');
                return;
            }

            const {
                //1
                activity,
                expiry_date,
                risk_tolerance,
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, activity, 'activity');
            ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
            ShouldUpdate.check(data, old_data, risk_tolerance, 'risk_tolerance');

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            if (!form.isValid('list') || form.get('list').isEmpty()) {
                infoDialog.open('Assessed Items are required');
                return;
            }

            const {
                //2
                list,
            } = form.data;
            const data = {};

            if(list) {
                data.list = toJS(list.map(oldVal => {
                    const {responsible_person, target_date, due_date, risk_type, control_measure_list, control_measure_list_additional} = oldVal;
                    const val = {};
                    if(responsible_person && responsible_person.data) {
                        const {id, data: {fname, lname}} = responsible_person;
                        val.responsible_person = {id, fname, lname};
                    }
                    if(target_date && isDate(target_date)) {
                        val.target_date = target_date.getTime();
                    }
                    if(due_date && isDate(due_date)) {
                        val.due_date = due_date.getTime();
                    }

                    if(risk_type) {
                        val.risk_type = toJS(risk_type);
                    }
                    if(control_measure_list) {
                        val.control_measure_list = toJS(control_measure_list.map(v => toJS(v)));
                    }
                    if(control_measure_list_additional) {
                        val.control_measure_list_additional = toJS(control_measure_list_additional.map(oldVal => {
                            const {text, responsible_person, cost, date_completed} = oldVal;
                            const val = {};
                            if(responsible_person && responsible_person.data) {
                                const {id, data: {fname, lname}} = responsible_person;
                                val.responsible_person = {id, fname, lname};
                            }
                            if(date_completed && isDate(date_completed)) {
                                val.date_completed = date_completed.getTime();
                            }
                            return {...oldVal, ...val};
                        }));
                    }
                    return {...oldVal, ...val};
                }));
            }

            onSubmit(data);
            return;
        }

        return true;
    }

    //</editor-fold>

    @computed get item() {
		return this.props.state.item;
	}

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
            },
            item, item: {
                id, data: {
                    created_at,
                    //0
                    client,
                    project,
                    site,
                    //1
                    activity,
                    expiry_date,
                    risk_tolerance,
                    //2
                    list,
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        return <FormControls>
            {!isNoProjects && <Row
              rendered
              active
              idx={0}
              title="Company / Project / Site"
              onFormOpen={onFormOpen}
              onFormNext={onFormNext}
              onFormSave={this.onFormSave}
            >
                {isConsultant && <SelectClientInput
                  name="client"
                  placeholder="Company..."
                  defaultValue={RenderUtils.selectedClient.call(this)}
                  showAll
                  className="col-lg-12 form-control"
                  onChange={this.form.onChange}
                />}
                <SelectProjectInput
                  name="project"
                  placeholder="Project..."
                  defaultValue={RenderUtils.selectedProject.call(this)}
                  showAll
                  className="col-lg-12 form-control"
                  onChange={this.form.onChange}
                />
                <SelectSiteInput
                  name="site"
                  placeholder="Site..."
                  defaultValue={RenderUtils.selectedSite.call(this)}
                  showAll
                  className="col-lg-12 form-control"
                  onChange={this.form.onChange}
                />
            </Row>}
            <Row
              rendered
              active={isNoProjects}
              idx={1}
              title="1. Basic Details"
              sectionClassName="-margin-r-10"
              onFormOpen={onFormOpen}
              onFormNext={onFormNext}
              onFormBack={onFormBack}
              onFormSave={this.onFormSave}
            >
                <ClearableInput name="activity" type="text" placeholder="Activity" defaultValue={activity} required
                                className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Revision Date..." defaultValue={expiry_date} required
                                className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                <ClearableInput name="risk_tolerance" type="select" placeholder="Risk Tolerance" defaultValue={risk_tolerance} required
                                className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}
                                values={this.state.lists.risk_tolerance} add returnValue/>
            </Row>
            <Row
              rendered
              idx={2}
              title="2. Assessed Items"
              sectionClassName="overflow-auto"
              onFormOpen={onFormOpen}
              onFormBack={onFormBack}
              onFormSave={this.onFormSave}
            >
                <RiskAssessmentItemBaselineTable name="list" item={item} defaultValue={list} onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    //</editor-fold>
}

export default EditBaselineRiskAssessmentDialog;
