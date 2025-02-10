// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPEReturnDialog.lazy.css";
import {findByIdPPEReturn} from "mutations/findById";
import {updatePPEReturn} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPEReturnDialog";
    findById = findByIdPPEReturn;
    removeById = updatePPEReturn;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "PPE Return";
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
                    return_date,
                    ppe_condition,
                    ppe_item,
                    employee,
                    returner_signature,
                    receiver_signature,
                    doc,
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
                    title="1. PPE Return Details"
                    onFormNext={null}
                >
                    <ProfileField title="PPE Item" value={ppe_item} renderer={v => v.name} className="col-lg-12"/>
                    <ProfileField title="Employee" value={employee} renderer={v => v.full_name} className="col-lg-12"/>
                    <ProfileField title="PPE Condition" value={ppe_condition} className="col-lg-12"/>
                    <ProfileField title="Returned By Signature" type="signature" value={returner_signature}
                                  className="col-lg-12"/>
                    <ProfileField title="Received By Signature" type="signature" value={receiver_signature}
                                  className="col-lg-12"/>
                    <ProfileField title="Return Date" type="date" value={return_date} className="col-lg-12"/>
                    <UploadButton
                        name="doc"
                        buttonTitle="PPE Photo On Return"
                        type={['Photo']}
                        defaultValue={doc}
                        showOnlyIcon
                        className="col-lg-12"
                        readonly
                    />
                </Row>
            </RowOrgs>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
