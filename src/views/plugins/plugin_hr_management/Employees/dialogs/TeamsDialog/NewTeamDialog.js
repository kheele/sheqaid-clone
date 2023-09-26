// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {
    ClearableInput, RowOrgs,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable, NewPPEItemListTable} from 'components/FormTableComponents';

import style from "./NewTeamDialog.lazy.css";
import insertTeam from "mutations/all/Team/insertTeam";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewTeamDialog";
    title = "Create Team";

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
    path = "plugin_sheq_assist/employees/teams/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            status: [{text: "Active", value: "Active", checked: true}, {
                text: "Inactive",
                value: "Inactive",
                checked: false
            }]
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("supervisor", this.onChangeSupervisor.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeSupervisor(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.employee_list).then(list_ref => {
            if (val) {
                const path = "plugin_sheq_assist/StructureAndResponsibility/organograms/list/team/by_supervisor";
                neonBinding.events.emit(path, val.id).then(res => {
                    console.log("res", res)
                    if (res && isArray(res)) {
                        list_ref.list = [...res, null];
                    } else {

                    }
                }).catch(err => {

                });
            }
        });
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
            if (!form.isValid('project')) {
                infoDialog.open('Project is required');
                return;
            }
            if (!form.isValid('site')) {
                infoDialog.open('Site is required');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('supervisor')) {
                infoDialog.open('Supervisor is required');
                return;
            }
            if (!form.isValid('name')) {
                infoDialog.open('Team Name is required');
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
        if (!form.isValid('project')) {
            infoDialog.open('Project is required');
            return;
        }
        if (!form.isValid('site')) {
            infoDialog.open('Site is required');
            return;
        }

        //2
        if (!form.isValid('supervisor')) {
            infoDialog.open('Supervisor is required');
            return;
        }
        if (!form.isValid('name')) {
            infoDialog.open('Team Name is required');
            return;
        }

        //3
        if (!form.isValid('employee_list') || form.get('employee_list').isEmpty()) {
            infoDialog.open('At least 1 team member is required');
            return;
        }

        const {
            site, project, client,
            //
            supervisor,
            name,
            status,
            //
            employee_list,
            //
            ppe_list
        } = form.data;
        const data = {
            name,
            status,
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,

            supervisor_id: supervisor && supervisor.id,
            employee_list: {
                data: employee_list.map(v => {
                    if (v.employee) {
                        return {id: v.employee.id};
                    } else {
                        return {id: v.id};
                    }
                })
            },
            ppe_list: {
                data: ppe_list.map(v => {
                    if (v.ppe) {
                        return {ppe_id: v.ppe.id};
                    } else {
                        return {ppe_id: v.id};
                    }
                })
            }
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertTeam(data).then(res => {
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
                  title="1. Team Details"
                >
                    <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="col-lg-12 form-control"
                                         onChange={this.form.onChange}/>
                    <ClearableInput name="name" type="text" placeholder="Team Name" className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="status" type="radio" placeholder="Status" isClearable={false}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.status} returnValue/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Team Members"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewEmployeeListTable name="employee_list" disableOtherPerson onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. PPE Required"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewPPEItemListTable name="ppe_list" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
