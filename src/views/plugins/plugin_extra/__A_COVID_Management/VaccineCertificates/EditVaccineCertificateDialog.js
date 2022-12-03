import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../utils/Utils';

import {ClearableInput, Clickable, SelectEmployeeInput, UploadButton} from '../../../../../components/inputs';
import {NavButtons} from '../../../../../components/FormComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import style from "./EditVaccineCertificateDialog.lazy.css";

@observer
class EditVaccineCertificateDialog extends AEditDialog {
    pageKey = "EditVaccineCertificateDialog";
    title = "Edit Vaccine Certificate";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/COVID_Management/vaccine-certificates/";
    @observable
    state = {
        lists: {
            vaccinated: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}]
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
            if (!form.isValid('vaccinated')) {
                infoDialog.open('Vaccinated option is required');
                return;
            }
        }
        if(idx === 2) {
            if (form.get('vaccinated') === 'Yes' && !form.isValid('doc')) {
                infoDialog.open('Please Upload Vaccine Certificate');
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
        if (!form.isValid('vaccinated')) {
            infoDialog.open('Vaccinated option is required');
            return;
        }
        if (form.get('vaccinated') === 'Yes' && !form.isValid('doc')) {
            infoDialog.open('Please Upload Vaccine Certificate');
            return;
        }

        const {employee, vaccinated, doc} = form.data;
        
        const data = {};
        
        ShouldUpdate.checkEmployee(data, old_data, employee, 'employee');
        ShouldUpdate.check(data, old_data, vaccinated, 'vaccinated');
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
                    created_at, vaccinated, doc, employee
                }
            }
        } = this;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Vaccine Certificate Details 
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="vaccinated" type="radio" placeholder="Vaccinated?" defaultValue={vaccinated} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.vaccinated}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-doc">
                    <label>
                        2. Document
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <UploadButton 
                            name="doc" 
                            buttonTitle="Upload File (PDF, Word or Photo)" 
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon  
                            defaultValue={doc}
                            className="col-lg-12" 
                            onChange={this.form.onChange}
                        />
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default EditVaccineCertificateDialog;
