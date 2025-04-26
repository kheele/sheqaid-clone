import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';

import {CertificateAccredited, CertificateNonAccredited} from './CertificateComponents';

import style from "./ProfileCertificateDialog.lazy.css";

@observer
class ProfileCertificateDialog extends AProfileDialog {
    pageKey = "ProfileCertificateDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        const {type} = this.state.item.data;
        return "Certificate (" + (type) + ")";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    state = {};
    
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    componentDidMount() {
        this.props.execWhen(() => this.refs.logo).then(async logo_ref => {
            const {data: {company: {id}}} = this.item;
            const res = await workers.emit('plugin_sheq_assist/clients/profile-pic', id);
            if(res && res.dlUrls) {
                logo_ref.src = res.dlUrls[0];
            }
        });
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at,
                    issued_date, accreditation_num, type, company, employee, training, trainer
                }
            }
        } = this;
        
        console.log('item trainer', this.item)
        
        return <div className="controls-wrapper">
            <div className="controls col-lg-12">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row CertificateComponents">
                    <label className="hor-center">Certificate Preview</label>
                    <CertificateAccredited item={this.item}/>
                    <CertificateNonAccredited item={this.item}/>
                </div>
            </div>
        </div>;
    }

}

export default ProfileCertificateDialog;
