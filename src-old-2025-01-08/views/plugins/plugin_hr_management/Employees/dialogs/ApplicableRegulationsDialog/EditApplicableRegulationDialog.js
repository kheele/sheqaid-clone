// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from '../../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../../utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {NewComplianceRequirementListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditApplicableRegulationDialog.lazy.css";
import {findByIdApplicableRegulation} from "../../../../../../mutations/findById";
import {updateApplicableRegulation} from "../../../../../../mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditApplicableRegulationDialog";
    title = "Edit Applicable Regulation";
    findById = findByIdApplicableRegulation;
    removeById = updateApplicableRegulation;
    onUpdate = updateApplicableRegulation;

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
        this.onFormSave = this.onFormSave.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
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

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
            props: {dialog: {onProcessUpdateOrgs, onUpdateSave}},
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            onUpdateSave(data, btn, onSaved);
        };

        const {idx} = btn.props;
        if (idx === 0) {
            return onProcessUpdateOrgs(btn);
        }

        if (idx === 1) {
            if (!form.isValid('code')) {
                infoDialog.open('Code is required');
                return;
            }

            const {
                site, project, client,
                code,
                desc,
                jurisdiction,
                effective_date,
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, code, 'code');
            ShouldUpdate.check(data, old_data, desc, 'desc');
            ShouldUpdate.check(data, old_data, jurisdiction, 'jurisdiction');
            ShouldUpdate.checkDate(data, old_data, effective_date, 'effective_date');

            onSubmit(data);
            return;
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    site, project, client,
                    code,
                    desc,
                    jurisdiction,
                    effective_date,
                    compliance_requirement_list = [],
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                client={client}
                project={project}
                site={site}
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Applicable Regulation Details"
                >
                    <ClearableInput name="code" type="text" placeholder="Code" defaultValue={code}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description" defaultValue={desc}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="jurisdiction" type="text" placeholder="Jurisdiction"
                                    defaultValue={jurisdiction}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="effective_date" type="date" placeholder="Effective Date"
                                    defaultValue={effective_date}
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
                                                   defaultValue={[...compliance_requirement_list, null]}
                                                   onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
