// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPESupplierDialog.lazy.css";
import {findByIdPPESupplier} from "mutations/findById";
import {updatePPESupplier} from "mutations/update";
import {NewPPEItemListTable} from "components/FormTableComponents";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPESupplierDialog";
    findById = findByIdPPESupplier;
    removeById = updatePPESupplier;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "PPE Supplier";
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
                    contact_person,
                    email,
                    phone,
                    address,
                    ppe_item_list,
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
                    title="1. PPE Supplier Details"
                >
                    <ProfileField title="Supplier" value={name} className="col-lg-12"/>
                    <ProfileField title="Contact Person" value={contact_person} className="col-lg-12"/>
                    <ProfileField title="Email Address" value={email} className="col-lg-12"/>
                    <ProfileField title="Phone No." value={phone} className="col-lg-12"/>
                    <ProfileField title="Address" value={address} className="col-lg-12"/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. PPE Items"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewPPEItemListTable name="ppe_item_list" defaultValue={ppe_item_list} readonly
                                     className="w-full-calc-add-10 -margin-l-10 -margin-t-5"/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
