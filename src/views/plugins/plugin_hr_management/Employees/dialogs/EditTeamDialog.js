// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../utils/Utils';

import {AEditDialog} from '../../../../../components/dialogs';
import {
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {NewEmployeeListTable, NewPPEItemListTable} from '../../../../../components/FormTableComponents';

import style from "./EditTeamDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditTeamDialog";
    title = "Edit Team";

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
        execWhen(() => this.refs.list).then(list_ref => {
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
        const {form, item: {data: old_data}} = this;

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
        if (!form.isValid('list') || form.get('list').isEmpty()) {
            infoDialog.open('At least 1 team member is required');
            return;
        }

        const {
            site, project, client,
            //
            supervisor,
            name, status,
            //
            list,
            //
            ppe_list
        } = form.data;

        const data = {};

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        ShouldUpdate.checkEmployee(data, old_data, supervisor, 'supervisor');
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, status, 'status');

        ShouldUpdate.checkEmployeeList(data, old_data, list, 'list');
        if (data.list) {
            data.list = data.list.map(v => {
                if (v.employee) {
                    return v.employee.id;
                } else {
                    return v.id;
                }
            });
        }

        ShouldUpdate.checkPPEList(data, old_data, ppe_list, 'ppe_list');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
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
        });
    }

    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    site, project, client,
                    supervisor, supervisor: {fname, lname},
                    name, status,
                    //
                    list,
                    //
                    ppe_list
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        const supervisorDefault = {label: lname + ' ' + fname, value: supervisor};
        return (<FormControls>
            {!isNoProjects && <Row
                active
                rendered
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..."
                                   defaultValue={RenderUtils.selectedClient.call(this)} required
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..."
                                    defaultValue={RenderUtils.selectedProject.call(this)} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)}
                                 required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Team Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." defaultValue={supervisorDefault}
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="name" type="text" placeholder="Team Name" defaultValue={name}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="status" type="radio" placeholder="Status" defaultValue={status}
                                isClearable={false} className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status} returnValue/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Team Members"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewEmployeeListTable name="list" defaultValue={[...(list || []), null]} disableOtherPerson
                                      onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. PPE Required"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewPPEItemListTable name="ppe_list" defaultValue={[...(ppe_list || []), null]}
                                     onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
