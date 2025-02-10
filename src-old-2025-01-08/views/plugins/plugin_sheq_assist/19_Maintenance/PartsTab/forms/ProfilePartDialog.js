// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import style from "./ProfilePartDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfilePartDialog extends AProfileDialog {
    pageKey = "ProfilePartDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Asset Part";
    }

    //
    // get topButtonsHiddenDelete() {
    //     return true;
    // }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {};
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
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
            item: {
                //1. Part Details
                name,
                asset,
                asset_type,
                part_photo,

                //2. Order Request
                requested_by,
                date_requested,
                request_reason,
                measurement_unit,
                qty_requested,

                //3. Request Approval
                //3.1. Manager Approval
                approving_manager,
                approving_manager_date,
                //3.2. Finance Approval
                approving_finance,
                approving_finance_date,

                //4. Order Details
                qty_ordered,
                date_ordered,

                //5. Orders Received
            }
        } = this;

        const {isContractor, isConsultant} = storage.is;
        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Part Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ProfileField ref="name" name="name" title="Part Name" value={name}
                              className="col-lg-12"/>
                <ProfileField ref="asset" name="asset" title="Asset" value={asset} renderer={v => v.name || v.data.name}
                              className="col-lg-12"
                />
                <ProfileField name="asset_type" title="Asset Type" value={asset_type} className="col-lg-12"
                />
                <UploadButton name="part_photo" buttonTitle="Part Photo"
                              type={['Photo']}
                              showOnlyIcon
                              defaultValue={part_photo}
                              className="col-lg-12"
                              readonly
                />
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Order Request"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField ref="requested_by" name="requested_by" title="Requested By" value={requested_by}
                              renderer={v => v.data.fname + ' ' + v.data.lname}
                              className="col-lg-12"/>
                <ProfileField ref="date_requested" name="date_requested" type="date" value={date_requested}
                              title="Date Requested"
                              className="col-lg-12"/>

                <hr className="margin-0"/>

                <ProfileField ref="request_reason" name="request_reason" value={request_reason}
                              title="Reason For Request" className="col-lg-12"
                />

                <hr className="margin-0"/>

                <ProfileField ref="measurement_unit" name="measurement_unit" value={measurement_unit}
                              title="Measurement Unit" className="col-lg-12"
                />
                <ProfileField ref="qty_requested" name="qty_requested" value={qty_requested} title="Quantity Requested"
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Request Approval"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        active
                        idx={3.1}
                        title="3.1. Manager Approval"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <ProfileField ref="approving_manager" name="approving_manager" value={approving_manager}
                                      renderer={v => v.data.fname + ' ' + v.data.lname}
                                      title="Approving Manager"
                                      className="col-lg-12"/>
                        <ProfileField ref="approving_manager_date" name="approving_manager_date" type="date"
                                      value={approving_manager_date}
                                      title="Date Approved"
                                      className="col-lg-12"/>
                    </Row>
                    <Row
                        rendered
                        idx={3.2}
                        title="3.2. Finance Approval"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <ProfileField ref="approving_finance" name="approving_finance" value={approving_finance}
                                      renderer={v => v.data.fname + ' ' + v.data.lname}
                                      title="Finance Approving Person"
                                      className="col-lg-12"/>
                        <ProfileField ref="approving_finance_date" name="approving_finance_date" type="date"
                                      value={approving_finance_date}
                                      title="Date Approved"
                                      className="col-lg-12"/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Order Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField ref="qty_ordered" name="qty_ordered" title="Quantity Ordered" value={qty_ordered}
                              className="col-lg-6"/>
                <ProfileField ref="date_ordered" name="date_ordered" type="date" value={date_ordered}
                              title="Date Ordered"
                              className="col-lg-6"/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Orders Received"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                {/*<ProfileField ref="qty_received" name="qty_received" title="Quantity Received"*/}
                {/*                className="col-lg-12"/>*/}
                {/*<ProfileField ref="date_received" name="date_received" type="date" title="Date Received"*/}
                {/*                className="col-lg-6"/>*/}
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default ProfilePartDialog;
