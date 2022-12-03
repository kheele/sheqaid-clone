//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import {monthArray, ShouldUpdate, yearArray} from '../../../../../utils/Utils';

import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from '../../../../../components/inputs';
import AEditDialog from '../../../../../components/dialogs/AEditDialog';
import {FormControls, Row} from "../../../../../components/FormComponents";
import {AControls, RowPanel1, RowPanel2, RowPanel3, Sign} from "./ManHourComponents";

import style from "./EditManHourDialog.lazy.css";
import NewIncidentListTable from "../../../../../components/FormTableComponents/NewIncidentListTable";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class EditManHourDialog extends AEditDialog {
    pageKey = "EditManHourDialog";
    title = "Edit Man Hours";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}
//</editor-fold>

@observer
class Controls extends AControls {

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);
    }

    //</editor-fold>

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('year')) {
            infoDialog.open('Year is required');
            return;
        }
        if (!form.isValid('month')) {
            infoDialog.open('Month is required');
            return;
        }
        if (!form.isValid('fiscal_year')) {
            infoDialog.open('Fiscal Year is required');
            return;
        }

        const {
            client, project, site,
            //
            year,
            month,
            fiscal_year,
            //
            num_of_managers,
            hrs_worked_by_managers,
            managers_absent_hrs,
            managers_sub_total_hrs,
            managers_time_travelled,
            managers_time_travelled_opts,
            transport_num_of_managers,
            managers_transport_hrs,
            managers_num_of_days_lost,
            managers_num_of_days_per_month,
            //
            num_of_employees,
            hrs_worked_by_employees,
            employees_absent_hrs,
            employees_sub_total_hrs,
            employees_time_travelled,
            employees_time_travelled_opts,
            transport_num_of_employees,
            employees_transport_hrs,
            employees_num_of_days_lost,
            employees_num_of_days_per_month,
            //
            num_of_contractors,
            hrs_worked_by_contractors,
            contractors_absent_hrs,
            contractors_sub_total_hrs,
            contractors_time_travelled,
            contractors_time_travelled_opts,
            transport_num_of_contractors,
            contractors_transport_hrs,
            contractors_num_of_days_lost,
            contractors_num_of_days_per_month,
            //
            overtime1_score,
            overtime1,
            overtime2_score,
            overtime2,
            //
            managers_total_hrs,
            employees_total_hrs,
            contractors_total_hrs,
            overtime1_total_hrs,
            overtime2_total_hrs,
            //
            total_hrs_worked,
            incident_list
        } = form.data;

        const data = {};

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        ShouldUpdate.check(data, old_data, year, 'year');
        ShouldUpdate.check(data, old_data, month, 'month');
        ShouldUpdate.check(data, old_data, fiscal_year, 'fiscal_year');

        ShouldUpdate.check(data, old_data, num_of_managers, 'num_of_managers');
        ShouldUpdate.check(data, old_data, hrs_worked_by_managers, 'hrs_worked_by_managers');
        ShouldUpdate.check(data, old_data, managers_absent_hrs, 'managers_absent_hrs');
        ShouldUpdate.check(data, old_data, managers_sub_total_hrs, 'managers_sub_total_hrs');
        ShouldUpdate.check(data, old_data, managers_time_travelled, 'managers_time_travelled');
        ShouldUpdate.check(data, old_data, managers_time_travelled_opts, 'managers_time_travelled_opts');
        ShouldUpdate.check(data, old_data, transport_num_of_managers, 'transport_num_of_managers');
        ShouldUpdate.check(data, old_data, managers_transport_hrs, 'managers_transport_hrs');
        ShouldUpdate.check(data, old_data, managers_num_of_days_lost, 'managers_num_of_days_lost');
        ShouldUpdate.check(data, old_data, managers_num_of_days_per_month, 'managers_num_of_days_per_month');

        ShouldUpdate.check(data, old_data, num_of_employees, 'num_of_employees');
        ShouldUpdate.check(data, old_data, hrs_worked_by_employees, 'hrs_worked_by_employees');
        ShouldUpdate.check(data, old_data, employees_absent_hrs, 'employees_absent_hrs');
        ShouldUpdate.check(data, old_data, employees_sub_total_hrs, 'employees_sub_total_hrs');
        ShouldUpdate.check(data, old_data, employees_time_travelled, 'employees_time_travelled');
        ShouldUpdate.check(data, old_data, employees_time_travelled_opts, 'employees_time_travelled_opts');
        ShouldUpdate.check(data, old_data, transport_num_of_employees, 'transport_num_of_employees');
        ShouldUpdate.check(data, old_data, employees_transport_hrs, 'employees_transport_hrs');
        ShouldUpdate.check(data, old_data, employees_num_of_days_lost, 'employees_num_of_days_lost');
        ShouldUpdate.check(data, old_data, employees_num_of_days_per_month, 'employees_num_of_days_per_month');

        ShouldUpdate.check(data, old_data, num_of_contractors, 'num_of_contractors');
        ShouldUpdate.check(data, old_data, hrs_worked_by_contractors, 'hrs_worked_by_contractors');
        ShouldUpdate.check(data, old_data, contractors_absent_hrs, 'contractors_absent_hrs');
        ShouldUpdate.check(data, old_data, contractors_sub_total_hrs, 'contractors_sub_total_hrs');
        ShouldUpdate.check(data, old_data, contractors_time_travelled, 'contractors_time_travelled');
        ShouldUpdate.check(data, old_data, contractors_time_travelled_opts, 'contractors_time_travelled_opts');
        ShouldUpdate.check(data, old_data, transport_num_of_contractors, 'transport_num_of_contractors');
        ShouldUpdate.check(data, old_data, contractors_transport_hrs, 'contractors_transport_hrs');
        ShouldUpdate.check(data, old_data, contractors_num_of_days_lost, 'contractors_num_of_days_lost');
        ShouldUpdate.check(data, old_data, contractors_num_of_days_per_month, 'contractors_num_of_days_per_month');

        ShouldUpdate.check(data, old_data, overtime1_score, 'overtime1_score');
        ShouldUpdate.check(data, old_data, overtime1, 'overtime1');
        ShouldUpdate.check(data, old_data, overtime2_score, 'overtime2_score');
        ShouldUpdate.check(data, old_data, overtime2, 'overtime2');

        ShouldUpdate.check(data, old_data, managers_total_hrs, 'managers_total_hrs');
        ShouldUpdate.check(data, old_data, employees_total_hrs, 'employees_total_hrs');
        ShouldUpdate.check(data, old_data, contractors_total_hrs, 'contractors_total_hrs');
        ShouldUpdate.check(data, old_data, overtime1_total_hrs, 'overtime1_total_hrs');
        ShouldUpdate.check(data, old_data, overtime2_total_hrs, 'overtime2_total_hrs');

        ShouldUpdate.check(data, old_data, total_hrs_worked, 'total_hrs_worked');

        ShouldUpdate.checkIncidentList(data, old_data, incident_list, 'incident_list');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, toJS(data)).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    //</editor-fold>

    get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
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
                    //
                    client, project, site,
                    //
                    year,
                    month,
                    fiscal_year,
                    //
                    num_of_managers,
                    hrs_worked_by_managers,
                    managers_absent_hrs,
                    managers_sub_total_hrs,
                    managers_time_travelled,
                    managers_time_travelled_opts,
                    transport_num_of_managers,
                    managers_transport_hrs,
                    managers_num_of_days_lost,
                    managers_num_of_days_per_month,
                    //
                    num_of_employees,
                    hrs_worked_by_employees,
                    employees_absent_hrs,
                    employees_sub_total_hrs,
                    employees_time_travelled,
                    employees_time_travelled_opts,
                    transport_num_of_employees,
                    employees_transport_hrs,
                    employees_num_of_days_lost,
                    employees_num_of_days_per_month,
                    //
                    num_of_contractors,
                    hrs_worked_by_contractors,
                    contractors_absent_hrs,
                    contractors_sub_total_hrs,
                    contractors_time_travelled,
                    contractors_time_travelled_opts,
                    transport_num_of_contractors,
                    contractors_transport_hrs,
                    contractors_num_of_days_lost,
                    contractors_num_of_days_per_month,
                    //
                    overtime1_score,
                    overtime1,
                    overtime2_score,
                    overtime2,
                    managers_total_hrs,
                    employees_total_hrs,
                    contractors_total_hrs,
                    overtime1_total_hrs,
                    overtime2_total_hrs,
                    total_hrs_worked,
                    //
                    incident_list = []
                }
            }
        } = this;

        const {isConsultant, isHasProjects} = storage.is;

        return <FormControls>
            {isHasProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant &&
                    <SelectClientInput name="client" placeholder="Company..." defaultValue={client} required
                                       className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={project} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={site} required
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={!isHasProjects}
                idx={1}
                title="1. Date Section"
                sectionClassName="dates-group"
                onFormOpen={onFormOpen}
                onFormBack={isHasProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="year" type="select" placeholder="Year..." defaultValue={year}
                                className="col-lg-4 form-control" onChange={this.form.onChange} values={yearArray}
                                returnValue/>
                <ClearableInput name="month" type="select" placeholder="Month..." defaultValue={month}
                                className="col-lg-4 form-control" onChange={this.form.onChange} values={monthArray}
                                returnValue/>
                <ClearableInput name="fiscal_year" type="date" placeholder="Fiscal Year..." defaultValue={fiscal_year}
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Hours Worked"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={2.1}
                        title="2.1. Managers"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <FormControls className="controls-group-hours">
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel1 ref="rowPanel1_managers" item={item} lists={this.state.lists} group="managers" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_managers" item={item} lists={this.state.lists} group="managers" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_managers" item={item} group="managers" onChange={this.form.onChange}/>
                            </Row>
                        </FormControls>
                    </Row>
                    <Row
                        rendered
                        idx={2.2}
                        title="2.2. Employees"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <FormControls className="controls-group-hours">
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel1 ref="rowPanel1_employees" item={item} lists={this.state.lists} group="employees" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_employees" item={item} lists={this.state.lists} group="employees" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_employees" item={item} group="employees" onChange={this.form.onChange}/>
                            </Row>
                        </FormControls>
                    </Row>
                    <Row
                        rendered
                        idx={2.3}
                        title="2.3. Contractors/Sub-Contractors/Visitors"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <FormControls className="controls-group-hours">
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel1 ref="rowPanel1_contractors" item={item} lists={this.state.lists} group="contractors" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_contractors" item={item} lists={this.state.lists} group="contractors" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_contractors" item={item} group="contractors" onChange={this.form.onChange}/>
                            </Row>
                        </FormControls>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Overtime"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={3.1}
                        title="3.1. Overtime 1"
                        sectionClassName="flex"
                        className='calc-row'
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <ClearableInput ref="overtime1" name="overtime1" type="number"
                                        placeholder="Total Overtime Worked (Hours)" defaultValue={overtime1} required
                                        className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <Sign value="X" className="font-size-24"/>
                        <ClearableInput ref="overtime1_score" name="overtime1_score" type="text" placeholder="Score"
                                        defaultValue="1.5" required className="col-lg-3 form-control"
                                        onChange={this.form.onChange}/>
                        <Sign value="="/>
                        <ClearableInput ref="overtime1_total_hrs" name="overtime1_total_hrs" type="number"
                                        placeholder="Total Hours" defaultValue={overtime1_total_hrs} isEditable={false}
                                        isClearable={false} required
                                        className="fixed-flex min-w-190 form-control totals"
                                        onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={3.2}
                        title="3.2. Overtime 2"
                        sectionClassName="flex"
                        className='calc-row'
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <ClearableInput ref="overtime2" name="overtime2" type="number"
                                        placeholder="Total Overtime Worked (Hours)" defaultValue={overtime2} required
                                        className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <Sign value="X" className="font-size-24"/>
                        <ClearableInput ref="overtime2_score" name="overtime2_score" type="text" placeholder="Score"
                                        defaultValue="2" required className="col-lg-3 form-control"
                                        onChange={this.form.onChange}/>
                        <Sign value="="/>
                        <ClearableInput ref="overtime2_total_hrs" name="overtime2_total_hrs" type="number"
                                        placeholder="Total Hours" defaultValue={overtime2_total_hrs} isEditable={false}
                                        isClearable={false} required
                                        className="fixed-flex min-w-190 form-control totals"
                                        onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                activeAlways
                idx={4}
                title="4. Total Hours Worked"
            >
                <ClearableInput ref="total_hrs_worked" name="total_hrs_worked" type="number"
                                placeholder="Total Hours Worked" defaultValue={total_hrs_worked} isEditable={false}
                                isClearable={false} required
                                className="hor-center w-205 pull-right form-control totals"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                activeAlways
                idx={5}
                title="5. Incidents"
                onFormOpen={onFormOpen}
            >
                <NewIncidentListTable ref="incident_list" name="incident_list"
                                      defaultValue={[...(incident_list || []), null]} onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default EditManHourDialog;
