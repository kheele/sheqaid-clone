// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {
    AddFilesGridViewInput,
    ClearableInput,
    Clickable,
    SelectClientInput,
    SelectEmployeeInput, SelectProjectInput, SelectSiteInput
} from '../../../../../components/inputs';
import {FormControls, NavButtons, Row} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import {SelectAuditItemTable, SelectSourceTable, SourceBtnWrapper} from './NCRComponents';

import style from "./NewNCRDialog.lazy.css";
import {execWhen} from "../../../../../utils/UtilsFuns";
import NewNCRProgressListTable from "../../../../../components/FormTableComponents/NewNCRProgressListTable";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewNCRDialog">
@observer
class NewNCRDialog extends ANewDialog {
    pageKey = "NewNCRDialog";
    title = "Create NCR";
    className = 'ANewTableFormDialog';

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
    path = "plugin_sheq_assist/ncr/";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            type: ['Corrective Action', 'Preventative Action', 'Opportunity For Improver'],
            priority: ['Low', 'Medium', 'High', 'Critical'],
            status: ['Pending', 'Progressed', 'Completed'].map(text => {
                return {text, value: text, checked: false}
            }),
            status_acceptance: ['Pending', 'Approved', 'Rejected'].map(text => {
                return {text, value: text, checked: false}
            }),
            result: ['Pass', 'Fail'].map(text => {
                return {text, value: text, checked: false}
            }),
            selected_source: [],
            source: [
                {label: "Site Audit", value: 'N/A'},
                {label: 'Compliance Audit', value: '21_Internal_Audit/audit/'},
                {label: 'Inspection', value: '21_Internal_Audit/inspection/'},
                {label: 'Incident Investigation', value: '17_Incident_Investigation/'}
            ]
        },
    };
    // </editor-fold>
    source = null;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.onSelectSite = this.onSelectSite.bind(this);
        this.onSelectSource = this.onSelectSource.bind(this);
        this.onSelectSourceItem = this.onSelectSourceItem.bind(this);

        this.onChangeSelectedSource = this.onChangeSelectedSource.bind(this);

        this.form = new Form();
        this.form.addChangeOne("source", this.onChangeSource.bind(this));
        this.form.addChangeOne("selected_source", this.onChangeSelectedSource);
        this.form.addChangeOne("selected_source_item", this.onChangeSelectedSourceItem.bind(this));
    }

    // </editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        const {dialog} = this.props;
        const selected_source = dialog.extraProp('selected_source');
        if (selected_source) {
            this.onChangeSelectedSource(null, selected_source);
        }
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSelectSite, onSelectSource, onChangeSource, onChangeSelectedSource, onChangeSelectedSourceItem">
    onSelectSite(val, el) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.selectSourceTable).then(selectSourceTable => {
            selectSourceTable.selected_source = val;
        });
    }

    onSelectSource(evt, btn) {
        const {selectSourceTable} = this.refs;
        selectSourceTable.open();
    }

    onSelectSourceItem(evt, btn) {
        const {execWhen, dialog} = this.props;
        execWhen(() => this.refs.selectSourceTable && this.refs.selectSourceListTable && this.refs.desc).then(() => {
            const {selectSourceTable, selectSourceListTable} = this.refs;
            const {selected_source} = selectSourceTable;
            const is_array = isArray(selected_source) || isObservableArray(selected_source);
            if (selected_source && ((is_array && !selected_source.isEmpty()) || !is_array)) {
                let list;
                switch (this.source.label) {
                    case "Site Audit":
                        break;
                    case "Compliance Audit": {
                        const search = ['Major NCR', 'Minor NCR', 'Complaint', 'Observation'];
                        list = selected_source.data.list.filter(({audit_summary}) => search.contains(audit_summary));
                        selectSourceListTable && selectSourceListTable.setOnCancel(() => {
                            selectSourceTable.clearSelection();
                        }).open(list);
                        break;
                    }
                    case "Inspection": {
                        //                    list = ;
                        break;
                    }
                    case "Incident Investigation": {
                        //                    list = ;
                        break;
                    }
                }
            } else {
//                selectSourceTable.clearSelection();
//                selectSourceTable.setSelectedList([]);
//                delete this.preventSourceChange;
            }
        });
    }

    onChangeSource(el, val) {
        this.source = val;
        const {execWhen} = this.props;
        execWhen(() => this.refs.sourceBtn).then(ref => {
            ref.source = val;
        });
        execWhen(() => this.refs.selectSourceTable).then(ref => {
            ref.source = val;
        });
        execWhen(() => this.refs.selectSourceListTable).then(ref => {
            ref.source = val;
        });
    }

    onChangeSelectedSource(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.selectSourceTable).then(selectSourceTable => {
            selectSourceTable.selected_source = val;
            selectSourceTable.close();
        });
    }

    onChangeSelectedSourceItem(el, val) {
        const {execWhen, dialog} = this.props;
        execWhen(() => this.refs.selectSourceTable && this.refs.desc).then(() => {
            const {selectSourceTable, desc} = this.refs;
            selectSourceListTable.selected_source_item = val;
            if (val) {
                switch (this.source.label) {
                    case "Site Audit":
                        break;
                    case "Compliance Audit": {
                        desc.onChange(val.audit_findings);
                        break;
                    }
                    case "Inspection": {
                        //                    list = ;
                        break;
                    }
                    case "Incident Investigation": {
                        //                    list = ;
                        break;
                    }
                }
            }
            selectSourceTable.close();
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('source')) {
                infoDialog.open('Source is required');
                return;
            }
        }
        if (idx === 2) {
            if (!form.isValid('desc')) {
                infoDialog.open('Finding / NCR Description is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('source')) {
            infoDialog.open('Source is required');
            return;
        }

        if (!form.isValid('desc')) {
            infoDialog.open('Finding / NCR Description is required');
            return;
        }

        const {selected_source} = this.refs.selectSourceTable;
        const {
            //0
            site,
            project,
            client,
            //1
            type, priority,
            selected_source_item,
            //2
            desc, process,
            //3
            due_date, responsible_person, approving_person,
            //4
            document_list,
            //5
            comments, remarks,
            //6
            progress_list,
            //7
            status_acceptance, status, result, completed_date, additional_notes
        } = form.data;
        const data = {
            source: this.source.label,
            desc
        };

        //0
        if (client) {
            if (client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        if (project) {
            if (project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
            } else {
                data.project = project;
            }
        }
        if (site) {
            if (site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
            } else {
                data.site = site;
            }
        }

        //1
        if (type) {
            data.type = type;
        }
        if (priority) {
            data.priority = priority;
        }
        if (selected_source) {
            data.selected_source_id = selected_source.id;
        }
        if (selected_source_item) {
            data.selected_source_item = selected_source_item;
        }
        //2
        if (process) {
            data.process = process;
        }
        //3
        if (due_date) {
            data.due_date = due_date.getTime();
        }
        if (responsible_person) {
            if (responsible_person.id) {
                const {id, data: _data, fname, lname, email} = responsible_person;
                data.responsible_person = {
                    id,
                    fname: fname || _data.fname,
                    lname: lname || _data.lname,
                    email: email || _data.email
                };
            } else {
                data.responsible_person = responsible_person;
            }
        }
        if (approving_person) {
            if (approving_person.id) {
                const {id, data: _data, fname, lname, email} = approving_person;
                data.approving_person = {
                    id,
                    fname: fname || _data.fname,
                    lname: lname || _data.lname,
                    email: email || _data.email
                };
            } else {
                data.approving_person = approving_person;
            }
        }
        //4
        if (document_list) {
            data.document_list = document_list.map(({path}) => path);
        }
        //5
        if (comments) {
            data.comments = comments;
        }
        if (remarks) {
            data.remarks = remarks;
        }
        //6
        if(progress_list) {
            data.progress_list = progress_list.slice().map(({progress_date, ...others}) => ({
                ...others,
                progress_date: progress_date.getTime(),
            }));
        }
        //7
        if(status_acceptance) {
            data.status_acceptance = status_acceptance;
        }
        if (status) {
            data.status = status;
        }
        if (result) {
            data.result = result;
        }
        if (completed_date) {
            data.completed_date = completed_date.getTime();
        }
        if (additional_notes) {
            data.additional_notes = additional_notes;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            if (isString(res)) {
                if (res === 'RESPONSIBLE_PERSON_NOT_EXISTS') {
                    infoDialog.open("Responsible Person does not exist. They may have been removed from the system.");
                } else if (res === 'APPROVING_PERSON_NOT_EXISTS') {
                    infoDialog.open("Approving Person does not exist. They may have been removed from the system.");
                } else if (res === 'CONTRACTOR_NOT_EXISTS') {
                    infoDialog.open("Your Contractor could not be found not exist. It may have been removed from the system.");
                } else if (res === 'SOURCE_UNKNOWN') {
                    infoDialog.open("Source is missing. Please try again.");
                } else if (res === 'SELECTED_SOURCE_NOT_FOUND') {
                    infoDialog.open("Selected source not found. Please try again.");
                } else {
                    infoDialog.open("An error occurred. Please try again.");
                }
            } else if (!!res) {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully saved.");
                infoDialog.close(2000);
                this.props.close();
            } else {
                infoDialog.open("An error occurred. Please try again.");
                infoDialog.close(2000);
            }
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    //<editor-fold desc="defaultSource">
    get defaultSource() {
        const {dialog} = this.props;
        const source = dialog.extraProp('source');
        let defaultSource;
        const {source: state_source} = this;
        if (state_source) {
            defaultSource = state_source;
        } else if (source) {
            defaultSource = this.state.lists.source.find(({label}) => label === source);
        }
        return defaultSource;
    }
    //</editor-fold>

    /// <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;

        const {isConsultant} = storage.is;

        return (<FormControls>
            <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}

                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                                 onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={1}
                title="1. Non-Conformance Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="type" type="select" placeholder="Type..."
                                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.type} returnValue/>
                <ClearableInput name="priority" type="select" placeholder="Priority..."
                                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.priority} returnValue/>

                <hr className="pull-left margin-0 margin-t-0 margin-b-15"/>

                <ClearableInput name="source" type="select" placeholder="Source..." defaultValue={this.defaultSource}
                                required className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.source}/>
                <SourceBtnWrapper ref="sourceBtn" onClick={this.onSelectSource} onSelectSite={this.onSelectSite}/>
                <SelectSourceTable ref="selectSourceTable" onSelectSourceItem={this.onSelectSourceItem}
                                   onChange={this.form.onChange}/>
                <SelectAuditItemTable ref="selectSourceListTable" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Finding / NCR Description & Process"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="desc" name="desc" type="textarea" placeholder="Finding / NCR Description" required
                                className="col-lg-12 form-control min-h-60" onChange={this.form.onChange}/>
                <ClearableInput name="process" type="textarea" placeholder="Process"
                                className="col-lg-12 form-control min-h-60" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Due Date & Persons Assigned"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="due_date" type="date" placeholder="Due Date..."
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." showOtherPerson
                                     required className="col-lg-8 pull-left-2 form-control"
                                     onChange={this.form.onChange}/>
                <SelectEmployeeInput name="approving_person" placeholder="Approving Person..." showOtherPerson required
                                     className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Document(s) / Media"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <AddFilesGridViewInput name="document_list" title="Add Document/File" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Comments & Remarks"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="comments" name="comments" type="textarea" placeholder="Comments" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="remarks" name="remarks" type="textarea" placeholder="Remarks"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Progress"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewNCRProgressListTable ref="progress_list" name="progress_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Status / Result / Closed Out"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput ref="status_acceptance" name="status_acceptance" type="radio" placeholder="Acceptance Status"
                                vertical={2}
                                className="col-lg-6 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status_acceptance} returnValue/>
                <ClearableInput ref="status" name="status" type="radio" placeholder="Status"
                                vertical={2}
                                className="col-lg-6 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status} returnValue/>
                <ClearableInput ref="result" name="result" type="radio" placeholder="Result"
                                className="col-lg-6 form-control" onChange={this.form.onChange}
                                values={this.state.lists.result} returnValue/>
                <ClearableInput name="completed_date" type="date" placeholder="Completed Date..."
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ClearableInput ref="additional_notes" name="additional_notes" type="textarea"
                                placeholder="Additional Notes" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewNCRDialog;
