// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../utils/Form';

import {ClearableInput} from '../inputs';
//import StripeForm from '../../components/stripe/StripeForm';
import {FormControls, PaymentForm, Row} from '../../components/FormComponents';
import {ANewDialog} from '../../components/dialogs';

import Modules from './Modules';

import style from './ModuleSetupDialog.lazy.css';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ModuleSetupDialog extends ANewDialog {
    pageKey = "ModuleSetupDialog";
    title = "Module Installer";

    constructor(props) {
        super(props, style);
    }

    onCancel() {
        storage.logout.signOutAndConfirm().then(() => {
            super.onCancel();
        });
    }

    get noBackAction() {
        return true;
    }

    get preventEsc() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Controls">
@observer
class Controls extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
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

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;

        const {isTrial} = storage.is;
        if (isTrial) return;

        if (idx === 1) {
            if (!form.isValid('module_list') || form.get('module_list').isEmpty()) {
                infoDialog.open('At least one module is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('module_list') || form.get('module_list').isEmpty()) {
            infoDialog.open('At least one module is required');
            return;
        }

        const {isTrial} = storage.is;
        if (!isTrial) {
            if (!form.isValid('payment_interval')) {
                infoDialog.open('Payment Interval is required');
                return;
            }
        }

        let {
            module_list
        } = form.data;

        module_list = module_list.map(toJS).slice();

        const data = pluginManager.getPluginsByModules(module_list).map(plugin => {
            const {data, data: {key, modules}} = plugin;
            const modules_updated = modules.filter(v1 => module_list.anyMatch(v2 => v2.key === v1.key)).map(v1 => {
                return toJS(module_list.find(v2 => v2.key === v1.key));
            });
            if (!modules_updated.isEmpty()) {
                const modules_not_updated = modules.filter(v1 => module_list.noneMatch(v2 => v2.key === v1.key)).map(v1 => toJS(v1));
                console.log("module_list update", key, [...modules_updated, ...modules_not_updated].slice())
                return {
                    ...toJS(plugin),
                    data: {...toJS(data), modules: [...modules_updated, ...modules_not_updated].slice()}
                };
            }
            return toJS(plugin);
        }).slice();

        console.log("module_list", module_list.slice())

        console.log("data", data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit("plugin_manager/update-list", data).then(res => {
            console.log("res", res)

            pluginManager.updateModules(res);

            onSaved && onSaved(res);
            infoDialog.open("Modules successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isLoggedIn} = storage.is;
        if (!isLoggedIn)
            return null;

//        const {is: {hasPaymentInterval}, selected: {selectedClientModules: {list}}} = storage;
//        if (hasPaymentInterval && !list.isEmpty()) {
//            return null;
//        }

        const {props: {onFormNext, onFormBack, onFormOpen}} = this;

        const {isTrial} = storage.is;

        return <FormControls onChange={this.form.onChange}>
            <Row
                rendered
                activeAlways
                idx={0}
                title="Info">
                <p>Please select the modules of your choice</p>
            </Row>
            <Row
                rendered
                active
                idx={1}
                title={`1. Select Module(s)`}
                onFormOpen={onFormOpen}
                onFormNext={!isTrial && onFormNext}>
                <Modules ref="module_list" name="module_list" onChange={this.form.onChange}/>
            </Row>
            {!isTrial && <Row
                rendered
                idx={2}
                title="2. Payment Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}>
                <ClearableInput ref="payment_interval" name="payment_interval" type="radio"
                                placeholder="Payment Interval" vertical className="form-control"
                                onChange={this.form.onChange} values={this.state.lists.payment_intervals}/>
                <PaymentForm onChange={this.form.onChange}/>
            </Row>}
        </FormControls>;
    }

    // </editor-fold>
}

// </editor-fold>

export default ModuleSetupDialog;
