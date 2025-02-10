// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPEDisposalDialog.lazy.css";
import {findByIdPPEDisposal} from "mutations/findById";
import {updatePPEDisposal} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPEDisposalDialog";
    findById = findByIdPPEDisposal;
    removeById = updatePPEDisposal;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "PPE Disposal";
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
                    site,
                    project,
                    client,
                    disposal_date,
                    method,
                    reason,
                    ppe_item,
                    disposed_by,
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
                    title="1. PPE Disposal Details"
                    onFormNext={null}
                >
                    <ProfileField title="PPE Item" value={ppe_item} renderer={v => v.name} className="col-lg-12"/>
                    <ProfileField title="Disposed By" value={disposed_by} renderer={v => v.full_name}
                                  className="col-lg-12"/>
                    <ProfileField title="Disposal Method" value={method} className="col-lg-12"/>
                    <ProfileField title="Disposal Reason" value={reason} className="col-lg-12"/>
                    <ProfileField title="Disposal Date" type="date" value={disposal_date} className="col-lg-12"/>
                </Row>
            </RowOrgs>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
