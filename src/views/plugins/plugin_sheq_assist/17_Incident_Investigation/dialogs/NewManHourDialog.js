//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {monthArray, yearArray} from 'utils/Utils';

import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';
import {FormControls, Row} from "components/FormComponents";
import {AControls, RowPanel1, RowPanel2, RowPanel3, Sign} from "./ManHourComponents";

import style from "./NewManHourDialog.lazy.css";
import NewIncidentListTable from "components/FormTableComponents/NewIncidentListTable";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class NewManHourDialog extends ANewDialog {
    pageKey = "NewManHourDialog";
    title = "Create Man Hours";

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
        const {form} = this;

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
        const data = {
            year,
            month,
            fiscal_year: fiscal_year.getTime(),
            //
            num_of_managers: num_of_managers || 0,
            hrs_worked_by_managers: hrs_worked_by_managers || 0,
            managers_absent_hrs: managers_absent_hrs || 0,
            managers_sub_total_hrs: managers_sub_total_hrs || 0,
            managers_time_travelled: managers_time_travelled || 0,
            managers_time_travelled_opts: managers_time_travelled_opts || 'Hours',
            transport_num_of_managers: transport_num_of_managers || 0,
            managers_transport_hrs: managers_transport_hrs || 0,
            managers_num_of_days_lost: managers_num_of_days_lost || 0,
            managers_num_of_days_per_month,
            //
            num_of_employees: num_of_employees || 0,
            hrs_worked_by_employees: hrs_worked_by_employees || 0,
            employees_absent_hrs: employees_absent_hrs || 0,
            employees_sub_total_hrs: employees_sub_total_hrs || 0,
            employees_time_travelled: employees_time_travelled || 0,
            employees_time_travelled_opts: employees_time_travelled_opts || 'Hours',
            transport_num_of_employees: transport_num_of_employees || 0,
            employees_transport_hrs: employees_transport_hrs || 0,
            employees_num_of_days_lost: employees_num_of_days_lost || 0,
            employees_num_of_days_per_month,
            //
            num_of_contractors: num_of_contractors || 0,
            hrs_worked_by_contractors: hrs_worked_by_contractors || 0,
            contractors_absent_hrs: contractors_absent_hrs || 0,
            contractors_sub_total_hrs: contractors_sub_total_hrs || 0,
            contractors_time_travelled: contractors_time_travelled || 0,
            contractors_time_travelled_opts: contractors_time_travelled_opts || 'Hours',
            transport_num_of_contractors: transport_num_of_contractors || 0,
            contractors_transport_hrs: contractors_transport_hrs || 0,
            contractors_num_of_days_lost: contractors_num_of_days_lost || 0,
            contractors_num_of_days_per_month,
            //
            overtime1_score: overtime1_score || 0,
            overtime1: overtime1 || 0,
            overtime2_score: overtime2_score || 0,
            overtime2: overtime2 || 0,
            managers_total_hrs: managers_total_hrs || 0,
            employees_total_hrs: employees_total_hrs || 0,
            contractors_total_hrs: contractors_total_hrs || 0,
            overtime1_total_hrs: overtime1_total_hrs || 0,
            overtime2_total_hrs: overtime2_total_hrs || 0,
            total_hrs_worked: total_hrs_worked || 0,
            incident_list: (incident_list && incident_list.map((v) => v.id).slice()) || [],
        };

        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant, hasProjects} = storage.is;

        return <FormControls>
            {hasProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}

                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                                 onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={!hasProjects}
                idx={1}
                title="1. Date Section"
                sectionClassName="dates-group"
                onFormOpen={onFormOpen}
                onFormBack={hasProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="year" type="select" placeholder="Year..." required
                                className="col-lg-4 form-control" onChange={this.form.onChange} values={yearArray}
                                returnValue/>
                <ClearableInput name="month" type="select" placeholder="Month..." required
                                className="col-lg-4 form-control" onChange={this.form.onChange} values={monthArray}
                                returnValue/>
                <ClearableInput name="fiscal_year" type="date" placeholder="Fiscal Year..." required
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
                                <RowPanel1 ref="rowPanel1_managers" lists={this.state.lists} group="managers" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_managers" lists={this.state.lists} group="managers" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_managers" group="managers" onChange={this.form.onChange}/>
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
                                <RowPanel1 ref="rowPanel1_employees" lists={this.state.lists} group="employees" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_employees" lists={this.state.lists} group="employees" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_employees" group="employees" onChange={this.form.onChange}/>
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
                                <RowPanel1 ref="rowPanel1_contractors" lists={this.state.lists} group="contractors" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_contractors" lists={this.state.lists} group="contractors" onChange={this.form.onChange}/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_contractors" group="contractors" onChange={this.form.onChange}/>
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
                                        placeholder="Total Overtime Worked (Hours)" required
                                        className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <Sign value="X" className="font-size-24"/>
                        <ClearableInput ref="overtime1_score" name="overtime1_score" type="text" placeholder="Score"
                                        defaultValue="1.5" required className="col-lg-3 form-control"
                                        onChange={this.form.onChange}/>
                        <Sign value="="/>
                        <ClearableInput ref="overtime1_total_hrs" name="overtime1_total_hrs" type="number"
                                        placeholder="Total Hours" isEditable={false} isClearable={false} required
                                        className="fixed-flex min-w-205 form-control totals"
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
                                        placeholder="Total Overtime Worked (Hours)" required
                                        className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <Sign value="X" className="font-size-24"/>
                        <ClearableInput ref="overtime2_score" name="overtime2_score" type="text" placeholder="Score"
                                        defaultValue="2" required className="col-lg-3 form-control"
                                        onChange={this.form.onChange}/>
                        <Sign value="="/>
                        <ClearableInput ref="overtime2_total_hrs" name="overtime2_total_hrs" type="number"
                                        placeholder="Total Hours" isEditable={false} isClearable={false} required
                                        className="fixed-flex min-w-205 form-control totals"
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
                                placeholder="Total Hours Worked" isEditable={false} isClearable={false} required
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
                <NewIncidentListTable ref="incident_list" name="incident_list" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default NewManHourDialog;
//595