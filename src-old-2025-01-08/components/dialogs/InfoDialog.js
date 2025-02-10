import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from './InfoDialog.lazy.css';

import {Button} from '../inputs';
import Dialog from './Dialog';

@observer
class InfoDialog extends React.Component {
    static propTypes = {
        title: PropTypes.string, message: PropTypes.string
    };

    onResponse;
    @observable
    state = {
        actions: [], msg: null
    };

    constructor(props) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
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

    action(action, fn) {
        this.state.actions.push({action, fn});
        return this;
    }

    onCancel() {
        this.close();
    }

    open(msg) {
        return new Promise((resolve, reject) => {
            if (!!msg) {
                this.state.msg = msg;
            }
            this.onResponse = resolve;
            setTimeout(() => this.refs.dialog.open(this.props.title || "Message"), 0);
        });
    }

    close(delay) {
        this.state.actions.clear();
        this.onResponse && this.onResponse();
        if (isNumber(delay)) {
            setTimeout(() => this.refs.dialog.close(), delay);
        } else {
            this.refs.dialog.close();
        }
    }

    render() {
        return (<Dialog
            key="InfoDialog"
            ref="dialog"
            className="InfoDialog"
            dialog={this}
        >
            <Msg state={this.state}/>
            <div className="controls">
                <Button className="btn btn-primary pull-right" text="Close" onClick={this.onCancel}/>
                <Buttons state={this.state}/>
            </div>
        </Dialog>);
    }
}

@observer
class Buttons extends React.Component {
    render() {
        const {actions} = this.props.state;
        if (!actions || actions.isEmpty()) return null;

        return <>
            {actions.map(v => {
                return <Button
                    key={v.action}
                    className="btn btn-primary pull-right"
                    text={v.action}
                    onClick={v.fn}
                />;
            })}
        </>;
    }
}

@observer
class Msg extends React.Component {
    render() {
        return <h4>{this.props.state.msg}</h4>;
    }
}

export default InfoDialog;