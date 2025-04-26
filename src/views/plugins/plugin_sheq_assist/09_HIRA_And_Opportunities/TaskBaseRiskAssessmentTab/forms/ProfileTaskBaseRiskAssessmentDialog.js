//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Button, ProfileField,} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog, ViewReportPDFDialog} from 'components/dialogs';

import RiskAssessmentItemTaskBasedTable from './RiskAssessmentItemTaskBasedTable';

import style from "./ProfileTaskBaseRiskAssessmentDialog.lazy.css";
import {computed, observable} from "mobx";

import {findByIdTaskbasedRA} from "mutations/findById";
import {CircularProgress} from "@mui/material";
import {updateTaskbasedRA} from "mutations/update";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class ProfileTaskBaseRiskAssessmentDialog extends AProfileDialog {
    pageKey = "ProfileTaskBaseRiskAssessmentDialog";
    className = 'ANewTableFormDialog';
    findById = findByIdTaskbasedRA;
    removeById = updateTaskbasedRA;

    constructor(props) {
        super(props, style);

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
    }

    get topButtons() {
        return <React.Fragment>
            <Button className="btn btn-primary save" onClick={this.onSaveAsPDF}>
                <i className="fa fa-file-pdf-o icon-left"/> Save As PDF
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Task Base Risk Assessment";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    //<editor-fold desc="fields">
    @observable
    state = {};

    //</editor-fold>

    constructor() {
        super();

        this.onFormChange = this.onFormChange.bind(this);

        this.printImpl = this.printImpl.bind(this);
    }

    @computed get item() {
        return this.props.state.item;
    }

    printImpl() {
        return workers.emit(this.path + "create/pdf", this.item.id);
    }

    onSaveAsPDF(e, btn) {
        btn.text("Saving As PDF...").disabled();
        this.printImpl().then(res => {
            this.refs.viewReportPDFDialog.open(res);
            infoDialog.open("Record successfully saved as PDF.");
            infoDialog.close(2000);
        }).finally(() => {
            btn.text("Save As PDF").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const {dialog} = this.props;
        dialog.cssWidth = idx === 3 ? '100%' : '800px';
        return true;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {
                onFormNext, onFormBack, onFormOpen, onFormChange,
            },
            item, item: {
                id, data: {
                    created_at,
                    //0
                    client,
                    project,
                    site,
                    //1
                    activity,
                    expiry_date,
                    risk_tolerance,
                    //2
                    list,
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
            >
                {isConsultant && <ProfileField
                    name="client"
                    title="Company"
                    value={client}
                    renderer={val => val.name}
                    className="col-lg-12"
                />}
                <ProfileField
                    name="project"
                    title="Project"
                    value={project}
                    renderer={val => val.name}
                    className="col-lg-12"
                />
                <ProfileField
                    name="site"
                    title="Site"
                    value={site}
                    renderer={val => val.name}
                    className="col-lg-12"
                />
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Basic Details"
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormChange={onFormChange}
            >
                <ProfileField name="activity" type="text" placeholder="Description Of Task" value={activity}
                              className="col-lg-12"/>
                <ProfileField name="expiry_date" type="date" placeholder="Revision Date" value={expiry_date}
                              className="col-lg-12"/>
                <ProfileField name="risk_tolerance" type="text" placeholder="Risk Tolerance" value={risk_tolerance}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Assessed Items"
                sectionClassName="overflow-auto"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormChange={onFormChange}
            >
                <RiskAssessmentItemTaskBasedTable name="list" readonly defaultValue={list}/>
            </Row>
            <ViewReportPDFDialog ref="viewReportPDFDialog" fileName="Risk_Assessment_Task-Based_Report"
                                 title={"Task Base Risk Assessment (" + activity + ")"}/>
        </FormControls>;
    }

    //</editor-fold>
}

export default ProfileTaskBaseRiskAssessmentDialog;
