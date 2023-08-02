// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
    ClearableInput,
    SelectClientInput,
    SelectContractorQuestionnaireTemplateCategoryInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDocTemplateDialog.lazy.css";
import {Dates} from "utils/Dates";
import insertContractorsQuestionnaireTemplate
    from "mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/insertContractorsQuestionnaireTemplate";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewDocTemplateDialog";
    title = "Create Questionnaire Template";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/questionnaires/templates/";

    @observable
    state = {
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form, refs: {questions}} = this;
        const {idx} = btn.props;
        
        const {isConsultant} = storage.is;

        if(idx === 0) {
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Document Title is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form} = this;

        const {isConsultant} = storage.is;

        //0
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }  
        //
        if (!form.isValid('name')) {
            infoDialog.open('Document Title is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Please upload the Document');
            return;
        }
        
        const {
            //0
            client, project, site,
            //
            name,
            desc,
            category,
            expiry,
            doc_num,
            doc,
        } = form.data;
        const data = {
            name,
            category,
            desc,
            doc_num,
            doc: doc.path,
            expiry: Dates.formatDateSQL(expiry),
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
        };
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertContractorsQuestionnaireTemplate(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close(), 0);
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
             props: {
                onFormNext, onFormBack, onFormOpen
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
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row 
                rendered  
                active={isNoProjects}
                idx={1}
                title="1. Document Details" 
                onFormOpen={onFormOpen} 
                onFormBack={!isNoProjects && onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="name" placeholder="Document Title" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="doc_num" placeholder="Document No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectContractorQuestionnaireTemplateCategoryInput name="category" placeholder="Category..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="desc" placeholder="Description" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry" type="date" placeholder="Review Date" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Document Attachment" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <UploadButton 
                    name="doc"
                    buttonTitle="Document (PDF, Word, Excel)" 
                    type={['Word', 'PDF', 'Excel']}
                    showOnlyIcon 
                    className="hor-center col-lg-8"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewDialog;
