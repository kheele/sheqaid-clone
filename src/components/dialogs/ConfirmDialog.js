import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from './ConfirmDialog.lazy.css';

import {Button} from '../inputs';
import Dialog from './Dialog';

@observer
class ConfirmDialog extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string
    };

    onResponse;
    @observable
    state = {msg: null};

    constructor(props) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.onNo = this.onNo.bind(this);
        this.onYes = this.onYes.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
        this.state.msg = this.props.message;
    }

    componentWillUnmount() {
        style.unuse();
    }

    onCancel() {
        this.onResponse && this.onResponse(-1);
        this.close();
    }

    onNo() {
        this.onResponse && this.onResponse(0);
        this.close();
    }

    onYes() {
        this.onResponse && this.onResponse(1);
        this.close();
    }

    open(msg) {
        return new Promise((resolve, reject) => {
            if (!!msg) {
                this.state.msg = msg;
            }
            this.onResponse = resolve;
            setTimeout(() => this.refs.dialog.open(this.props.title || "Confirm"), 0);
        });
    }

    close() {
        this.refs.dialog.close();
    }

    render() {
        return (<Dialog key="ConfirmDialog" ref="dialog" className="ConfirmDialog">
            <Msg state={this.state}/>
            <div className="controls">
                <Button className="btn btn-primary pull-right" onClick={this.onYes}>Yes</Button>
                <Button className="btn btn-primary pull-right" onClick={this.onNo}>No</Button>
                <Button className="btn btn-primary pull-right" onClick={this.onCancel}>Cancel</Button>
            </div>
        </Dialog>);
    }
}

@observer
class Msg extends React.Component {
    render() {
        return <h4>{this.props.state.msg}</h4>;
    }
}

export default ConfirmDialog;
