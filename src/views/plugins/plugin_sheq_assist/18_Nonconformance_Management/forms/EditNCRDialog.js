// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, ShouldUpdate} from 'utils/Utils';
import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {
    NewEmployeeListTable,
    NewJobPositionListTable,
    NewNCRResponsiblePartyListTable,
    NewUserListTable
} from 'components/FormTableComponents';
import {AEditDialog} from 'components/dialogs';

import {NewDocumentTable, SelectSourceItemTable, SelectSourceTable, SourceBtnWrapper} from '../dialogs/NCRComponents';

import style from "./EditNCRDialog.lazy.css";
import NewNCRProgressListTable from "components/FormTableComponents/NewNCRProgressListTable";
import {updateNCR, updateNCRProgress} from "mutations/update";
import {findByIdAudit, findByIdNCR, findByIdQuestion, findByIdSite} from "mutations/findById";
import {CircularProgress} from "@mui/material";
import findByIdIncident from "mutations/all/Incident/findByIdIncident";
import findByIdInspectionsQuestionnaire
    from "mutations/all/Questionnaires/InspectionsQuestionnaires/findByIdInspectionsQuestionnaire";
import {
    insertNCRProgress,
    insertProxyNCRApprovingPerson,
    insertProxyNCRAssignedJobPosition,
    insertProxyNCRAssignedPerson,
    insertProxyNCRAssignedUser,
    insertProxyNCRDocument,
    insertProxyNCRResponsibleParty,
} from "mutations/create";
import {
    deleteNCRProgress,
    deleteProxyNCRApprovingPerson,
    deleteProxyNCRAssignedJobPosition,
    deleteProxyNCRAssignedPerson,
    deleteProxyNCRAssignedUser,
    deleteProxyNCRDocument,
    deleteProxyNCRResponsibleParty
} from "mutations/delete";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EditDialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditNCRDialog";
    title = "Edit NCR";
    className = 'ANewTableFormDialog';
    findById = findByIdNCR;
    removeById = updateNCR;

    constructor(props) {
        super(props, style);
    }

    get topButtonsHiddenSave() {
        return true;
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
            allocation: ['NCR', 'Finding', 'Observation', 'Deviation'],
            status_progress: ['Pending', 'Progressed', 'Approved', 'Rejected', 'Completed'].map(text => {
                return {text, value: text, checked: false}
            }),
            status_acceptance: ['Pending', 'Approved', 'Rejected'].map(text => {
                return {text, value: text, checked: false}
            }),
            responsible_party_list: ['Consultant', 'Client', 'External', 'Internal'],
            result: ['Pass', 'Fail'].map(text => {
                return {text, value: text, checked: false}
            }),
            selected_source: [],
            source: [
                {label: "Site Audit", value: 'N/A'},
                {label: 'Compliance Audit', value: sockets.of('audits').fn('listByLogged')},
                {label: 'Inspection', value: sockets.of('inspections').fn('listCompletedByLogged')},
                {label: 'Incident Investigation', value: sockets.of('incidents/investigations').fn('listByLogged')}
            ]
        },
    };
    // </editor-fold>
    source = null;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        this.onFormSave = this.onFormSave.bind(this);

        this.onSelectSite = this.onSelectSite.bind(this);
        this.onSelectSource = this.onSelectSource.bind(this);
        this.onSelectSourceItem = this.onSelectSourceItem.bind(this);

        this.form = new Form();
        this.form.addChangeOne("source", this.onChangeSource.bind(this));
        this.form.addChangeOne("selected_source", this.onChangeSelectedSource.bind(this));
        this.form.addChangeOne("selected_source_item", this.onChangeSelectedSourceItem.bind(this));
    }

    // </editor-fold>

    get defaultSource() {
        const {item: {data: {source}}} = this;
        return this.state.lists.source.find(v => v.label === source);
    }

    //</editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        execWhen(() => this.item && this.refs.selectSourceTable && this.refs.selectSourceListTable).then(async () => {
            const {
                data: {
                    selected_source_item,
                    selected_source_compliance_audit,
                    selected_source_incident,
                    selected_source_inspection,
                    selected_source_site,
                    selected_source_item_compliance_audit_finding,
                    selected_source_item_incident,
                    selected_source_item_inspection_ques,
                }
            } = this.item;

            const {sourceBtn, selectSourceTable, selectSourceListTable} = this.refs;
            selectSourceListTable.selected_source_item = selected_source_item_compliance_audit_finding || selected_source_item_incident || selected_source_item_inspection_ques;

            try {
                if (selected_source_compliance_audit) {
                    selectSourceTable.selected_source = await findByIdAudit(selected_source_compliance_audit.id);
                } else if (selected_source_incident) {
                    selectSourceTable.selected_source = await findByIdIncident(selected_source_incident.id);
                } else if (selected_source_inspection) {
                    selectSourceTable.selected_source = await findByIdInspectionsQuestionnaire(selected_source_inspection.id);
                } else if (selected_source_site) {
                    selectSourceTable.selected_source = await findByIdSite(selected_source_site.id);
                    sourceBtn.selected_source = selectSourceTable.selected_source;
                }
            } catch (e) {
                selectSourceTable.is_error = true;
            } finally {
                selectSourceTable.is_loaded = false;
            }

            try {
                if (selected_source_item_compliance_audit_finding) {
                    selectSourceTable.selected_source_item = await findByIdAudit(selected_source_item_compliance_audit_finding.id);
                } else if (selected_source_item_incident) {
                    selectSourceTable.selected_source_item = await findByIdIncident(selected_source_item_incident.id);
                } else if (selected_source_item_inspection_ques) {
                    selectSourceTable.selected_source_item = await findByIdQuestion(selected_source_item_inspection_ques.id);
                }
            } catch (e) {
                selectSourceTable.is_error = true;
            } finally {
                selectSourceTable.is_loaded = false;
            }
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

    // </editor-fold>

    onChangeSelectedSource(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.selectSourceTable).then(selectSourceTable => {
            selectSourceTable.selected_source = val;
            selectSourceTable.close();
        });
    }

    // </editor-fold>

    onChangeSelectedSourceItem(el, val) {
        const {execWhen, dialog} = this.props;
        execWhen(() => this.refs.selectSourceTable && this.refs.selectSourceListTable && this.refs.desc).then(() => {
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

    //</editor-fold>

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

    //<editor-fold desc="onFormSave">
    onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
        } = this;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateNCR({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (isString(res)) {
                    infoDialog.open("An error occurred. Please try again.");
                } else if (!!res) {
                    onSaved && onSaved(data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    this.props.close();
                } else {
                    infoDialog.open("An error occurred. Please try again.");
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
            ShouldUpdate.checkClient(data, old_data, client);
            ShouldUpdate.checkProject(data, old_data, project);
            ShouldUpdate.checkSite(data, old_data, site);

            onSubmit(data);
            return;
        }

        if (idx === 1) {
            if (!form.isValid('source')) {
                infoDialog.open('Source is required');
                return;
            }

            const {selected_source} = this.refs.selectSourceTable;

            const source = this.source.label;
            const sources = {
                "Site Audit": "selected_source_site_id",
                'Compliance Audit': "selected_source_compliance_audit_id",
                'Inspection': "selected_source_inspection_id",
                'Incident Investigation': "selected_source_incident_id",
            };

            const {
                type,
                priority,
                allocation,
            } = form.data;

            const data = {}
            ShouldUpdate.check(data, old_data, type, 'type');
            ShouldUpdate.check(data, old_data, priority, 'priority');
            ShouldUpdate.check(data, old_data, allocation, 'allocation');
            ShouldUpdate.check(data, old_data, source, 'source');
            ShouldUpdate.check(data, old_data, selected_source && selected_source.id, sources[source]);

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            if (!form.isValid('desc')) {
                infoDialog.open('Finding / NCR Description is required');
                return;
            }

            const {
                desc, process,
            } = form.data;
            const data = {};
            ShouldUpdate.check(data, old_data, desc, 'desc');
            ShouldUpdate.check(data, old_data, process, 'process');

            onSubmit(data);
            return;
        }

        if (idx === 3) {
            const {
                due_date,
                responsible_party_list,
                assigned_job_position_list,
                assigned_person_list,
                assigned_user_list,
                approving_person_list,
            } = form.data;

            const data = {};
            ShouldUpdate.checkDate(data, old_data, due_date, 'due_date');

            onSubmit(data);
            return;
        }

        // if (idx === 4) {
        // 	const {
        // 		document_list,
        // 		document_proof_list,
        // 	} = form.data;

        // 	const data = {};
        // 	ShouldUpdate.checkFileList(data, old_data, document_list, 'document_list');
        // 	ShouldUpdate.checkFileList(data, old_data, document_proof_list, 'document_proof_list');

        // 	onSubmit(data);
        // 	return;
        // }

        if (idx === 5) {
            const {
                comments, remarks,
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, comments, 'comments');
            ShouldUpdate.check(data, old_data, remarks, 'remarks');

            onSubmit(data);
            return;
        }

        if (idx === 6) {
            const {
                progress_list,
            } = form.data;

            const data = {};
            if (progress_list) {
                const __progress_list = progress_list.slice().map(({date, ...others}) => ({
                    ...others,
                    date: Dates.formatTimestampSQL(date),
                }));
                ShouldUpdate.checkListToJS(data, old_data, __progress_list, 'progress_list');
            }

            onSubmit(data);
            return;
        }

        if (idx === 7) {
            const {
                status_acceptance, status_progress, result, completed_date, additional_notes
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, status_acceptance, 'status_acceptance');
            ShouldUpdate.check(data, old_data, status_progress, 'status_progress');
            ShouldUpdate.check(data, old_data, result, 'result');
            ShouldUpdate.checkDate(data, old_data, completed_date, 'completed_date');
            ShouldUpdate.check(data, old_data, additional_notes, 'additional_notes');

            onSubmit(data);
            return;
        }

        return true;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

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
                    type,
                    priority,
                    allocation,
                    source,
                    //2
                    desc, process,
                    //3
                    due_date,
                    responsible_party_list,
                    assigned_job_position_list,
                    assigned_person_list,
                    assigned_user_list,
                    approving_person_list,
                    //4
                    document_list, document_proof_list,
                    //5
                    comments, remarks,
                    //6
                    progress_list,
                    //7
                    status_acceptance, status_progress, result, completed_date, additional_notes
                }
            }
        } = this;

        const {isConsultant} = storage.is;

        console.log('item', item)

        return (<FormControls>
            <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
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
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="type" type="select" placeholder="Type..." defaultValue={type}
                                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.type} returnValue/>
                <ClearableInput name="priority" type="select" placeholder="Priority..." defaultValue={priority}
                                className="col-lg-6 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.priority} returnValue/>
                <ClearableInput name="allocation" type="select" placeholder="Allocation..." defaultValue={allocation}
                                className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.allocation} returnValue/>

                <hr className="pull-left margin-0 margin-t-0 margin-b-15"/>

                <ClearableInput name="source" type="select" placeholder="Source..." defaultValue={this.defaultSource}
                                required className="col-lg-6 pull-left-3 form-control margin-b-10"
                                onChange={this.form.onChange} values={this.state.lists.source}/>
                <SourceBtnWrapper ref="sourceBtn" onClick={this.onSelectSource} onSelectSite={this.onSelectSite}/>
                <SelectSourceTable ref="selectSourceTable" onSelectSourceItem={this.onSelectSourceItem}
                                   onChange={this.form.onChange}/>
                <SelectSourceItemTable ref="selectSourceListTable" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Finding / NCR Description & Process"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
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
                title="3. Due Date & Persons Responsible"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="due_date" type="date" defaultValue={due_date} placeholder="Due Date..." required
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <NewNCRResponsiblePartyListTable
                    name="responsible_party_list"
                    defaultValue={responsible_party_list ? [...responsible_party_list, null] : [null]}
                    title="Responsible Parties"
                    savable
                    targetItem={{key: "ncr_id", item}}
                    insertFn={insertProxyNCRResponsibleParty}
                    deleteFn={deleteProxyNCRResponsibleParty}
                    onAttrs={onNCRResponsiblePartyAttrs}
                    onChange={this.form.onChange}
                    className="w-full-calc-add-10 -margin-l-10"
                />

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <NewJobPositionListTable
                    name="assigned_job_position_list"
                    defaultValue={assigned_job_position_list ? [...assigned_job_position_list, null] : [null]}
                    title="Responsible Job Positions"
                    savable
                    targetItem={{key: "ncr_id", item}}
                    insertFn={insertProxyNCRAssignedJobPosition}
                    deleteFn={deleteProxyNCRAssignedJobPosition}
                    onAttrs={onAssignedJobPositionAttrs}
                    onChange={this.form.onChange}
                    className="w-full-calc-add-10 -margin-l-10"
                />

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                {/* <NewEmployeeListTable
					name="assigned_person_list"
				    className="w-full-calc-add-10 -margin-l-10"
					defaultValue={[...(assigned_person_list || []).map(({
						id,
						employee,
						employee_other
					}) => employee || employee_other), null]}
				    onChange={this.form.onChange}
					showOtherPerson
				/> */}
                <NewEmployeeListTable
                    name="assigned_person_list"
                    defaultValue={assigned_person_list ? [...assigned_person_list, null] : [null]}
                    title="Responsible Persons"
                    savable
                    targetItem={{key: "ncr_id", item}}
                    insertFn={insertProxyNCRAssignedPerson}
                    deleteFn={deleteProxyNCRAssignedPerson}
                    onAttrs={onAssignedEmployeeAttrs}
                    onChange={this.form.onChange}
                    className="w-full-calc-add-10 -margin-l-10"
                    showOtherPerson
                />

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <NewUserListTable
                    name="assigned_user_list"
                    defaultValue={assigned_user_list ? [...assigned_user_list, null] : [null]}
                    title="Responsible Users"
                    savable
                    targetItem={{key: "ncr_id", item}}
                    insertFn={insertProxyNCRAssignedUser}
                    deleteFn={deleteProxyNCRAssignedUser}
                    onAttrs={onAssignedUserAttrs}
                    onChange={this.form.onChange}
                    className="w-full-calc-add-10 -margin-l-10"
                />

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <NewEmployeeListTable
                    name="approving_person_list"
                    defaultValue={approving_person_list ? [...approving_person_list, null] : [null]}
                    title="Approving Persons"
                    savable
                    targetItem={{key: "ncr_id", item}}
                    insertFn={insertProxyNCRApprovingPerson}
                    deleteFn={deleteProxyNCRApprovingPerson}
                    onAttrs={onApprovingEmployeeAttrs}
                    onChange={this.form.onChange}
                    className="w-full-calc-add-10 -margin-l-10"
                    disableOtherPerson
                />
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Document(s) / Media"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        active
                        idx={4.1}
                        title="4.1. Document(s)"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewDocumentTable
                            ref="document_list"
                            name="document_list"
                            title="Documents/Photos"
                            defaultValue={[...(document_list || []), null]}
                            type="Document Incident"
                            savable
                            targetItem={{key: "non_conformance_id", item}}
                            insertFn={insertProxyNCRDocument}
                            deleteFn={deleteProxyNCRDocument}
                            onAttrs={onNCRDocumentAttrs}
                        />
                    </Row>
                    <Row
                        rendered
                        idx={4.2}
                        title="4.2. Document(s) (Proof of Correction)"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewDocumentTable
                            ref="document_proof_list"
                            name="document_proof_list"
                            title="Documents/Photos"
                            defaultValue={[...(document_proof_list || []), null]}
                            type="Document Proof"
                            savable
                            targetItem={{key: "non_conformance_id", item}}
                            insertFn={insertProxyNCRDocument}
                            deleteFn={deleteProxyNCRDocument}
                            onAttrs={onNCRDocumentAttrs}
                        />
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Comments & Remarks"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
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
                title="6. Progress"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <NewNCRProgressListTable
                    ref="progress_list"
                    name="progress_list"
                    defaultValue={[...(progress_list || []), null]}
                    savable
                    targetItem={{key: "non_conformance_id", item}}
                    insertFn={insertNCRProgress}
                    updateFn={updateNCRProgress}
                    deleteFn={deleteNCRProgress}
                    onAttrs={onNCRProgressAttrs}
                />
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Status / Result / Closed Out"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <ClearableInput ref="status_acceptance" name="status_acceptance" type="radio"
                                placeholder="Acceptance Status" defaultValue={status_acceptance}
                                vertical={2}
                                className="col-lg-6 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status_acceptance} returnValue/>
                <ClearableInput ref="status_progress" name="status_progress" type="radio"
                                placeholder="Progress Status" defaultValue={status_progress}
                                vertical={2}
                                className="col-lg-6 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status_progress} returnValue/>
                <ClearableInput ref="result" name="result" type="radio" placeholder="Result" defaultValue={result}
                                className="col-lg-6 form-control" onChange={this.form.onChange}
                                values={this.state.lists.result} returnValue/>
                <ClearableInput name="completed_date" type="date" placeholder="Completed Date..."
                                defaultValue={completed_date} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ClearableInput ref="additional_notes" name="additional_notes" type="textarea"
                                placeholder="Additional Notes" defaultValue={additional_notes}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

function onNCRDocumentAttrs({doc, type}) {
    return {
        doc, type
    };
}

function onNCRResponsiblePartyAttrs({value}) {
    return {
        value,
    };
}

function onAssignedJobPositionAttrs({job_position}) {
    return {
        job_position_id: job_position && job_position.id,
    };
}

function onAssignedUserAttrs({user}) {
    return {
        user_id: user && user.id,
    };
}

function onAssignedEmployeeAttrs({employee, employee_other}) {
    if (employee_other && !employee_other.id) {
        const {job_position} = employee_other;
        if (job_position) {
            employee_other.job_position_id = job_position.id;
            delete employee_other.job_position;
        }
    }

    return {
        employee_id: employee && employee.id,
        employee_other_id: employee_other && employee_other.id ? employee_other.id : null,
        employee_other: employee_other && !employee_other.id ? {data: employee_other} : null
    };
}

function onApprovingEmployeeAttrs({employee}) {
    return {
        employee_id: employee && employee.id,
    };
}

function onNCRProgressAttrs({outstanding, notes, date}) {
    return {
        outstanding, notes, date: Dates.formatDateSQL(date),
    };
}

export default EditDialog;
