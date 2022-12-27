import React from "react";
import {CircularProgress} from '@material-ui/core';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from './AutoUpdateDialog.lazy.css';
import Dialog from './Dialog';

@observer
class AutoUpdateDialog extends React.Component {
    static propTypes = {

    };

    @observable
    state = {msg: "Please wait...", percentage: 0};

    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        neonBinding.events.on('auto-update_checking-for-update', async () => {
            console.log('auto-update_checking-for-update')
        });
        neonBinding.events.on('auto-update_available', async info => {
            if (this.state.percentage === 0) {
                this.state.msg = 'The latest version of the application is available. The new version will automatically download and install itself.';
                this.open();
                setTimeout(function () {
                    this.close();
                }.bind(this), 7000);
            }
        });
        neonBinding.events.on('auto-update_not-available', async info => {
            console.log('auto-update_not-available', info)
        });
        neonBinding.events.on('auto-update_error', async err => {
//            if (this.state.percentage === 0) {
                this.state.msg = 'An error occurred while updating the Application. The process of updating will be restarted.';
                this.open();
                console.log('auto-update_error', err)
                setTimeout(function () {
                    this.close();
                }.bind(this), 7000);
//            }
        });
        neonBinding.events.on('auto-update_download-progress', async progressObj => {
//            let log_message = "Download speed: " + progressObj.bytesPerSecond;
//            log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//            log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
            this.state.msg = "Download in progress. Please wait...";
//            console.log('auto-update_download-progress', progressObj)
            this.state.percentage = parseFloat(progressObj.percent);
            this.open();
        });
        neonBinding.events.on('auto-update_downloaded', async info => {
            this.state.msg = 'The new update was downloaded. Installation will start in few seconds.';
            console.log('auto-update_downloaded', info)
            this.open();
//            console.log('auto-update_downloaded', info)
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    open() {
        return new Promise((resolve, reject) => {
            this.refs.dialog.open("New Application Update");
            resolve();
        });
    }

    close() {
        this.refs.dialog.close();
    }

    render() {
        return (<Dialog
            key="AutoUpdateDialog"
            ref="dialog"
            className="AutoUpdateDialog"
            dialog={this}
        >
            <Msg state={this.state}/>
            <CircularProgressWrapper state={this.state}/>
        </Dialog>);
    }
}

@observer
class CircularProgressWrapper extends React.Component {

    render() {
        const {state, state: {percentage}} = this.props;
        if (percentage === 0 || percentage === 100) {
            return null;
        }
        return (<CircularProgress>
            <ProgressValue state={state}/>
        </CircularProgress>);
    }
}

@observer
class ProgressValue extends React.Component {

    render() {
        return (<span className="percentage">{Math.round(this.props.state.percentage * 10) / 10}%</span>);
    }
}

@observer
class Msg extends React.Component {
    render() {
        return <h4 className="msg">{this.props.state.msg}</h4>;
    }
}

export default AutoUpdateDialog;
