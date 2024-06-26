import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

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

        this.onSetRef = this.onSetRef.bind(this);

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
            if (defaultValue) {
                execWhen(() => this.refs.text).then(text_ref => {
                    text_ref.onChange(defaultValue);
                });
            }
            execWhen(() => this.refs.dialog).then(ref => {
                ref.open(title || "Input Text");
            });
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

    onSetRef(ref) {
        this.refs.text = ref;
    }

    render() {
        return (<Dialog
            key="InputDialog"
            ref="dialog"
            className="InputDialog"
            dialog={this}
        >
            <Input state={this.state} onSetRef={this.onSetRef} onChange={this.onChange}/>
            <div className="controls">
                <OkBtn state={this.state} onOk={this.onOk}/>
                <Button className="btn btn-primary pull-right" onClick={this.onCancel}>Cancel</Button>
            </div>
        </Dialog>);
    }
}

@observer
class Input extends React.Component {

    @computed get value() {
        return this.props.state.value;
    }

    @computed get type() {
        return this.props.state.type || 'text';
    }

    @computed get isPassword() {
        return this.type === "password";
    }

    @computed get placeholder() {
        if (this.isPassword) {
            return "Enter Password";
        }
        return "Type...";
    }

    render() {
        const {type, placeholder, value, props: {onSetRef, onChange}} = this;
        return <ClearableInput
            ref={onSetRef}
            name="text"
            type={type}
            defaultValue={value}
            placeholder={placeholder}
            required={true}
            className="form-control"
            onChange={onChange}
        />;
    }
}

@observer
class OkBtn extends React.Component {

    @computed get type() {
        return this.props.state.type || 'text';
    }

    @computed get isPassword() {
        return this.type === "password";
    }

    @computed get text() {
        if (this.isPassword) {
            return "Confirm Password";
        }
        return "OK";
    }

    render() {
        const {text, props: {onOk}} = this;
        return <Button
            className="btn btn-primary pull-right"
            onClick={onOk}
        >
            {text}
        </Button>;
    }
}

export default InputDialog;
