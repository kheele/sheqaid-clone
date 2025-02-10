// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';
import {setDefaultVal} from '../../utils/Utils';
//import StripeForm from '../../components/stripe/StripeForm';
import {FormControls, Row} from '../../components/FormComponents';
import {NewClientListTable} from '../../components/FormTableComponents';
import {ANewDialog} from '../../components/dialogs';

import style from './ModuleSetupDialog.lazy.css';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectClientDialog">
@observer
class SelectClientDialog extends ANewDialog {
    pageKey = "SelectClientDialog";
    title = "Select Company";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  SelectClientControls;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectClientControls">
@observer
class SelectClientControls extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists:{
            payment_intervals: [
                {text: 'Monthly', value: 'Monthly', checked: true},
                {text: 'Annually', value: 'Annually', checked: false}
            ],
        },
        permissions_modules: []
    };
    // </editor-fold>
    
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentDidMount() {
        const setDefaultValue = setDefaultVal.bind(this);
        
        const {dialog} = this.props;
        const company_list = dialog.extraProp('company_list');
        
        if(company_list) {
            setDefaultValue('company_list', () => [...company_list, null]);
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('company_list') || form.get('company_list').isEmpty()) {
            infoDialog.open('At least one company is required');
            return;
        }
        
        const {
            company_list
        } = form.data;
        
        console.log("company_list", company_list.slice())
        
        onSaved(company_list);
        this.props.close();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormOpen}} = this;
        return <FormControls onChange={this.form.onChange}>
            <Row
                rendered
                activeAlways
                idx={0}
                title="Add Companies"
                onFormOpen={onFormOpen}>
                    <NewClientListTable
                        ref="company_list"
                        name="company_list"
                        className="w-full"
                    />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}
// </editor-fold>

export default SelectClientDialog;
