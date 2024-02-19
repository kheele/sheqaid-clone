// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {AProfileDialog} from 'components/dialogs';
import {ClearableInput, ProfileField, ProfilePic, RowOrgs, SelectGenderInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPEItemDialog.lazy.css";
import findByIdPPEItem from "mutations/all/PPE/findByIdPPEItem";
import updatePPEItem from "mutations/all/PPE/updatePPEItem";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPEItemDialog";
    findById = findByIdPPEItem;
    removeById = updatePPEItem;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "PPE Item";
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
                    ppe_type,
                    profile_pic,
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
                    title="1. PPE Item Details"
                >
                    <ProfileField title="PPE Item" value={name} className="col-lg-12"/>
                    <ProfileField title="PPE Type" value={ppe_type.name} className="col-lg-12"/>
                    <ProfileField title="Measurement Unit" value={ppe_type.unit} className="col-lg-12"/>
                    <ProfileField title="Duration" value={(ppe_type.duration_value && ppe_type.duration_type) || null}
                                  renderer={() => ppe_type.duration_value + '' + ppe_type.duration_type} className="col-lg-12"/>
                    <UploadButton
                        name="profile_pic"
                        defaultValue={profile_pic}
                        buttonTitle="PPE Item Photo"
                        type={['Photo']}
                        showOnlyIcon
                        readonly
                        className="col-lg-6 col-xs-12 hor-center"
                    />
                </Row>
            </RowOrgs>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
