import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button} from '../components/inputs';
import insertErrorReporting from "mutations/all/ErrorReporting/insertErrorReporting";

@observer
class ErrorBoundary extends React.Component {

    @observable
    state = {
        hasError: false
    };

    constructor() {
        super();
        
        this.onReport = this.onReport.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    
    onReport(e, btn) {
        const {error, errorInfo} = this;
        btn.text("Reporting...").disabled();
        insertErrorReporting({error, errorInfo}).
        finally(() => {
            btn.text("Report Problem").enabled();
        });
    }
    
    onClick() {
        if(window.confirmDialog) {
            confirmDialog.open(<React.Fragment>
                <p>This action restarts the system.</p>
                <p>Are you sure you want to restart?</p>
            </React.Fragment>).then(res => {
                if(res === 1) {
                    app.restart();
                }
            });
        } else {
            app.restart();
        }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        this.error = error;
        this.errorInfo = errorInfo;
        const err = error.toString();
        if(err.contains("Loading") && err.endsWith("failed.")) {
            infoDialog.action("Try Again", () => {
                
            }).open(<h4>Failed to complete an action due to network failure.<br/><br/>Please connect and try again.</h4>);
        } else {
            this.state.hasError = true;
        }
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary', error, errorInfo);
    }

    render() {
        const {CustomErrorBoundary, customErrorBoundaryProps} = this.props;
        if (this.state.hasError) {
            if(CustomErrorBoundary) {
                const props = customErrorBoundaryProps || {};
                return <CustomErrorBoundary {...props} onReport={this.onReport}/>;
            }
            // You can render any custom fallback UI
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
