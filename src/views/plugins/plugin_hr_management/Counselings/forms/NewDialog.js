import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {mapPersonDetails} from 'utils/ArrayMapperUtils';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewDialog.lazy.css";
import {SignatureListRow} from "components/SignatureComponents";
import {Dates} from "utils/Dates";
import insertEmployeeCounselling from "mutations/all/EmployeeCounselling/insertEmployeeCounselling";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewCounselingDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create Counseling";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/counselling/";
    @observable
    state = {
        lists: {
            types: [
                'Directive Counseling', 
                'Nondirective Counseling', 
                'Cooperative Counseling', 
                'Participative Counseling', 
                'Desensitization', 
                'Catharsis', 
                'Insight', 
                'Developing the new patterns'
            ].map(label => {
                return {label, value: label};
            }),
            reasons: [
                'Attendance', 
                'Behaviour / Teamwork', 
                'Inappropriate Conduct', 
                'Inappropriate Dress', 
                'Safety Violation', 
                'Sleeping On The Job', 
                'Substandard Work', 
                'Violence'
            ].map(label => {
                return {label, value: label};
            })
        }
    };

    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }

    onNext(e, btn) {
        const {form, isNewEmployee, embeddedEmployee} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, embeddedEmployee} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }

        if(isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {
            //1
            employee, //
            responsible_person,//
            //2
            types,//
            reasons,//
            incident_desc,//
            corrective_actions,//
            counselling_hrs_to_complete,//
            expiry_date,//
            witness_list,//
            //3
            doc//
        } = form.data;
        const data = {
            employee_id: (embeddedEmployee || employee).id,
            doc: doc && doc.path,

            responsible_person_id: responsible_person && responsible_person.id,

            corrective_actions,
            counselling_hrs_to_complete,
            expiry_date: Dates.formatTimestampSQL(expiry_date),
            incident_desc,
            reasons,
            types,
            witness_list: {
                data: witness_list ? witness_list.map(({employee, other_person}) => {
                    console.log('witness_list', employee, other_person)
                    if(employee) {
                        return {witness_id: employee.id};
                    }
                    const {job_position} = other_person;
                    if(job_position) {
                        delete other_person.job_position;
                        other_person.job_position_id = job_position.id;
                    }
                    return {witness_other: {data: other_person}};
                }) : []
            },
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeCounselling(data).then(employee_res => {
            console.log("res", employee_res)
            onSaved && onSaved(employee_res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    get onSetSignatureSettings() {
        const {props: {dialog: {props: {onSetSignatureSettings}}}} = this;
        return onSetSignatureSettings;
    }

    get embeddedEmployee() {
        const {props: {dialog: {props: {embeddedEmployee}}}} = this;
        return embeddedEmployee;
    }

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    get employeeItem() {
        return this.props.state.item;
    }

    render() {
        const {isNewEmployee, embeddedEmployee, onSetSignatureSettings, props:{onFormNext, onFormBack, onFormOpen}} = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Employee & Responsible Person"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {!isNewEmployee && !embeddedEmployee && <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem} className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." defaultUser className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Counseling Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="types" type="select_multi" placeholder="Counseling Types..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.types} returnValue add/>
                <ClearableInput name="reasons" type="select_multi" placeholder="Reasons For Counseling..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.reasons} returnValue add/>
                <ClearableInput name="incident_desc" type="textarea" placeholder="Description Of Incident" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="corrective_actions" type="textarea" placeholder="Corrective Actions" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="counselling_hrs_to_complete" type="number" placeholder="Counseling Hours To Complete" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Completion Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-0 padding-b-0">Witness List</label>
                <NewEmployeeListTable name="witness_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Upload File (PDF, Word or Photo)"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
            <SignatureListRow
                idx={4}
                pluginKey="HR"
                module="Counseling"
                onSetSignatureSettings={onSetSignatureSettings}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >

            </SignatureListRow>
        </FormControls>;
    }
}

export default NewDialog;
