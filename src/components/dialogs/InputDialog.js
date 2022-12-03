import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from './InputDialog.lazy.css';

import {execWhen} from '../../utils/Utils';
import {Button, ClearableInput} from '../inputs';
import Dialog from './Dialog';

@observer
class InputDialog extends React.Component {

    onResponse;
    @observable
    state = {value: null, type: 'text'};

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onOk = this.onOk.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
    }
    
    componentDidMount() {
        window.inputDialog = this;
    }

    componentWillUnmount() {
        style.unuse();
    }

    onCancel() {
        this.onResponse && this.onResponse();
        this.close();
    }

    onOk() {
        this.onResponse && this.onResponse(this.state.value);
        this.close();
    }

    open(title, defaultValue) {
        return new Promise((resolve, reject) => {
            this.onResponse = resolve;
            if(defaultValue) {
                execWhen(() => this.refs.text).then(text_ref => {
                    text_ref.onChange(defaultValue);
                });
            }
            setTimeout(() => this.refs.dialog.open(title || "Input Text"), 0);
        });
    }

    close() {
        this._onClosing && this._onClosing();
        this.state.type = 'text';
        this.refs.dialog.close();
    }

    onClosing(_onClosing) {
        this._onClosing = _onClosing;
        return this;
    }

    onChange(value, name) {
        this.state.value = value;
    }

    password() {
        this.state.type = 'password';
        return this;
    }

    render() {
        return (<Dialog key="InputDialog" ref="dialog" className="InputDialog">
            <ClearableInput 
                ref={ref => {this.refs.text = ref}} 
                name="text" 
                type={this.state.type || 'text'} 
                defaultValue={this.state.value} 
                placeholder="Type..." 
                required={true} 
                className="form-control" 
                onChange={this.onChange}
            />
            <div className="controls">
		<Button className="btn btn-primary pull-right" onClick={this.onOk}>OK</Button>
		<Button className="btn btn-primary pull-right" onClick={this.onCancel}>Cancel</Button>
            </div>
	</Dialog>);
    }
}

export default InputDialog;
