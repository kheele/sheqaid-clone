// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';

import {ClearableInput} from '../inputs';
import {FormControls, Row} from '../FormComponents';

import ANewDialog from './ANewDialog';

import style from './NoProjectsDialog.lazy.css';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class Dialog extends ANewDialog {
    pageKey = "NoProjectsDialog";
    title = "Projects To Manage";

    constructor(props) {
        super(props, style);
    }
    
    get topButtonsHiddenCancel() {
        return true;
    }
    
    get noBackAction() {
        return true;
    }
    
    get preventEsc() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "users/update/profile/company";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            no_projects: ['Yes', 'No'].map(text => {
                return {text, value: text === 'Yes', checked: false};
            })
        }
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        this.form = new Form();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        
        if (!form.isValid('no_projects')) {
            infoDialog.open('Please specify if you have projects to manage');
            return;
        }
        
        const {no_projects} = form.data;
        const data = {no_projects};
        
        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path, data).then(res => {
            console.log("res", res)
            const {company} = storage.loggedUser;
            company.data.no_projects = res;
            
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>
        
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        return <FormControls onChange={this.form.onChange}>
            <Row 
                rendered  
                active
                idx={1}
                title="Projects To Manage"
            >
                <ClearableInput name="no_projects" type="radio" placeholder="Do You Have Projects?" vertical className="col-lg-12 form-control" values={this.state.lists.no_projects}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default Dialog;