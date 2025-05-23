// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, SelectClientInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewLeaveTypeDialog.lazy.css";
import {insertEmployeeLeaveType} from "mutations/create";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewLeaveTypeDialog";
    title = "Create Leave Type";

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
            duration_type: [
                {text: "Years", value: "Years", checked: false},
                {text: "Months", value: "Months", checked: false},
                {text: 'Weeks', value: 'Weeks', checked: false},
                {text: 'Days', value: 'Days', checked: false}
            ]
        },
        duration_type: null
    };
    // </editor-fold>

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
        if (!form.isValid('name')) {
            infoDialog.open('Name is required');
            return;
        }

        const {
            client,
            //
            name,
            desc,
        } = form.data;

        console.log(form.data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeLeaveType(form.data).then(res => {
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
                <SelectClientInput name="client" placeholder="Company..." required
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Leave Policy Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput
                    name="name"
                    type="text"
                    placeholder="Name"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="desc"
                    type="textarea"
                    placeholder="Description"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
