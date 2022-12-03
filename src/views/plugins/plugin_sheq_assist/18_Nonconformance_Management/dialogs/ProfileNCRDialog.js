// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {TRow} from '../../../../../components/tables';
import {ActionsButton, AddFilesGridViewInput, Button, Clickable, ProfileField} from '../../../../../components/inputs';
import {FormControls, NavButtons, Row} from '../../../../../components/FormComponents';

import {AuditTableRow, InspectionTableRow} from '../../21_Internal_Audit/dialogs/InternalAuditComponents';
import {IncidentTableRow} from '../../17_Incident_Investigation/dialogs/IncidentComponents';

import ProfileSiteDialog from '../../../plugin_general/Sites/ProfileDialog.js';
import ProfileAuditDialog from '../../21_Internal_Audit/dialogs/ProfileAuditDialog.js';
import ProfileIncidentDialog from '../../17_Incident_Investigation/dialogs/ProfileIncidentDialog.js';

import style from "./ProfileNCRDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileNCRDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    title() {
        return "NCR Profile";
    }

    get controls() {
        return Controls;
    }

    onApprove(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        confirmDialog.open("Are you sure you want to approve the non-comformance?").then(res => {
            if (res === 1) {
                progressDialog.open("Approving the non-comformance...");
                neonBinding.events.emit(this.path + "add-status", item.id, "ApprovedIncident").then(res => {
                    progressDialog.close();
                    console.log("res", res)
//                    if(!item.data.status) {
//                        setTimeout(() => {
//                            extendObservable(item.data, {status: ['ApprovedIncident']});
//                        });
//                    }
                    infoDialog.open("Non-Comformance successfully approved.");
                    infoDialog.close(2000);
                });
            }
        })
    }

    onReject(e, el) {

    }

    onProgress(e, el) {

    }

    onComplete(e, el) {

    }

    @computed get topButtons() {
        if (!this.state.item) return null;
        const {
            id, data: {
                created_at,
                source, selected_source_id, selected_source_item,
                desc,
                due_date, responsible_person, approving_person,
                document_list,
                comments,
                remarks
            }
        } = this.state.item;
        const {id: user_uid} = storage.loggedUser.user;
        const isResponsible = () => {
            return true;//responsible_person && user_uid === responsible_person.id;
        };
        const isApproving = () => {
            return approving_person && user_uid === approving_person.id;
        };

        return <React.Fragment>
            {isResponsible() && <React.Fragment>
                <Button className="btn btn-primary" onClick={this.onProgress}>
                    <i className="fa fa-check icon-left"/>Progress
                </Button>
                <Button className="btn btn-primary" onClick={this.onComplete}>
                    <i className="fa fa-check icon-left"/>Complete
                </Button>
                <hr/>
            </React.Fragment>}
            {isApproving() && <React.Fragment>
                <Button className="btn btn-primary" onClick={this.onApprove}>
                    <i className="fa fa-check icon-left"/>Approve
                </Button>
                <Button className="btn btn-primary" onClick={this.onReject}>
                    <i className="fa fa-check icon-left"/>Reject
                </Button>
                <hr/>
            </React.Fragment>}
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
        </React.Fragment>;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {}
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onView = this.onView.bind(this);
    }

    // </editor-fold>

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

        return <FormControls>
            <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField name="client" value={client} renderer={v => v.name || v.data.name}
                                               placeholder="Company" className="col-lg-12"/>}
                <ProfileField name="project" value={project} renderer={v => v.name || v.data.name} placeholder="Project"
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
                <ProfileField name="desc" placeholder="Finding / NCR Description" value={desc} className="col-lg-12"/>
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
                idx={6}
                title="6. Item Progress / Closed Out"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ProfileField name="status" type="radio" placeholder="Status" defaultValue={status}
                              className="col-lg-12"/>
                <ProfileField name="result" type="radio" placeholder="Result" defaultValue={result}
                              className="col-lg-12"/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ProfileField name="progress_date" type="date" placeholder="Progress Date" defaultValue={progress_date}
                              className="col-lg-12"/>
                <ProfileField name="completed_date" type="date" placeholder="Completed Date"
                              defaultValue={completed_date} className="col-lg-12"/>

                <hr className="pull-left margin-0 margin-t-5 margin-b-10"/>

                <ProfileField name="outstanding" placeholder="Outstanding" defaultValue={outstanding}
                              className="col-lg-12"/>
                <ProfileField name="additional_notes" placeholder="Additional Notes" defaultValue={additional_notes}
                              className="col-lg-12"/>
            </Row>

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
