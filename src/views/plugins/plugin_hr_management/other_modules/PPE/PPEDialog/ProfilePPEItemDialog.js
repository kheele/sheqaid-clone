// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPEItemDialog.lazy.css";
import {findByIdPPEItem} from "mutations/findById";
import {updatePPEItem} from "mutations/update";
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

    get controls() {
        return Controls;
    }

    title() {
        return "PPE Item";
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
                    ppe_type,
                    serial_num,
                    purchase_date,
                    condition,
                    notes,
                    profile_pic,
                }
            }
        } = this;

        return (<FormControls>
            <Row
                activeAlways
                rendered
                idx={0}
                title="PPE Item Details"
            >
                <ProfileField title="PPE Type" value={ppe_type.name} className="col-lg-12"/>
                <ProfileField title="Measurement Unit" value={ppe_type.unit} className="col-lg-12"/>
                <ProfileField title="Serial No." value={serial_num} className="col-lg-12"/>
                <ProfileField title="Purchase Date" type="date" value={purchase_date} className="col-lg-12"/>
                <ProfileField title="Condition" value={condition} className="col-lg-12"/>
                <ProfileField title="Notes" value={notes} className="col-lg-12"/>
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
        </FormControls>);
    }

    // </editor-fold>

}

export default ProfileDialog;
