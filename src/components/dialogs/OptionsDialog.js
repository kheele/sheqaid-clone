import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from './OptionsDialog.lazy.css';

import {execWhen} from '../../utils/Utils';
import {Button, ClearableInput} from '../inputs';
import Dialog from './Dialog';

@observer
class OptionsDialog extends React.Component {

    onResponse;
    @observable
    state = {
        lists: {
            options: []
        },
        value: null
    };

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
        window.optionsDialog = this;
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
    
    defaultValue(defaultValue) {
        if(defaultValue) {
            execWhen(() => this.refs.input).then(input_ref => {
                input_ref.onChange(defaultValue);
            });
        }
        return this;
    }
    
    options(options) {
        this.state.lists.options = options.map(text => {
            return {text, value: text, checked: false};
        });
        return this;
    }

    open() {
        return new Promise((resolve, reject) => {
            this.onResponse = resolve;
            setTimeout(() => this.refs.dialog.open("Select Option"), 0);
        });
    }

    close() {
        this.state.lists.options.clear();
        this.refs.dialog.close();
    }

    onChange(value, name) {
        this.state.value = value;
    }

    render() {
        const {options} = this.state.lists;
        if(options.isEmpty()) {
            return null;
        }
        return (<Dialog key="OptionsDialog" ref="dialog" className="OptionsDialog">
            <ClearableInput 
                ref={ref => {this.refs.input = ref}} 
                name="text" 
                type="radio"  
                required={true} 
                vertical
                className="form-control" 
                onChange={this.onChange}
                values={options}
                returnValue
            />
            <div className="controls">
		<Button className="btn btn-primary pull-right" onClick={this.onOk}>OK</Button>
		<Button className="btn btn-primary pull-right" onClick={this.onCancel}>Cancel</Button>
            </div>
	</Dialog>);
    }
}

export default OptionsDialog;
