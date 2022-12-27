import React from "react";
import PropTypes from "prop-types";
import {CircularProgress} from '@material-ui/core';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {execWhen} from '../../utils/Utils';

import style from './ProgressDialog.lazy.css';

import {Button} from '../inputs';
import Dialog from './Dialog';

@observer
class ProgressDialog extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string
    };

    onResponse;
    @observable
    state = {msg: null};
    defaultMsg = "Please wait...";

    constructor(props) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
        if ('message' in this.props) {
            this.state.msg = this.props.message;
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    onCancel() {
        this.close();
    }

    open(msg) {
        return new Promise((resolve, reject) => {
            if (!!msg) {
                this.state.msg = msg;
            } else {
                this.state.msg = this.defaultMsg;
            }
            this.onResponse = resolve;
            setTimeout(() => {
                this.refs.dialog.open(this.props.title || "Progress");
                this.__open = true;
            }, 0);
        });
    }

    close() {
        if(this.__open) {
            this.onResponse && this.onResponse();
            this.refs.dialog.close();
        } else {
            execWhen(() => this.__open).then(() => {
                this.onResponse && this.onResponse();
                this.refs.dialog.close();
                this.__open = false;
            });
        }
    }

    render() {
        return (<Dialog
            key="ProgressDialog"
            ref="dialog"
            className="ProgressDialog"
            dialog={this}
        >
            <CircularProgress/>
            <Msg state={this.state}/>
            <div className="controls">
                <Button className="btn btn-primary pull-right" onClick={this.onCancel}>Close</Button>
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

export default ProgressDialog;
