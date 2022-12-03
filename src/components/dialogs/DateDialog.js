import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import DatePicker from 'react-date-picker';

import style from './DateDialog.lazy.css';
import {Button} from '../inputs';
import Dialog from './Dialog';

@observer
class DateDialog extends React.Component {

    onResponse;
    @observable
    state = {value: null};

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
        window.dateDialog = this;
    }

    componentWillUnmount() {
        style.unuse();
    }

    onCancel() {
        this.close();
    }

    onOk() {
        const {value} = this.state;
        if(!value) {
            infoDialog.open('Please Select Date');
            return;
        }
        this.onResponse && this.onResponse(value);
        this.close();
    }

    open(defaultValue) {
        return new Promise((resolve, reject) => {
            this.onResponse = resolve;
            this.state.value = defaultValue;
            setTimeout(() => this.refs.dialog.open("Select Date"));
        });
    }

    close() {
        this._onClosing && this._onClosing();
        this.refs.dialog.close();
    }

    onClosing(_onClosing) {
        this._onClosing = _onClosing;
        return this;
    }

    onChange(value, name) {
        this.state.value = value;
    }

    render() {
        return (<Dialog key="DateDialog" ref="dialog" className="DateDialog">
            <DatePickerImpl 
                ref="datePicker" 
                onChange={this.onChange} 
                state={this.state} 
            />
            <div className="controls">
                <Button className="btn btn-primary pull-right" onClick={this.onOk}>OK</Button>
                <Button className="btn btn-primary pull-right" onClick={this.onCancel}>Cancel</Button>
            </div>
        </Dialog>);
    }
}

@observer
class DatePickerImpl extends React.Component {
    render() {
        const {state: {value}, onChange} = this.props;
        return <DatePicker 
            key={new Date().getTime()}
            ref="datePicker" 
            name="datePicker" 
            onChange={onChange} 
            value={value} 
            isOpen={true} 
            closeCalendar={false}
        />;
    }
}

export default DateDialog;
