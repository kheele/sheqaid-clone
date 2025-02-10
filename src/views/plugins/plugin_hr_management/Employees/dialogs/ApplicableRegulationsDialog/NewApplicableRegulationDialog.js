// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from '../../../../../../utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {NewComplianceRequirementListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewApplicableRegulationDialog.lazy.css";
import {insertApplicableRegulation} from "../../../../../../mutations/create";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewApplicableRegulationDialog";
    title = "Create Applicable Regulation";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('code')) {
                infoDialog.open('Code is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        //1
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }

        //2
        if (!form.isValid('code')) {
            infoDialog.open('Code is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            code,
            desc,
            jurisdiction,
            effective_date,
            //
            compliance_requirement_list,
        } = form.data;
        const data = {
            code,
            desc,
            jurisdiction,
            effective_date,

            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,

            compliance_requirement_list: {
                data: (compliance_requirement_list || []).map(v => {
                    if (v.compliance_requirement) {
                        return {compliance_requirement_id: v.compliance_requirement.id};
                    } else {
                        return {compliance_requirement_id: v.id};
                    }
                }),
            },
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertApplicableRegulation(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Applicable Regulation Details"
                >
                    <ClearableInput name="code" type="text" placeholder="Code"
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description"
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="jurisdiction" type="text" placeholder="Jurisdiction"
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="effective_date" type="date" placeholder="Effective Date"
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Compliance Requirements"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewComplianceRequirementListTable name="compliance_requirement_list" title="Compliance Requirements"
                                                   onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
