// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {Dates} from '../../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../../components/dialogs';
import {ClearableInput, ProfileField, ProfilePic, RowOrgs, SelectGenderInput, UploadButton} from '../../../../../../components/inputs';
import {
    NewDepartmentListTable,
    NewJobPositionListTable,
    NewTeamListTable
} from '../../../../../../components/FormTableComponents';
import {FormControls, Row} from '../../../../../../components/FormComponents';

import style from "./ProfilePPEDialog.lazy.css";
import findByIdPPE from "../../../../../../mutations/all/PPE/findByIdPPE";
import updatePPE from "../../../../../../mutations/all/PPE/updatePPE";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPEDialog";
    findById = findByIdPPE;
    removeById = updatePPE;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "PPE Type";
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
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
            item: {
                id, data: {
                    created_at,
                    site,
                    project,
                    client,
                    name,
                    unit,
                    duration_type,
                    duration_value,
                    notes,
                    profile_pic,
                    team_list = [],
                    department_list = [],
                    job_position_list = []
                }
            }
        } = this;

        return <FormControls>
            <RowOrgs
                readonly
                client={client}
                project={project}
                site={site}
                active
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Type Details"
                >
                    <ProfileField title="PPE Type" value={name} className="col-lg-12"/>
                    <ProfileField title="Measurement Unit" value={unit} className="col-lg-12"/>
                    <ProfileField title="Duration" value={(duration_value && duration_type) || null}
                                  renderer={() => duration_value + '' + duration_type} className="col-lg-12"/>
                    <ProfileField title="Notes" value={notes} className="col-lg-12"/>
                    <UploadButton
                        name="profile_pic"
                        defaultValue={profile_pic}
                        buttonTitle="PPE Type Photo"
                        type={['Photo']}
                        showOnlyIcon
                        readonly
                        className="col-lg-6 col-xs-12 hor-center"
                    />
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Teams / Departments / Job Positions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewTeamListTable name="team_list" defaultValue={team_list} title="Team(s)" readonly/>
                <hr className="pull-left margin-t-5 margin-b-15"/>
                <NewDepartmentListTable name="department_list" defaultValue={department_list} title="Department(s)"
                                        readonly/>
                <hr className="pull-left margin-t-5 margin-b-15"/>
                <NewJobPositionListTable name="job_position_list" defaultValue={job_position_list}
                                         title="Job Position(s)" readonly/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
