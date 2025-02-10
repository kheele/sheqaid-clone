import React from 'react';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button} from '../components/inputs';
import ErrorBoundaryNoInternetImage from "./ErrorBoundaryNoInternetImage";
import {insertErrorReporting} from "mutations/create";

@observer
class ErrorBoundary extends React.Component {

    @observable
    state = {
        hasError: false,
        isLoadingError: false,
    };

    constructor() {
        super();

        this.onReport = this.onReport.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    @computed
    get isLoadingError() {
        return this.state.isLoadingError;
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        const err = error.toString();
        console.log('ErrorBoundary getDerivedStateFromError', error);//
        return {hasError: true, isLoadingError: err.contains("Loading") && err.contains("failed.")};
    }

    onReport(e, btn) {
        const {error, errorInfo} = this;
        btn.text("Reporting...").disabled();
        insertErrorReporting({error, errorInfo}).finally(() => {
            btn.text("Report Problem").enabled();
        });
    }

    onClick() {
        if (window.confirmDialog) {
            confirmDialog.open(<React.Fragment>
                <p>This action restarts the system.</p>
                <p>Are you sure you want to restart?</p>
            </React.Fragment>).then(res => {
                if (res === 1) {
                    app.restart();
                }
            });
        } else {
            app.restart();
        }
    }

    componentDidCatch(error, errorInfo) {
        this.error = error;
        this.errorInfo = errorInfo;
        const err = error.toString();
        if (err.contains("Loading") && err.contains("failed.")) {
            this.state.isLoadingError = true;
            // infoDialog.action("Try Again", () => {

            // }).open(<h4>Failed to complete an action due to network failure.<br /><br />Please connect and try again.</h4>);
        }
        this.state.hasError = true;
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary', error, errorInfo, err.contains("Loading"), err.contains("failed."));//
    }

    render() {
        const {CustomErrorBoundary, customErrorBoundaryProps} = this.props;
        if (this.state.hasError) {
            if (CustomErrorBoundary) {
                const props = customErrorBoundaryProps || {};
                return <CustomErrorBoundary {...props} onReport={this.onReport}/>;
            }
            if (this.state.isLoadingError) {
                return <div className="error-boundary ErrorBoundaryNoInternetImage text-left">
                    <ErrorBoundaryNoInternetImage/>
                    <h3 className="-margin-t-5 margin-b-10">No Internet Connection</h3>
                    <p className="margin-t-0">Please confirm one of the following:</p>
                    <p>1. Make sure you are connected to the internet.</p>
                    <p>2. Make sure you are connected to a stable network.</p>
                    <p>3. If the problem persists, contact your network administrator.</p>
                    <Button className="btn btn-primary margin-t-15 hor-center" text="Restart The System"
                            onClick={this.onClick}/>
                </div>;
            }
            return <div className="error-boundary">
                <h4 className="margin-t-0">Something went wrong.</h4>
                <p className="margin-t-0">Please confirm one of the following:</p>
                <p>1. Make sure you are connected to the internet.</p>
                <div className="error-boundary-report margin-t-20 margin-b-20 padding-20">
                    <h4 className="margin-t-0 margin-b-20">Or report this problem.</h4>
                    <p>We will resolve it as soon as possible.</p>
                    <Button className="btn btn-primary hor-center" text="Report Problem" onClick={this.onReport}/>
                </div>
                <Button className="btn btn-primary hor-center" text="Restart The System" onClick={this.onClick}/>
            </div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
