import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';

import {ANewDialog} from '../../../../components/dialogs';
import {ClearableInput, SelectEmployeeInput, UploadButton} from '../../../../components/inputs';
import {NewEmployeeListTable} from '../../../../components/FormTableComponents';
import {mapPersonDetails} from '../../../../utils/ArrayMapperUtils';
import {FormControls, Row} from '../../../../components/FormComponents';

import style from "./NewCounselingDialog.lazy.css";
import {SignatureListRow} from "../../../../components/SignatureComponents";

@observer
class NewCounselingDialog extends ANewDialog {
    pageKey = "NewCounselingDialog";
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
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }

        const {
            //1
            employee, 
            responsible_person,
            //2
            types,
            reasons,
            incident_desc,
            corrective_actions,
            counselling_hrs_to_complete,
            expiry_date,
            witness_list,
            //3
            doc
        } = form.data;
        const data = { 
            employee: {id: employee.id, fname: employee.data.fname, lname: employee.data.lname}
        };
        
        //1
        if(responsible_person){
            const {id, data: {fname, lname}} = responsible_person;
            data.responsible_person = {id, fname, lname};
        }
        //2
        if(types){
            data.types = types.slice();
        }
        if(reasons){
            data.reasons = reasons.slice();
        }
        if(incident_desc){
            data.incident_desc = incident_desc;
        }
        if(corrective_actions){
            data.corrective_actions = corrective_actions;
        }
        if(counselling_hrs_to_complete){
            data.counselling_hrs_to_complete = counselling_hrs_to_complete;
        }
        if(expiry_date){
            data.expiry_date = expiry_date.getTime();
        }
        if(witness_list){
            data.witness_list = witness_list.map(mapPersonDetails);
        }
        //3
        if(doc){
            data.doc = doc.path;
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(employee_res => {
            console.log("res", employee_res)
            onSaved && onSaved(employee_res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    get employeeItem() {
        return this.props.state.item;
    }

    render() {
        const {dialog: {props: {onSetSignatureSettings}}, onFormNext, onFormBack, onFormOpen} = this.props;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Employee & Responsible Person"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem} className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                module="Counselings"
                onSetSignatureSettings={onSetSignatureSettings}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >

            </SignatureListRow>
        </FormControls>;
    }
}

export default NewCounselingDialog;
