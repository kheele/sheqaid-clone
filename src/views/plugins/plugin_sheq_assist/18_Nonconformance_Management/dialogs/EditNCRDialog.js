// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {execWhen, ShouldUpdate} from '../../../../../utils/Utils';
import {
    AddFilesGridViewInput,
    ClearableInput,
    Clickable,
    SelectClientInput,
    SelectEmployeeInput, SelectProjectInput, SelectSiteInput
} from '../../../../../components/inputs';
import {FormControls, NavButtons, Row} from '../../../../../components/FormComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import {SelectAuditItemTable, SelectSourceTable, SourceBtnWrapper} from './NCRComponents';

import style from "./EditNCRDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EditNCRDialog">
@observer
class EditNCRDialog extends AEditDialog {
    pageKey = "EditNCRDialog";
    title = "Edit NCR";
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
            status: ['Pending', 'Progress', 'Approved', 'Rejected', 'Completed'].map(text => {
                return {text, value: text, checked: false}
            }),
            result: ['Pass', 'Fail'].map(text => {
                return {text, value: text, checked: false}
            }),
            selected_source: [],
            source: [
                {label: 'Site Audit', value: 'N/A'},
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

        this.form = new Form();
        this.form.addChangeOne("source", this.onChangeSource.bind(this));
        this.form.addChangeOne("selected_source", this.onChangeSelectedSource.bind(this));
        this.form.addChangeOne("selected_source_item", this.onChangeSelectedSourceItem.bind(this));
    }

    // </editor-fold>

    componentDidMount() {
        execWhen(() => this.item).then(item => {
            const {data: {selected_source_ref, selected_source_item}} = item;

            execWhen(() => this.refs.selectSourceTable && this.refs.selectSourceListTable).then(() => {
                const {selectSourceTable, selectSourceListTable} = this.refs;
                selectSourceTable.selected_source = selected_source_ref;
                selectSourceListTable.selected_source_item = selected_source_item;
            });
        });
    }

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
        const {form, item: {data: old_data}} = this;

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
            status, result, progress_date, completed_date, outstanding, additional_notes
        } = form.data;
        const data = {};

        //0
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        //1
        ShouldUpdate.check(data, old_data, type, 'type');
        ShouldUpdate.check(data, old_data, priority, 'priority');
        ShouldUpdate.check(data, old_data, selected_source, 'selected_source');
        ShouldUpdate.check(data, old_data, selected_source_item, 'selected_source_item');
        //2
        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.check(data, old_data, process, 'process');
        //3
        ShouldUpdate.checkDate(data, old_data, due_date, 'due_date');
        ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');
        ShouldUpdate.checkEmployee(data, old_data, approving_person, 'approving_person');
        //4
        ShouldUpdate.checkFileList(data, old_data, document_list, 'document_list');
        //5
        ShouldUpdate.check(data, old_data, comments, 'comments');
        ShouldUpdate.check(data, old_data, remarks, 'remarks');
        //6
        ShouldUpdate.check(data, old_data, status, 'status');
        ShouldUpdate.check(data, old_data, result, 'result');
        ShouldUpdate.checkDate(data, old_data, progress_date, 'progress_date');
        ShouldUpdate.checkDate(data, old_data, completed_date, 'completed_date');
        ShouldUpdate.check(data, old_data, outstanding, 'outstanding');
        ShouldUpdate.check(data, old_data, additional_notes, 'additional_notes');

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
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
                onSaved && onSaved(data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    get defaultSource() {
        const {item: {data: {source}}} = this;
        return this.state.lists.source.find(v => v.label === source);
    }

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    client, project, site,
                    //1
                    type, priority,
                    source, selected_source_id, selected_source_ref, selected_source_item,
                    //2
                    desc, process,
                    //3
                    due_date, responsible_person, approving_person,
                    //4
                    document_list,
                    //5
                    comments, remarks,
                    //6
                    status, result, progress_date, completed_date, outstanding, additional_notes
                }
            }
        } = this;

        const {isConsultant} = storage.is;

        let responsible_personDefault;
        if (responsible_person) {
            const {id, fname, lname, email} = responsible_person;
            responsible_personDefault = {label: lname + ' ' + fname, value: responsible_person};
        }
        let approving_personDefault;
        if (approving_person) {
            const {id, fname, lname, email} = approving_person;
            approving_personDefault = {label: lname + ' ' + fname, value: approving_person};
        }
        console.log('item', item.data)

        return (<FormControls>
            <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant &&
                    <SelectClientInput name="client" placeholder="Company..." defaultValue={client} required
                                       className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={project} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={site} required
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={1}
                title="1. Non-Conformance Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="type" type="select" placeholder="Type..." defaultValue={type}
                                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.type} returnValue/>
                <ClearableInput name="priority" type="select" placeholder="Priority..." defaultValue={priority}
                                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.priority} returnValue/>

                <hr className="pull-left margin-0 margin-t-0 margin-b-15"/>

                <ClearableInput name="source" type="select" placeholder="Source..." defaultValue={this.defaultSource}
                                required className="col-lg-6 pull-left-3 form-control margin-b-10"
                                onChange={this.form.onChange} values={this.state.lists.source}/>
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
                <ClearableInput ref="desc" name="desc" defaultValue={desc} type="textarea"
                                placeholder="Finding / NCR Description" required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="process" type="textarea" placeholder="Process" defaultValue={process}
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
                <ClearableInput name="due_date" type="date" defaultValue={due_date} placeholder="Due Date..." required
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <SelectEmployeeInput name="responsible_person" defaultValue={responsible_personDefault} showOtherPerson
                                     placeholder="Responsible Person..." required
                                     className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>
                <SelectEmployeeInput name="approving_person" defaultValue={approving_personDefault} showOtherPerson
                                     placeholder="Approving Person..." required
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
                <AddFilesGridViewInput name="document_list" defaultValue={document_list} title="Add Document/File"
                                       onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Comments & Remarks"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="comments" name="comments" defaultValue={comments} type="textarea"
                                placeholder="Comments" required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="remarks" name="remarks" defaultValue={remarks} type="textarea"
                                placeholder="Remarks" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Item Progress / Closed Out"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput ref="status" name="status" type="radio" placeholder="Status" defaultValue={status}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status} returnValue/>
                <ClearableInput ref="result" name="result" type="radio" placeholder="Result" defaultValue={result}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.result} returnValue/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ClearableInput name="progress_date" type="date" placeholder="Progress Date..."
                                defaultValue={progress_date} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="completed_date" type="date" placeholder="Completed Date..."
                                defaultValue={completed_date} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ClearableInput ref="outstanding" name="outstanding" type="textarea" placeholder="Outstanding"
                                defaultValue={outstanding} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="additional_notes" name="additional_notes" type="textarea"
                                placeholder="Additional Notes" defaultValue={additional_notes}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditNCRDialog;
