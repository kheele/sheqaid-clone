//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {AProfileDialog} from '../../../../../components/dialogs';
import {
    ClearableInput,
    ProfileField,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {RowPanel1, RowPanel2, RowPanel3, Sign} from "./ManHourComponents";

import style from "./ProfileManHourDialog.lazy.css";
import {FormControls, Row} from "../../../../../components/FormComponents";
import NewIncidentListTable from "../../../../../components/FormTableComponents/NewIncidentListTable";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class ProfileManHourDialog extends AProfileDialog {
    pageKey = "ProfileManHourDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Man Hours";
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    @observable
    state = {};

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);
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
                    managers_sub_total_hrs_per_month,
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
                {isConsultant && <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-12"/>}
                <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                <ProfileField title="Site" value={site} renderer={v => v.name || v.data.name} className="col-lg-12"/>
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
                <ProfileField name="year" type="select" title="Year" value={year} className="col-lg-4"/>
                <ProfileField name="month" type="select" title="Month" value={month}
                              className="col-lg-4"/>
                <ProfileField name="fiscal_year" type="date" title="Fiscal Year" value={fiscal_year}
                              className="col-lg-4"/>
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
                                <RowPanel1 ref="rowPanel1_managers" item={item} lists={this.state.lists} group="managers" readonly/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_managers" item={item} lists={this.state.lists} group="managers" readonly/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_managers" item={item} group="managers" readonly/>
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
                                <RowPanel1 ref="rowPanel1_employees" item={item} lists={this.state.lists} group="employees" readonly/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_employees" item={item} lists={this.state.lists} group="employees" readonly/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_employees" item={item} group="employees" readonly/>
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
                                <RowPanel1 ref="rowPanel1_contractors" item={item} lists={this.state.lists} group="contractors" readonly/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                sectionClassName="flex w-full margin-0 margin-t-5"
                                className='calc-row'
                            >
                                <RowPanel2 ref="rowPanel2_contractors" item={item} lists={this.state.lists} group="contractors" readonly/>
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                title="Total Hours"
                                sectionClassName="flex w-full margin-0 margin-t-5 padding-t-10 padding-b-10 flex-right"
                                className='calc-row'
                            >
                                <RowPanel3 ref="rowPanel3_contractors" item={item} group="contractors" readonly/>
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
                        <ProfileField ref="overtime1" name="overtime1" value={overtime1 || '0'} type="number"
                                      title="Overtime Worked (Hrs)" className="col-lg-3"/>
                        <ProfileField ref="overtime1_score" name="overtime1_score" value={overtime1_score || '0'}
                                      type="text" title="Score" value="1.5" className="col-lg-3"/>
                        <ProfileField ref="overtime1_total_hrs" name="overtime1_total_hrs"
                                      value={overtime1_total_hrs || '0'} type="number" title="Total Hours"
                                      isEditable={false} className="fixed-flex min-w-240"/>
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
                        <ProfileField ref="overtime2" name="overtime2" value={overtime2 || '0'} type="number"
                                      title="Overtime Worked (Hrs)" className="col-lg-3"/>
                        <ProfileField ref="overtime2_score" name="overtime2_score" value={overtime2_score || '0'}
                                      type="text" title="Score" value="2" className="col-lg-3"/>
                        <ProfileField ref="overtime2_total_hrs" name="overtime2_total_hrs"
                                      value={overtime2_total_hrs || '0'} type="number" title="Total Hours"
                                      isEditable={false} className="fixed-flex min-w-240"/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                activeAlways
                idx={4}
                title="4. Total Hours Worked"
            >
                <ProfileField ref="total_hrs_worked" name="total_hrs_worked" value={total_hrs_worked || '0'}
                              type="number" title="Total Hours Worked"
                              className="hor-center w-240 pull-right total-hours-worked"/>
            </Row>
            <Row
                rendered
                activeAlways
                idx={5}
                title="5. Incidents"
                onFormOpen={onFormOpen}
            >
                <NewIncidentListTable ref="incident_list" name="incident_list" defaultValue={incident_list || []} readonly/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>

}

export default ProfileManHourDialog;
