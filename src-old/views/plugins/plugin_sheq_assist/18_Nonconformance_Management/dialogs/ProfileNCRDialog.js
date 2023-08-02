// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable} from 'mobx';

import {AProfileDialog} from '../../../../../components/dialogs';
import {TRow} from '../../../../../components/tables';
import {
    ActionsButton,
    AddFilesGridViewInput,
    Button,
    ClearableInput,
    ProfileField
} from '../../../../../components/inputs';
import {FormControls, NavButtons, Row} from '../../../../../components/FormComponents';

import {AuditTableRow, InspectionTableRow} from '../../21_Internal_Audit/dialogs/InternalAuditComponents';
import {IncidentTableRow} from '../../17_Incident_Investigation/dialogs/IncidentComponents';

import ProfileSiteDialog from '../../../plugin_general/Sites/ProfileDialog.js';
import ProfileAuditDialog from '../../21_Internal_Audit/dialogs/ProfileAuditDialog.js';
import ProfileIncidentDialog from '../../17_Incident_Investigation/dialogs/ProfileIncidentDialog.js';

import style from "./ProfileNCRDialog.lazy.css";
import NewNCRProgressListTable from "../../../../../components/FormTableComponents/NewNCRProgressListTable";
import {execWhen, ShouldUpdate} from "../../../../../utils/Utils";
import Form from "../../../../../utils/Form";
import EditNCRDialog from "./EditNCRDialog";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog, DialogTitle, DialogTopButtons">
// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    path = "plugin_sheq_assist/ncr/";
    pageKey = "ProfileNCRDialog";
    className = 'ANewTableFormDialog';

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props, style);

        this.onApprove = this.onApprove.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }

    //</editor-fold>

    //<editor-fold desc="title">
    get title() {
        const {controls} = this.refs;
        if (!controls) {
            return execWhen(() => this.refs.controls).then(controls => {
                const {state} = controls;
                return <DialogTitle state={state}/>;
            });
        } else {
            const {state} = controls;
            return <DialogTitle state={state}/>;
        }
    }

    //</editor-fold>

    //<editor-fold desc="controls">
    get controls() {
        return Controls;
    }

    //</editor-fold>

    //<editor-fold desc="onEdit">
    onEdit(evt, btn) {
        const {editDialog} = this.refs.controls.refs;
        editDialog && editDialog.open(this.state.item);
    }

    //</editor-fold>

    //<editor-fold desc="onApprove">
    onApprove(e, el) {
        const {item} = this.state;
        confirmDialog.open("Are you sure you want to approve the non-conformance?").then(res => {
            if (res === 1) {
                progressDialog.open("Approving the non-conformance...");
                neonBinding.events.emit(this.path + "update/approve", item.id).then(res => {
                    progressDialog.close();
                    console.log("res", res)
                    setTimeout(() => {
                        extendObservable(item.data, {status_acceptance: 'Approved'});
                    });
                    infoDialog.open("Non-Conformance successfully approved.");
                    infoDialog.close(2000);
                });
            }
        })
    }

    //</editor-fold>

    //<editor-fold desc="onReject">
    onReject(e, el) {
        const {item} = this.state;
        confirmDialog.open("Are you sure you want to reject the non-conformance?").then(res => {
            if (res === 1) {
                progressDialog.open("Rejecting the non-conformance...");
                neonBinding.events.emit(this.path + "update/reject", item.id).then(res => {
                    progressDialog.close();
                    console.log("res", res)
                    setTimeout(() => {
                        extendObservable(item.data, {status_acceptance: 'Rejected'});
                    });
                    infoDialog.open("Non-Conformance successfully rejected.");
                    infoDialog.close(2000);
                });
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="onProgress">
    onProgress(e, el) {
        const {item} = this.state;
        confirmDialog.open("Are you sure you want to progress the non-conformance?").then(res => {
            if (res === 1) {
                this.refs.controls.state.view = "Progress";
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="onComplete">
    onComplete(e, el) {
        const {item} = this.state;
        confirmDialog.open("Are you sure you want to close the non-conformance?").then(res => {
            if (res === 1) {
                this.refs.controls.state.view = "Complete";
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="topButtons">
    get topButtons() {
        const {controls} = this.refs;
        const onRender = controls => {
            return <DialogTopButtons
                state={controls.state}
                mainState={this.state}
                onProgress={this.onProgress}
                onComplete={this.onComplete}
                onApprove={this.onApprove}
                onReject={this.onReject}
                onEdit={this.onEdit}
                onCancel={this.onCancel}
            />;
        };
        if (controls) {
            return onRender(controls);
        } else {
            return execWhen(() => this.refs.controls).then(onRender);
        }
    }

    //</editor-fold>
}

// </editor-fold>

//<editor-fold desc="DialogTitle">
const DialogTitle = observer(({state}) => {
    const {view} = state;
    let t = "NCR Profile";
    if (view !== 'Profile') {
        t += view ? ` (${view})` : "";
    }
    return t;
});
//</editor-fold>

//<editor-fold desc="DialogTopButtons">
const DialogTopButtons = observer(({
                                       state,
                                       mainState,
                                       onProgress,
                                       onComplete,
                                       onApprove,
                                       onReject,
                                       onEdit,
                                       onCancel
                                   }) => {
    const {item} = mainState;
    if (!item) return null;

    const {
        id, data: {
            created_at,
            source, selected_source_id, selected_source_item,
            desc,
            due_date, responsible_person, approving_person,
            document_list,
            comments,
            remarks,
            status,
            status_acceptance
        }
    } = item;

    const {view} = state;

    const {id: user_uid} = storage.loggedUser.user;
    const isResponsible = () => {
        return true;//responsible_person && user_uid === responsible_person.id;
    };
    const isApproving = () => {
        return approving_person && user_uid === approving_person.id;
    };

    return <React.Fragment>
        {isResponsible() && <React.Fragment>
            {status !== 'Progressed' && status !== 'Completed' && view !== "Progress" &&
                <Button className="btn btn-primary" onClick={onProgress}>
                    <i className="fa fa-check icon-left"/>Progress
                </Button>}
            {status !== 'Completed' && view !== "Complete" &&
                <Button className="btn btn-primary" onClick={onComplete}>
                    <i className="fa fa-check icon-left"/>Complete
                </Button>}
            {status !== 'Progressed' && status !== 'Completed' &&
                view !== "Progress" && view !== "Complete" && <hr/>}
        </React.Fragment>}
        {isApproving() && <React.Fragment>
            {status_acceptance !== 'Approved' && <Button className="btn btn-primary" onClick={onApprove}>
                <i className="fa fa-check icon-left"/>Approve
            </Button>}
            {status_acceptance !== 'Rejected' && <Button className="btn btn-primary" onClick={onReject}>
                <i className="fa fa-check icon-left"/>Reject
            </Button>}
            {status_acceptance !== 'Approved' && status_acceptance !== 'Rejected' && <hr/>}
        </React.Fragment>}
        {onEdit && <Button className="btn btn-primary" onClick={onEdit}>
            <i className="fa fa-pen icon-left"/>Edit
        </Button>}
        <hr/>
        <Button className="btn btn-primary cancel" onClick={onCancel}>Cancel</Button>
    </React.Fragment>;
});
//</editor-fold>
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/ncr/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            status: ['Pending', 'Progressed', 'Completed'].map(text => {
                return {text, value: text, checked: false}
            }),
            status_acceptance: ['Pending', 'Approved', 'Rejected'].map(text => {
                return {text, value: text, checked: false}
            }),
            result: ['Pass', 'Fail'].map(text => {
                return {text, value: text, checked: false}
            }),
        },
        view: 'Profile',
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onView = this.onView.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        execWhen(() => this.props.dialog && this.props.dialog.extraProp('view')).then(view => {
            this.state.view = view || "Profile";
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onView">
    onView(evt, btn) {
        const {source, selected_source} = this.selfState;

        let name;
        if (source === "Site Audit") {
            name = "profileSiteDialog";
        } else if (source === "Compliance Audit") {
            name = "profileAuditDialog";
        } else if (source === "Inspection") {
//            name = "";
        } else if (source === "Incident Investigation") {
            name = "profileIncidentDialog";
        }

        const profileDialog = this.refs[name];
        profileDialog && profileDialog.open(selected_source);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(val, name, el) {
        const {form, item: {data: old_data}, viewProfile, viewProgress, viewComplete,} = this;

        if (viewProgress) {
            const {
                //6
                progress_list,
            } = form.data;
            const data = {};

            //6
            if (progress_list) {
                const __progress_list = progress_list.slice().map(({progress_date, ...others}) => ({
                    ...others,
                    progress_date: progress_date.getTime(),
                }));
                ShouldUpdate.checkListToJS(data, old_data, __progress_list, 'progress_list');
            }

            console.log(data)

            progressDialog.open("Progressing the non-conformance...");
            neonBinding.events.emit(this.path + "update/progress", this.item.id, data).then(res => {
                console.log("res", res)
                if (!res) {
                    infoDialog.open("An error occurred. Please try again.");
                } else {
                    const data_updated = {...data, status: 'Progressed'};
                    // onSaved && onSaved(data_updated);

                    extendObservable(this.item.data, data_updated);
                    infoDialog.open("Non-Conformance successfully progressed.");
                    infoDialog.close(2000);
                    this.props.close();
                }
            }).finally(() => {
                progressDialog.close();
            });
        } else if (viewComplete) {
            const {
                //7
                status_acceptance, status, result, completed_date, additional_notes
            } = form.data;
            const data = {};

            //7
            ShouldUpdate.check(data, old_data, status_acceptance, 'status_acceptance');
            // ShouldUpdate.check(data, old_data, status, 'status');
            ShouldUpdate.check(data, old_data, result, 'result');
            ShouldUpdate.checkDate(data, old_data, completed_date, 'completed_date');
            ShouldUpdate.check(data, old_data, additional_notes, 'additional_notes');

            console.log(data)

            progressDialog.open("Closing the non-conformance...");
            neonBinding.events.emit(this.path + "update/complete", this.item.id, data).then(res => {
                console.log("res", res)
                if (!res) {
                    infoDialog.open("An error occurred. Please try again.");
                } else {
                    const data_updated = {...data, status: 'Completed'};
                    // onSaved && onSaved(data_updated);

                    extendObservable(this.item.data, data_updated);
                    infoDialog.open("Non-Conformance successfully closed.");
                    infoDialog.close(2000);
                    this.props.close();
                }
            }).finally(() => {
                progressDialog.close();
            });
        }
    }

    // </editor-fold>

    //<editor-fold desc="viewProfile">
    @computed get viewProfile() {
        const {view} = this.state;
        return !view || view === "Profile";
    }

    //</editor-fold>

    //<editor-fold desc="viewProgress">
    @computed get viewProgress() {
        const {view} = this.state;
        return view === "Progress";
    }

    //</editor-fold>

    //<editor-fold desc="viewComplete">
    @computed get viewComplete() {
        const {view} = this.state;
        return view === "Complete";
    }

    //</editor-fold>

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
                    progress_list,
                    //7
                    status_acceptance, status, result, completed_date, additional_notes
                }
            },
            viewProfile, viewProgress, viewComplete,
        } = this;

        const {isConsultant} = storage.is;

        return <FormControls>
            <Row
                rendered
                active={viewProfile || (!viewProgress && !viewComplete)}
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField name="client" value={client} renderer={v => v.name || v.data.name}
                                               placeholder="Company" className="col-lg-12"/>}
                <ProfileField name="project" value={project} renderer={v => v.name || v.data.name}
                              placeholder="Project"
                              className="col-lg-6"/>
                <ProfileField name="site" value={site} renderer={v => v.name || v.data.name} placeholder="Site"
                              className="col-lg-6"/>
            </Row>
            <Row
                rendered
                idx={1}
                title="1. Non-Conformance Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="type" placeholder="Type" value={type} className="col-lg-12"/>
                <ProfileField name="priority" placeholder="Priority" value={priority} className="col-lg-12"/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ProfileField name="source" placeholder="Source" value={source} className="col-lg-12"/>
                <TitlePanel source={source} selected_source={selected_source_ref} onView={this.onView}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Finding / NCR Description & Process"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="desc" placeholder="Finding / NCR Description" value={desc}
                              className="col-lg-12"/>
                <ProfileField name="process" placeholder="Process" value={process} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Due Date & Persons Assigned"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="due_date" type="date" placeholder="Due Date" value={due_date}
                              className="col-lg-12"/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ProfileField name="responsible_person" placeholder="Responsible Person" value={responsible_person}
                              renderer={v => v.lname + ' ' + v.fname} className="col-lg-12"/>
                <ProfileField name="approving_person" placeholder="Approving Person" value={approving_person}
                              renderer={v => v.lname + ' ' + v.fname} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Document(s) / Media"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <AddFilesGridViewInput name="document_list" defaultValue={document_list} readonly/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Comments & Remarks"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="comments" placeholder="Comments" value={comments} className="col-lg-12"/>
                <ProfileField name="remarks" placeholder="Remarks" value={remarks} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                active={viewProgress}
                idx={6}
                title="6. Progress"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                {viewProgress && <NewNCRProgressListTable ref="progress_list" name="progress_list"
                                                          defaultValue={[...(progress_list || []), null]}
                                                          onChange={this.onSubmit} preventInitialChange/>}
                {!viewProgress &&
                    <NewNCRProgressListTable ref="progress_list" name="progress_list" defaultValue={progress_list || []}
                                             readonly/>}
            </Row>
            <Row
                rendered
                active={viewComplete}
                idx={7}
                title="7. Status / Result / Closed Out"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                {viewComplete && <>
                    <ClearableInput ref="status_acceptance" name="status_acceptance" type="radio"
                                    placeholder="Acceptance Status" defaultValue={status_acceptance}
                                    vertical={2}
                                    className="col-lg-6 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.status_acceptance} returnValue/>
                    <ClearableInput ref="status" name="status" type="radio"
                                    placeholder="Status" defaultValue={"Completed"}
                                    vertical={2}
                                    className="col-lg-6 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.status} returnValue readonly/>
                    <ClearableInput ref="result" name="result" type="radio" placeholder="Result" defaultValue={result}
                                    className="col-lg-6 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.result} returnValue/>
                    <ClearableInput name="completed_date" type="date" placeholder="Completed Date..."
                                    defaultValue={completed_date || new Date()} className="col-lg-6 form-control"
                                    onChange={this.form.onChange}/>

                    <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                    <ClearableInput ref="additional_notes" name="additional_notes" type="textarea"
                                    placeholder="Additional Notes" defaultValue={additional_notes}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                    <Button className="btn btn-primary hor-center w-120 border-radius-20 margin-0"
                            onClick={this.onSubmit}>
                        <i className="fa fa-check"/> Submit
                    </Button>
                </>}
                {!viewComplete && <>
                    <ProfileField name="status_acceptance" type="radio" placeholder="Acceptance Status"
                                  defaultValue={status_acceptance}
                                  className="col-lg-12"/>
                    <ProfileField name="status" type="radio" placeholder="Status" defaultValue={status}
                                  className="col-lg-12"/>
                    <ProfileField name="result" type="radio" placeholder="Result" defaultValue={result}
                                  className="col-lg-12"/>

                    <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                    <ProfileField name="completed_date" type="date" placeholder="Completed Date"
                                  defaultValue={completed_date} className="col-lg-12"/>

                    <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                    <ProfileField name="additional_notes" placeholder="Additional Notes" defaultValue={additional_notes}
                                  className="col-lg-12"/>
                </>}
            </Row>

            <EditNCRDialog ref="editDialog"/>

            <ProfileSiteDialog ref="profileSiteDialog"/>
            <ProfileAuditDialog ref="profileAuditDialog"/>
            <ProfileIncidentDialog ref="profileIncidentDialog"/>
        </FormControls>;
    }

    // </editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="TitlePanel">
@observer
class TitlePanel extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onRenderActionCell = this.onRenderActionCell.bind(this);
    }

    // </editor-fold>

    onRenderActionCell(selected_source, idx) {
        const {onView} = this.props;
        return <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
            <ActionsButton className="btn btn-primary pull-right min-w-40" icon="eye" onClick={onView}/>
        </div>;
    }

    get renderSite() {
        const {selected_source} = this.props;
        if (!selected_source) return null;
        const {id, data: {name, address, client, project}} = selected_source;
        return <div className="SiteTableRow">
            <TRow>
                {RenderUtils.renderOrgTD(client, null, 'Company Name')}
                {RenderUtils.renderOrgTD(project, null, 'Project Name')}
                <div className="td">
                    <h6 className="xs-shown font-size-13">Site Name</h6>
                    {name}
                </div>
                {this.onRenderActionCell(selected_source)}
            </TRow>
        </div>;
    }

    get renderAudit() {
        const {selected_source} = this.props;
        if (!selected_source) return null;
        return <div className="AuditTableRow">
            <AuditTableRow item={selected_source} onRenderActionCell={this.onRenderActionCell}/>
        </div>;
    }

    get renderInspection() {
        const {selected_source} = this.props;
        if (!selected_source) return null;
        return <div className="InspectionTableRow">
            <InspectionTableRow item={selected_source} onRenderActionCell={this.onRenderActionCell}/>
        </div>;
    }

    get renderIncident() {
        const {selected_source} = this.props;
        if (!selected_source) return null;
        return <div className="IncidentTableRow">
            <IncidentTableRow item={selected_source} onRenderActionCell={this.onRenderActionCell}/>
        </div>;
    }

    render() {
        const {source, selected_source} = this.props;
        if (!source) return null;
        if (!selected_source) return null;
        return <div className="TitlePanel">
            <hr className="w-full margin-0 margin-t-5"/>
            {source === "Site Audit" && this.renderSite}
            {source === "Compliance Audit" && this.renderAudit}
            {source === "Inspection" && this.renderInspection}
            {source === "Incident Investigation" && this.renderIncident}
        </div>;
    }
}

// </editor-fold>

export default ProfileDialog;
