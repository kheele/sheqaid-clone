import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed} from 'mobx';

import {execWhen} from '../../utils/Utils';

import {Button} from '../inputs';
import Dialog from './Dialog';

import style from './TrailExiredDialog.lazy.css';

@observer
class TrailExiredDialog extends React.Component {

    constructor(props) {
        super(props);

        this.onClose = this.onClose.bind(this);
        this.onUpgradeAccountLater = this.onUpgradeAccountLater.bind(this);
        this.onUpgradeAccount = this.onUpgradeAccount.bind(this);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        autorun(() => {
            const {isLoggedIn, isConsultant, isTrial} = storage.is;
            if (isLoggedIn) {
                const {trialDaysLeft} = storage;
                if(isTrial) {
                    execWhen(() => this.refs.dialog).then(dialog => {
                        const max = isConsultant ? 3 : 5;
                        if (trialDaysLeft <= max) {
                            this.open();
                        } else {
                            this.close();
                        }
                    });
                }
            }
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    onClose() {
        const {app} = electronRemote;
        app.exit(0);
    }

    onUpgradeAccountLater() {
        this.close();
    }

    onUpgradeAccount() {
//        alert(this)
    }

    open() {
        return new Promise((resolve, reject) => {
            this.refs.dialog.open("Your Trail Ended");
            resolve();
        });
    }

    close() {
        this.refs.dialog.close();
    }

    @computed
    get isPreClosed() {
        const {isLoggedIn, isTrial} = storage.is;
        if (!isLoggedIn)
            return null;
        if (!isTrial) {
            return null;
        }
        const {trialDaysLeft} = storage;
        return trialDaysLeft > 0 && trialDaysLeft <= 5;
    }

    @computed
    get isClosedToday() {
        const {isLoggedIn, isTrial} = storage.is;
        if (!isLoggedIn)
            return null;
        if (!isTrial) {
            return null;
        }
        const {trialDaysLeft} = storage;
        return trialDaysLeft === 0;
    }

    @computed
    get isClosed() {
        const {isLoggedIn, isTrial} = storage.is;
        if (!isLoggedIn)
            return null;
        if (!isTrial) {
            return null;
        }
        const {trialDaysLeft} = storage;
//        return trialDaysLeft < 0;
        return false;
    }

    @computed
    get bottomButtons() {
        const {isLoggedIn, isTrial} = storage.is;
        if (!isLoggedIn)
            return null;
        if (!isTrial) {
            return null;
        }

        if (this.isClosed) {
            return <React.Fragment>
                <Button className="btn btn-primary _888" text="Close Application" onClick={this.onClose}/>
                <Button className="btn btn-primary" text="Upgrade Account" onClick={this.onUpgradeAccount}/>
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <Button className="btn btn-primary _888" text="Upgrade Account Later" onClick={this.onUpgradeAccountLater}/>
                <Button className="btn btn-primary" text="Upgrade Account Now" onClick={this.onUpgradeAccount}/>
            </React.Fragment>;
        }

        return null;
    }

    render() {
        const {isLoggedIn, isTrial} = storage.is;
        if (!isLoggedIn)
            return null;
        if (!isTrial) {
            return null;
        }
        if (!this.isPreClosed && !this.isClosedToday && !this.isClosed) {
            return null;
        }
        const {trialDaysLeft} = storage;

        return (<Dialog 
            key="TrailExiredDialog" 
            ref="dialog" 
            className="TrailExiredDialog"
            preventEsc
            bottomButtons={this.bottomButtons}
            >
            <div className="controls-wrapper">
                <div className="controls">
                    <div className="row">
                        <div className="row sec-group text-center">
                            {this.isPreClosed && <h4 className="margin-r-10">Your trial period will end in the next <b>{trialDaysLeft} day(s)</b></h4>}
                            {this.isClosedToday && <h4 className="margin-r-10">Your trial period ends <b>today</b></h4>}
                            {this.isClosed && <h4 className="margin-r-10">Your trial period ended in the last <b>{-trialDaysLeft} day(s)</b></h4>}
                        </div>
                    </div>
                    <div className="row">
                        {this.isClosedToday && <div className="row sec-group text-center">
                            <h5 className="margin-r-10 font-size-15">Your account will been suspended <b>today midnight</b> until you upgrade to the <b>premium package</b></h5>
                            <hr />
                            <h5 className="margin-r-10 font-size-15">Please click on <b>Upgrade Account</b> button below to upgrade your account</h5>
                        </div>}
                        {this.isClosed && <div className="row sec-group text-center">
                            <h5 className="margin-r-10 font-size-15">Your account has been suspended until you upgrade to the <b>premium package</b></h5>
                            <hr />
                            <h5 className="margin-r-10 font-size-15">Please click on <b>Upgrade Account</b> button below to upgrade your account</h5>
                        </div>}
                    </div>
                </div>
            </div>
        </Dialog>);
    }
}

export default TrailExiredDialog;
