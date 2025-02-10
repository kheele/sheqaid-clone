// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs, SelectPPETypeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditPPEItemDialog.lazy.css";
import {findByIdPPEItem} from "mutations/findById";
import {updatePPEItem} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPEItemDialog";
    title = "Edit PPE Item";
    findById = findByIdPPEItem;
    removeById = updatePPEItem;

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

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            condition: ['Good', 'Needs Inspection', 'Damaged', 'Lost', 'Retired'].map(value => (
                {text: value, value, checked: false}
            )),
        },
    };
    // </editor-fold>

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

        return true;
    }

    // </editor-fold>

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updatePPEItem({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (res === "ERROR") {
                    infoDialog.open("An error occurred. Please try again.");
                } else {
                    onSaved && onSaved(res);
                    infoDialog.open("Record successfully updated.");
                    this.props.close();
                }
                infoDialog.close(2000);
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;
        if (idx === 0) {
            // const {isConsultant} = storage.is;
            // if (isConsultant && !form.isValid('client')) {
            //     infoDialog.open('Company is required');
            //     return;
            // }

            const {
                site, project, client,
            } = form.data;

            const data = {};

            if (isContractor) {
                ShouldUpdate.checkSite(data, old_data, site, 'contractor_site_id');
            } else {
                ShouldUpdate.checkClient(data, old_data, client);
                ShouldUpdate.checkProject(data, old_data, project);
                ShouldUpdate.checkSite(data, old_data, site);
            }

            onSubmit(data);
            return;
        }

        if (idx === 1) {
            if (!form.isValid('ppe_type')) {
                infoDialog.open('PPE Type is required');
                return;
            }

            const {
                site, project, client,
                ppe_type,
                serial_num,
                purchase_date,
                condition,
                notes,
                profile_pic,
            } = form.data;

            const data = {};
            ShouldUpdate.checkPPEType(data, old_data, ppe_type, 'ppe_type');
            ShouldUpdate.check(data, old_data, serial_num, 'serial_num');
            ShouldUpdate.checkDate(data, old_data, purchase_date, 'purchase_date');
            ShouldUpdate.check(data, old_data, condition, 'condition');
            ShouldUpdate.check(data, old_data, notes, 'notes');
            ShouldUpdate.checkFile(data, old_data, profile_pic, 'profile_pic');

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
                    site, project, client,
                    ppe_type,
                    serial_num,
                    purchase_date,
                    condition,
                    notes,
                    profile_pic,
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
                    title="1. PPE Item Details"
                    onFormNext={null}
                >
                    <SelectPPETypeInput name="ppe_type" defaultValue={ppe_type}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="serial_num" type="text" defaultValue={serial_num} placeholder="Serial No."
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="purchase_date" type="date" defaultValue={purchase_date}
                                    placeholder="Purchase Date..." className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="condition" type="radio" defaultValue={condition} placeholder="Condition"
                                    vertical
                                    className="col-lg-12 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.condition} returnValue/>
                    <ClearableInput name="notes" type="textarea" defaultValue={notes} placeholder="Notes"
                                    className="col-lg-12 margin-b-15 form-control"
                                    onChange={this.form.onChange}/>
                    <UploadButton
                        name="profile_pic"
                        buttonTitle="PPE Item Photo"
                        type={['Photo']}
                        defaultValue={profile_pic}
                        showOnlyIcon
                        className="col-lg-6 col-xs-12 hor-center"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
