import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../utils/Utils';
import {
    ClearableInput,
    PDFUploadButton,
    SelectClientInput, SelectEmployeeInput,
    SelectJobCategoryInput, SelectProjectInput, SelectSiteInput, UploadButton
} from '../../../../../components/inputs';

import {AEditDialog} from '../../../../../components/dialogs';
import style from "./EditJobPositionDialog.lazy.css";
import {FormControls, Row} from "../../../../../components/FormComponents";

@observer
class EditDialog extends AEditDialog {
    pageKey = "JobPositionDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Job Position";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/job-positions/';
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Job Title is required');
            return;
        }
        
        const {name, desc, job_category, client, doc} = form.data;
        const data = {};
        
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.check(data, old_data, job_category, 'job_category');
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');
        
        console.log(data)
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close(); 
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
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
             item, item: {
                id, data: {
                    created_at, name, desc, job_category, doc 
                }
            }
        } = this;
        
        console.log(this.item)

        const {isConsultant, isNoProjects} = storage.is;
        
        return (<FormControls>
            {!isNoProjects && <Row
                active
                rendered
                idx={0}
                title="Company"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Job Position Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="name" type="text" placeholder="Job Title" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectJobCategoryInput name="job_category" defaultValue={job_category} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="desc" type="textarea" placeholder="Job Description" defaultValue={desc} required className="form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Job Description Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Upload Document (PDF / Word)"
                    type={['PDF', 'Word']}
                    defaultValue={doc}
                    showOnlyIcon
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }
}

export default EditDialog;
