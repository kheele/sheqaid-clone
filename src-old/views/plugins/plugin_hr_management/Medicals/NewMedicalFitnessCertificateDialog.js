import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';

import {ClearableInput, Clickable, SelectEmployeeInput, UploadButton} from '../../../../components/inputs';
import {FormControls, NavButtons, Row} from '../../../../components/FormComponents';
import ANewDialog from '../../../../components/dialogs/ANewDialog';

import style from "./NewMedicalFitnessCertificateDialog.lazy.css";

@observer
class NewMedicalFitnessCertificateDialog extends ANewDialog {
    pageKey = "NewMedicalFitnessCertificateDialog";
    title = "Create Medical Fitness Certificate";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/medicals/";
    @observable
    state = {
        lists: {
            annexture_3: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}]
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
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
                return;
            }
            if (!form.isValid('annexture_3')) {
                infoDialog.open('Annexture 3 is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload Medical Fitness Certificate');
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
        if (!form.isValid('expiry_date')) {
            infoDialog.open('Expiry Date is required');
            return;
        }
        if (!form.isValid('annexture_3')) {
            infoDialog.open('Annexture 3 is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload Medical Certificate');
            return;
        }

        const {
            employee: {id, data: {fname, lname}},//
            expiry_date, //
            annexture_3,//
            restrictions,//
            doc//
        } = form.data;
        const data = { 
            employee: {id, fname, lname},
            expiry_date: expiry_date.getTime(), annexture_3,
            doc: doc.path
        };

        if(restrictions){
            data.restrictions = restrictions;
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
        const {onFormNext, onFormBack, onFormOpen} = this.props;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Medical Fitness Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="annexture_3" type="radio" placeholder="Annexture 3?" required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.annexture_3}/>
                <ClearableInput name="restrictions" type="textarea" placeholder="Restrictions (if any)" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
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
        </FormControls>;
    }
}

export default NewMedicalFitnessCertificateDialog;
