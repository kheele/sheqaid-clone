//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {CircularProgress} from "@mui/material";

import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';

import {
    NewCloseDownListTable,
    NewCustomSafetyPreRequesiteListTable,
    NewKeyPointListTable,
    NewOperationListTable,
    NewProcedureListTable,
    NewRiskListTable,
    NewSafetyPreRequesiteListTable,
} from './SOPComponents';
import {FormControls, Row} from "components/FormComponents";

import {findByIdSOP} from "mutations/findById";
import {updateSOP} from "mutations/update";

import style from "./ProfileSOPDialog.lazy.css";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileSOPDialog";
    findById = findByIdSOP;
    removeById = updateSOP;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Safety Operating Procedure";
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    //<editor-fold desc="fields">
    @observable
    state = {};

    //</editor-fold>

    constructor(props) {
        super(props);
    }

    @computed get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {dialog: {renderProfileCover}},
            item, item: {
                id, data: {
                    created_at,
                    //0
                    client,
                    project,
                    site,
                    //1
                    category,
                    risk_level,
                    location,
                    prepared_by,
                    date_created,
                    date_revised,
                    //2
                    doc,
                    //3
                    risk_list,
                    //4
                    close_down_list,
                    //5
                    safety_pre_requesite_list,
                    //6
                    custom_safety_pre_requesite_list,
                    //7
                    procedure_list,
                    key_point_list,
                    operation_list,
                    //8
                    other,
                }
            }
        } = this;

        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant, isNoProjects} = storage.is;

        console.log(this.item)

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
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
            >
                <ProfileField name="category" type="radio" placeholder="Category" value={category}
                              className="col-lg-12"/>
                <ProfileField name="risk_level" type="radio" placeholder="Risk Level" value={risk_level}
                              className="col-lg-12"/>
                <ProfileField name="location" type="select" placeholder="Risk Task Location" value={location}
                              className="col-lg-12"/>

                <ProfileField name="prepared_by" type="select" placeholder="Prepared By" value={prepared_by}
                              renderer={v => v.full_name} className="col-lg-12"/>
                <ProfileField name="date_created" type="date" placeholder="Date Created" value={date_created}
                              className="col-lg-12"/>
                <ProfileField name="date_revised" type="date" placeholder="Date Revised" value={date_revised}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Reference Document"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Reference Document (PDF/Word/Image)"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    defaultValue={doc}
                    className="col-lg-12"
                    readonly
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Risks Associated With The Equipment / Procedure"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewRiskListTable name="risk_list" defaultValue={risk_list || []} readonly/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Close Down"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewCloseDownListTable name="close_down_list" defaultValue={close_down_list || []}
                                       readonly/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Safety Pre-requisites"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewSafetyPreRequesiteListTable name="safety_pre_requesite_list"
                                                defaultValue={safety_pre_requesite_list || []}
                                                readonly/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Custom Safety Pre-requisites"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewCustomSafetyPreRequesiteListTable name="custom_safety_pre_requesite_list"
                                                      defaultValue={custom_safety_pre_requesite_list || []}
                                                      readonly/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Procedures"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        activeAlways
                        idx={7.1}
                        title="7.1. Pre-start Check"
                    >
                        <NewProcedureListTable name="procedure_list" defaultValue={procedure_list || []} readonly/>
                    </Row>
                    <Row
                        rendered
                        activeAlways
                        idx={7.2}
                        title="7.2. Key Points"
                    >
                        <NewKeyPointListTable name="key_point_list" defaultValue={key_point_list || []} readonly/>
                    </Row>
                    <Row
                        rendered
                        activeAlways
                        idx={7.3}
                        title="7.3. Operations"
                    >
                        <NewOperationListTable name="operation_list" defaultValue={operation_list || []} readonly/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. OTHER - Add exit text into the block below if required. You can/paste from a text document."
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ProfileField name="other" type="textarea" value={other} className="col-lg-12"/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>

}

export default ProfileDialog;
