// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {GDocEditor} from 'components/documents';

import {
    ClearableInput,
    SelectClientInput,
    SelectDepartmentInput, SelectDocumentCategoryInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "ADocumentNew";

    constructor(props) {
        super(props, style);
        this.title = "Create " + props.title;
    }

    onCancel(e, btn) {
        this.refs.controls.onRemoveDoc().then(() => {
            super.onCancel(e, btn);
        });
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            internal_or_external: [{value: "Internal", text: "Internal", checked: false}, {
                value: "External",
                text: "External",
                checked: false
            }],
        },
        title: null,
        new_doc_id: null,

        last_doc_num: null,
        showDoc: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.state.title = props.dialog.props.title;

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    onRemoveDoc() {
        return this.refs.doc.removeDoc();
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form, refs: {doc}} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('company')) {
                infoDialog.open('Company is required');
                return;
            }
        } else if (idx === 1) {
            if (!form.isValid('internal_or_external')) {
                infoDialog.open('Please check if a document is Internal / External');
                return;
            }

            doc.refresh();
        } else if (idx === 2) {
            if (!form.isValid('title')) {
                infoDialog.open('Document Title is required');
                return;
            }
            if (!form.isValid('doc')) {
                infoDialog.open('Document is required (Please upload/type)');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant} = storage.is;

        if (isConsultant && !form.isValid('company')) {
            infoDialog.open('Company is required');
            return;
        }

        if (!form.isValid('internal_or_external')) {
            infoDialog.open('Please check if a document is Internal / External');
            return;
        }

        if (!form.isValid('title')) {
            infoDialog.open('Document Title is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Document is required (Please upload/type)');
            return;
        }

        const {
            site, project, company,
            responsible_department, responsible_person,
            expiry, internal_or_external, desc,
            category, title, doc,
//            doc_num, doc_rev_num
        } = form.data;
        const data = {
            internal_or_external,
            title, doc
        };

        if (isConsultant) {
            data.company = {id: company.id, name: company.data.name};
        } else {
            const {name} = storage.loggedUser.company.data;
            data.company = {name: name};
        }

        if (responsible_department) {
            const {id, data: {name}} = responsible_department;
            data.responsible_department = {id, name};
        }
        if (responsible_person) {
            const {id, data: {fname, lname}} = responsible_person;
            data.responsible_person = {id, fname, lname};
        }
        if (expiry) {
            data.expiry = expiry.getTime();
        }
        if (category) {
            data.category = category;
        }
        if (desc) {
            data.desc = desc;
        }

        console.log(data)

        // doc && indexedStorage.orphanedUploadedDocs.remove(doc);

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.props.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen, dialog: {props: {showCategory}}} = this.props;
        const {isConsultant, isNoProjects} = storage.is;
        const {name} = storage.loggedUser.company.data;

        return <FormControls onChange={this.form.onChange}>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}>
                <SelectClientInput name="company" placeholder="Company..." required
                                   className="col-lg-4 col-sm-12 form-control" onChange={this.form.onChange}/>
                <SelectProjectInput name="project" placeholder="Project..." required showAll
                                    className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required showAll
                                 className="col-lg-4 col-sm-6 col-xs-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Document Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}>
                <SelectDepartmentInput name="responsible_department" placeholder="Department..." required
                                       className="col-lg-4 col-sm-6 col-xs-12 form-control"
                                       onChange={this.form.onChange}/>
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required
                                     className="col-lg-4 col-sm-6 col-xs-12 form-control"
                                     onChange={this.form.onChange}/>
                <ClearableInput name="expiry" type="date" placeholder="Expiry Date..." required
                                className="col-lg-4 col-sm-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="internal_or_external" type="radio" placeholder="Internal / External Document?"
                                required className="col-lg-6 col-sm-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.internal_or_external}/>
                {showCategory &&
                    <SelectDocumentCategoryInput ref="category" name="category" placeholder="Document Category..."
                                                 className="col-lg-6 col-sm-12 form-control"
                                                 onChange={this.form.onChange}/>}
                <ClearableInput name="desc" type="textarea" placeholder="Document Description" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            {/*<Row 
                rendered
                idx={2}
                title="2. Privacy Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext} 
                onFormBack={onFormBack}>
                
            </Row>*/}
            <Row
                rendered
                idx={2}
                title="2. Document"
                sectionClassName="min-h-320"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}>
                <GDocEditor ref="doc" state={this.state} name="doc" onChangeTitle={this.form.onChange}
                            onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default NewDialog;