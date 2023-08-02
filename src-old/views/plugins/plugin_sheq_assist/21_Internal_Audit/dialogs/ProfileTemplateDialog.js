import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';

import {TemplateQuestions} from '../../../../../components/templates';

import style from "./ProfileTemplateDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTemplateDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Template";
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        
    };
    
    constructor(props) {
        super(props);
        
        this.getDialogDOM = this.getDialogDOM.bind(this);
        
        this.form = new Form();
    }
    
    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
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
                    created_at, client_id, company_id, form, user_id
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <TemplateQuestions 
                    ref="questions" 
                    readonly
                    getDialogDOM={this.getDialogDOM} 
                    item={this.item} 
                    formData={form}
                />
            </div>
        </div>;
    }

}

export default ProfileDialog;
