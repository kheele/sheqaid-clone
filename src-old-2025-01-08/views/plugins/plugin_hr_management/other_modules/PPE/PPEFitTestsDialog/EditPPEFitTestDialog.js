// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs, SelectPPETypeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditPPEFitTestDialog.lazy.css";
import {findByIdPPEFitTest} from "mutations/findById";
import {updatePPEFitTest} from "mutations/update";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPEFitTestDialog";
    title = "Edit PPE Fit Test";
    findById = findByIdPPEFitTest;
    removeById = updatePPEFitTest;

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
            result: ['Pass', 'Fail'].map(value => ({text: value, value, checked: false})),
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
            updatePPEFitTest({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (!res) {
                    infoDialog.open("An error occurred. Please try again.");
                } else {
                    const res_data = res;
                    onSaved && onSaved(res_data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    // this.props.close();
                }
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
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('result')) {
                infoDialog.open('Result is required');
                return;
            }
            if (!form.isValid('test_date')) {
                infoDialog.open('Test Date is required');
                return;
            }

            const {
                site, project, client,
                //
                test_date,
                next_due_date,
                result,
                notes,
                ppe_type,
                employee,
            } = form.data;

            const data = {};
            ShouldUpdate.checkPPEType(data, old_data, ppe_type, 'ppe_type');
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee');
            ShouldUpdate.check(data, old_data, result, 'result');
            ShouldUpdate.check(data, old_data, notes, 'notes');
            ShouldUpdate.checkDate(data, old_data, test_date, 'test_date');
            ShouldUpdate.checkDate(data, old_data, next_due_date, 'next_due_date');

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
            item: {
                id, data: {
                    created_at,
                    site, project, client,
                    //
                    test_date,
                    next_due_date,
                    result,
                    notes,
                    ppe_type,
                    employee,
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Fit Test Details"
                    onFormNext={null}
                >
                    <SelectPPETypeInput
                        name="ppe_type"
                        defaultValue={ppe_type}
                        placeholder="PPE Type..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <SelectEmployeeInput
                        name="employee"
                        placeholder="Employee..."
                        defaultValue={employee}
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="result"
                        type="radio"
                        placeholder="Result"
                        defaultValue={result}
                        className="col-lg-12 form-control"
                        values={this.state.lists.result}
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="notes"
                        type="textarea"
                        placeholder="Notes"
                        defaultValue={notes}
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="test_date"
                        type="date"
                        placeholder="Test Date"
                        defaultValue={test_date}
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="next_due_date"
                        type="date"
                        placeholder="Next Due Date"
                        defaultValue={next_due_date}
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
