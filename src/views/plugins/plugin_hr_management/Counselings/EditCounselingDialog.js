import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';
import {ShouldUpdate} from '../../../../utils/Utils';

import {AEditDialog} from '../../../../components/dialogs';
import {ClearableInput, SelectEmployeeInput, UploadButton} from '../../../../components/inputs';
import {NewEmployeeListTable} from '../../../../components/FormTableComponents';
import {mapPersonDetails} from '../../../../utils/ArrayMapperUtils';
import {Row} from '../../../../components/FormComponents';

import style from "./EditCounselingDialog.lazy.css";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditCounselingDialog";
    title = "Edit Counseling";

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
        const {form, item: {data: old_data}} = this;

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
        
        const data = {};
        
        //1
        ShouldUpdate.checkEmployee(data, old_data, employee, 'employee');
        ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');
        //2
        ShouldUpdate.check(data, old_data, types, 'types');
        ShouldUpdate.check(data, old_data, reasons, 'reasons');
        ShouldUpdate.check(data, old_data, incident_desc, 'incident_desc');
        ShouldUpdate.check(data, old_data, corrective_actions, 'corrective_actions');
        ShouldUpdate.check(data, old_data, counselling_hrs_to_complete, 'counselling_hrs_to_complete');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        if(witness_list) {
            const witness_list_mapped = witness_list.map(mapPersonDetails);
            ShouldUpdate.checkListToJS(data, old_data, witness_list_mapped, 'witness_list');
        }
        //3
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", employee.id, this.item.id, data).then(res => {
            console.log("res", res)
            if(res === "ERROR") {
                infoDialog.open("An error occurred. Please try again.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                this.props.close();
            }
            infoDialog.close(2000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    get item() {
        return this.props.state.item;
    }

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
                }
            }
        } = this;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    active
                    rendered 
                    idx={1}
                    title="1. Employee & Responsible Person" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                > 
                    <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." defaultValue={responsible_person} defaultUser className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Counseling Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                > 
                    <ClearableInput name="types" type="select_multi" placeholder="Counseling Types..." defaultValue={types} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.types} returnValue add/>
                    <ClearableInput name="reasons" type="select_multi" placeholder="Reasons For Counseling..." defaultValue={reasons} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.reasons} returnValue add/>
                    <ClearableInput name="incident_desc" type="textarea" placeholder="Description Of Incident" defaultValue={incident_desc} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="corrective_actions" type="textarea" placeholder="Corrective Actions" defaultValue={corrective_actions} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="counselling_hrs_to_complete" type="number" placeholder="Counseling Hours To Complete" defaultValue={counselling_hrs_to_complete} className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="expiry_date" type="date" placeholder="Completion Date..." defaultValue={expiry_date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-0 padding-b-0">Witness List</label>
                    <NewEmployeeListTable name="witness_list" defaultValue={[...(witness_list || []), null]} onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Document" 
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack} 
                > 
                    <UploadButton 
                        name="doc" 
                        buttonTitle="Upload File (PDF, Word or Photo)" 
                        type={['PDF', 'Word', 'Image']}
                        showOnlyIcon 
                        defaultValue={doc}
                        className="col-lg-12" 
                        onChange={this.form.onChange}
                    />
                </Row>
            </div>
        </div>);
    }
}

export default EditDialog;
