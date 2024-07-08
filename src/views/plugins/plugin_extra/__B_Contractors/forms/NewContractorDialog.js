import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectClientInput, SelectProjectInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewSiteListTable} from 'components/FormTableComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewContractorDialog.lazy.css";
import insertContractor from "mutations/all/Contractor/insertContractor";

// import {insertContractor} from "mutations/create";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewContractorDialog";
    title = "Create Contractor";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/";
    @observable
    state = {
        lists: {
            inc_contractor_pack: [
                {text: 'Yes', value: 'Yes', checked: false},
                {text: 'No', value: 'No', checked: false}
            ]
        }
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Contractor Name is required');
                return;
            }
            if (!form.isValid('username')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('username').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('inc_contractor_pack')) {
                infoDialog.open("Include Contractor's Pack is required");
                return;
            }
        }

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        const {hasProjects} = storage.is;

        //1
        if (!form.isValid('name')) {
            infoDialog.open('Contractor Name is required');
            return;
        }
        if (!form.isValid('username')) {
            infoDialog.open('Email Address is required');
            return;
        } else if (!form.get('username').isEmailAddress()) {
            infoDialog.open('Email Address is not valid');
            return;
        }
        if (!form.isValid('inc_contractor_pack')) {
            infoDialog.open("Include Contractor's Pack is required");
            return;
        }

        //2
        if (hasProjects) {
            if (!form.isValid('site_list') || form.get('site_list').isEmpty()) {
                infoDialog.open('At least one Site is required');
                return;
            }
        }

        const {
            //1
            name, username, inc_contractor_pack, site_list,
        } = form.data;
        const data = {
            //1
            name,
            username,
        };

        if (hasProjects) {
            data.site_list = {
                data: site_list.map(({inc_contractor_pack, site: {id: site_id}}) => {
                    return {site_id, inc_contractor_pack,};
                })
            };
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertContractor(data).then(res => {
            console.log("res", res)
            if (res === "EMAIL_DUP") {
                infoDialog.open("Contractor with this email address already exist.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully saved.");
                infoDialog.close(2000);
                this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close(), 0);
        });
    }

    render() {
        let {props: {onFormNext, onFormBack, onFormOpen}} = this;
        const {isConsultant, hasProjects} = storage.is;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Employer Details"
                onFormOpen={onFormOpen}
                onFormNext={hasProjects && onFormNext}
            >
                <ClearableInput name="name" placeholder="Contractor Name" required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="username" type="email" placeholder="Email Address" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="inc_contractor_pack" type="radio" placeholder="Include Contractor's Pack?"
                                required className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.inc_contractor_pack} returnValue/>
            </Row>
            {hasProjects && <Row
                rendered
                idx={2}
                title="2. Add Site(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <NewSiteListTable name="site_list" onChange={this.form.onChange}/>
            </Row>}
        </FormControls>;
    }
}

export default NewDialog;
