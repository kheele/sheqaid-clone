import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {Slider} from 'components/lists';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./ProfileDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileCompetencyCertificateDialog";
    className = "AProfileEmployeeDocDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Competency Certificates";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
        this.refs.pdfReader.open(this.item);
    }

    // </editor-fold>

    renderItem(item, n, onClick) {
        const {
            created_at,
            title,
            training,
            trainer,
            type,
            competency_type,
            issued_date,
            expiry_date,
            accreditation_num,
            doc
        } = item;

        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Competency Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Certificate Type" name="type" className="col-lg-4" value={type}/>
                <ProfileField title="Competency Type" name="competency_type" className="col-lg-4"
                              value={competency_type}/>
                <ProfileField title="Accreditation Number" name="accreditation_num" className="col-lg-4"
                              value={accreditation_num}/>
                <ProfileField title="Date Of Issue" name="issued_date" type="date" className="col-lg-6"
                              value={issued_date}/>
                <ProfileField title="Expiry Date" name="expiry_date" type="date" className="col-lg-6"
                              value={expiry_date}/>
            </div>
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Training Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Training" name="training" className="col-lg-6"
                              value={training && training.course_or_module}
                              renderer={v => isString(v) ? v : (v.name || v.data.name)}/>
                <ProfileField title="Trainer" className="col-lg-6" value={trainer}
                              renderer={v => v.lname + " " + v.fname}/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-0 text-center">Competency Certificate Document</label>
            <div className="row margin-l-0 margin-r-0 margin-b-15 row-doc sec-group">
                <UploadButton
                    name="doc"
                    defaultValue={doc}
                    buttonTitle="Competency Certificate Attachment"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="ProfileField w-280 hor-center"
                />
            </div>
        </div>;
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                dialog, dialog: {renderProfileCover}
            },
            item: {
                id,
                fname, lname,
                optional_info, client, project, site, client_id, project_id, site_id,

                competency_list: list
            }
        } = this;

        const activeId = dialog.extraProp('activeId');
        const index = activeId ? list.indexOfWithPredicate(item => item.id === activeId) : 0;

        console.log('index', activeId, ids.slice(), index)

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{lname + ' ' + fname}</h3>
                    <h5>{list.length + ' Competency Certificates'}</h5>
                </React.Fragment>)}
                <Slider
                    name="competency-certificate-carousel"
                    index={index}
                    renderer={this.renderItem}
                    list={list}
                    splitBy={1}
                    colSize="col-lg-12"
                    onClick={this.onClick}
                />
            </div>
            <ProfilePDFReader ref="pdfReader"/>
        </div>;
    }

}

export default ProfileDialog;
