// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPEInventoryDialog.lazy.css";
import {findByIdPPEInventory} from "mutations/findById";
import {updatePPEInventory} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPEInventoryDialog";
    findById = findByIdPPEInventory;
    removeById = updatePPEInventory;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "PPE Inventory";
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
                    ppe_type,
                    location,
                    reorder_threshold,
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
                    title="1. PPE Inventory Details"
                >
                    <ProfileField title="PPE Type" value={ppe_type} renderer={v => v.name} className="col-lg-12"/>
                    <ProfileField title="Inventory Location" value={location} className="col-lg-12"/>
                    <ProfileField title="Reorder Threshold" value={reorder_threshold} className="col-lg-12"/>
                </Row>
            </RowOrgs>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
