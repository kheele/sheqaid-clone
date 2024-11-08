// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from "utils/Utils";

import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import TypedWrapper from "./TypedWrapper";

import updateOrganogram from "mutations/all/StructureAndResponsibility/Organogram/updateOrganogram"

import style from "./EditOrganogramDialog.lazy.css";
import findByIdOrganogram from "../Query/List/findByIdOrganogram";
import {CircularProgress} from "@mui/material";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditOrganogramDialog extends AEditDialog {
    pageKey = "EditOrganogramDialog";
    findById = findByIdOrganogram;
    removeById = updateOrganogram;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Organogram";
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/StructureAndResponsibility/organograms/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            target: [{text: 'Company', value: 'Client'}, {text: 'Project', value: 'Project'}, {
                text: 'Site',
                value: 'Site'
            }],
            types: [{value: "Upload", text: "Document (PDF/Spreadsheet)", checked: false}, {
                value: "Type",
                text: "Typed",
                checked: false
            }]
        },
        target: null,
        showDoc: false,
        showTyping: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.onChangeTarget = this.onChangeTarget.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.form.addChangeOne("target", this.onChangeTarget);
        this.form.addChangeOne("type", this.onChangeType);
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    componentWillMount() {
        const {execWhen} = this.props;
        execWhen(() => this.item).then(({data: {employee_list = []}}) => {
            this.oldList = employee_list.slice();
        });
    }

    // <editor-fold defaultstate="collapsed" desc="onChanges">
    onChangeTarget(el, val) {
        this.state.target = val;
    }

    // </editor-fold>

    onChangeType(el, val) {
        if (val) {
            if (val === 'Upload') {
                this.state.showDoc = true;
                this.state.showTyping = false;
            } else if (val === 'Type') {
                this.state.showTyping = true;
                this.state.showDoc = false;
            }
        } else {
            this.state.showTyping = false;
            this.state.showDoc = false;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            if (!form.isValid('target')) {
                infoDialog.open('Organogram For is required');
                return;
            }
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            const target = form.get('target');
            if ((target === 'Project' || target === 'Site') && !form.isValid('project')) {
                infoDialog.open('Project is required');
                return;
            }
            if (target === 'Site' && !form.isValid('site')) {
                infoDialog.open('Site is required');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('type')) {
                infoDialog.open('Organogram Source is required');
                return;
            }
        }
        if (idx === 2) {
            if (form.get("type") === 'Type' && !form.isValid('employee_list')) {
                infoDialog.open('Organogram List is required (Please add)');
                return;
            } else if (form.get("type") === 'Upload' && !form.isValid('doc')) {
                infoDialog.open('Document is required (Please upload)');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        const {isContractor, hasProjects} = storage.is;

        if (hasProjects) {
            if (!form.isValid('target')) {
                infoDialog.open('Organogram For is required');
                return;
            }
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            const target = form.get('target');
            if ((target === 'Project' || target === 'Site') && !form.isValid('project')) {
                infoDialog.open('Project is required');
                return;
            }
            if (target === 'Site' && !form.isValid('site')) {
                infoDialog.open('Site is required');
                return;
            }
        }

        if (!form.isValid('type')) {
            infoDialog.open('Organogram Source is required');
            return;
        }

        if (form.get("type") === 'Type' && !form.isValid('employee_list')) {
            infoDialog.open('Organogram List is required (Please add)');
            return;
        } else if (form.get("type") === 'Upload' && !form.isValid('doc')) {
            infoDialog.open('Document is required (Please upload)');
            return;
        }

        const {
            client, project, site, target, type, doc, employee_list
        } = form.data;
        const data = {};

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        ShouldUpdate.check(data, old_data, target, 'target');
        ShouldUpdate.check(data, old_data, type, 'type');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (employee_list) {
            const mapFn = ({employee_list, team, employee, employee_reported_to}) => {
                let item = "";
                if (team) {
                    item += ":" + team.id;
                }
                if (employee) {
                    item += ":" + employee.id;
                }
                if (employee_list) {
                    item += ":" + employee_list.map(v => {
                        return v.id;
                    }).join(":");
                }
                if (employee_reported_to) {
                    item += ":" + employee_reported_to.id;
                }
                return item;
            };
            const newListIds = JSON.stringify(employee_list.map(mapFn));
            const oldListIds = JSON.stringify(this.oldList.map(mapFn));
            console.log('newListIds', newListIds)
            console.log('oldListIds', oldListIds)
            if (oldListIds !== newListIds) {
                data.employee_list = employee_list.map(({id, employee_list, team, employee, employee_reported_to}) => {
                    const item = {id};
                    if (team) {
                        item.team_id = team.id;
                    }
                    if (employee) {
                        item.employee_id = employee.id;
                    }
                    if (employee_list) {
                        item.employee_list = employee_list.map(({id: employee_id}) => ({employee_id}));
                    }
                    if (employee_reported_to) {
                        item.employee_reported_to_id = employee_reported_to.id;
                    }
                    return item;
                });
            }
        }

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateOrganogram({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            progressDialog.close();
        });
    }

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
                    target, client, project, site, type, doc, employee_list
                }
            }
        } = this;

        console.log(this.item)
        const {isContractor, hasProjects} = storage.is;

        return <FormControls>
            {hasProjects && <Row
                rendered
                active
                idx={0}
                title={(!isContractor && "Company / Project / ") + "Site"}
                onFormOpen={onFormOpen}
                onFormNext={hasProjects && onFormNext}
            >
                <ClearableInput name="target" type="radio" placeholder="Organogram For" defaultValue={target}
                                className="col-lg-7 pull-left-2_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.target}/>
                {!isContractor &&
                    <SelectClientInputWrapper state={this.state} defaultValue={client} onChange={this.form.onChange}/>}
                {!isContractor && <SelectProjectInputWrapper state={this.state} defaultValue={project}
                                                             onChange={this.form.onChange}/>}
                <SelectSiteInputWrapper state={this.state} defaultValue={site} onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={!hasProjects}
                idx={1}
                title="1. Source"
                onFormOpen={onFormOpen}
                onFormBack={hasProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="type" type="radio" placeholder="Organogram Source" defaultValue={type}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.types}/>
            </Row>
            {doc &&
                <UploadedWrapper onFormOpen={onFormOpen} onFormBack={onFormBack} state={this.state} defaultValue={doc}
                                 onChange={this.form.onChange}/>}
            {employee_list && employee_list.isNotEmpty() &&
                <TypedWrapper ref="typedWrapper" refName="editDialog" onFormOpen={onFormOpen} onFormBack={onFormBack}
                              state={this.state} list={employee_list} onChange={this.form.onChange}/>}
        </FormControls>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="SelectClientInputWrapper">
@observer
class SelectClientInputWrapper extends React.Component {

    render() {
        const {defaultValue, state: {target}, onChange} = this.props;
        let w, left;
        if (target === "Client") {
            w = 6;
            left = " pull-left-" + 3;
        } else if (target === "Project") {
            w = 4;
            left = " pull-left-" + 2;
        } else if (target === "Site") {
            w = 4;
            left = "";
        } else {
            return null;
        }
        return <SelectClientInput key={new Date().getTime()} name="client" placeholder="Company..."
                                  defaultValue={defaultValue} required
                                  className={"col-lg-" + w + left + " form-control"} onChange={onChange}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectProjectInputWrapper">
@observer
class SelectProjectInputWrapper extends React.Component {

    render() {
        const {defaultValue, state: {target}, onChange} = this.props;
        return (target === "Project" || target === "Site") &&
            <SelectProjectInput key={new Date().getTime()} name="project" placeholder="Project..."
                                defaultValue={defaultValue} required className="col-lg-4 form-control"
                                onChange={onChange}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectSiteInputWrapper">
@observer
class SelectSiteInputWrapper extends React.Component {

    render() {
        const {defaultValue, state: {target}, onChange} = this.props;
        return target === "Site" &&
            <SelectSiteInput key={new Date().getTime()} name="site" placeholder="Site..." defaultValue={defaultValue}
                             required className="col-lg-4 form-control" onChange={onChange}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="UploadedWrapper">
@observer
class UploadedWrapper extends React.Component {

    render() {
        const {onFormOpen, onFormBack, defaultValue, state: {showDoc}, onChange} = this.props;
        return showDoc && <Row
            rendered
            idx={2}
            title="2. Uploaded Organogram Structure"
            className="row-source"
            onFormOpen={onFormOpen}
            onFormBack={onFormBack}>
            <UploadButton
                name="doc"
                defaultValue={defaultValue}
                buttonTitle="Document (PDF, Word, Excel, PowerPoint, Image)"
                type={['PDF', 'Word', 'Excel', 'PowerPoint', 'Image']}
                showOnlyIcon
                className="col-lg-12 hor-center"
                onChange={onChange}
            />
        </Row>;
    }
}

// </editor-fold>

export default EditOrganogramDialog;
