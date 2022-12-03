import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button} from '../components/inputs';

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
        const data = {
            message: error.message || "", 
            stack: error.stack || "", 
            error_info: errorInfo.componentStack || ""
        };
        
        const {is: {isLoggedIn, isConsultant}} = storage;
        if(isLoggedIn) {
            const {loggedUser = {}, selected = {}, loggedContractor} = storage;
            const {access_type, company = {}, user = {}} = loggedUser;
            const {data: user_data = {}} = user;
            
            const {client, project, site, contractor} = user_data;
            
            const {selectedClient, selectedProject, selectedSite, selectedContractorSite} = selected;
            
            data.access_type = access_type;
            
            data.company = company;
            if(isConsultant) {
                data.client = client;
                data.project = project;
                data.site = site;

                data.selectedClient = selectedClient;
                data.selectedProject = selectedProject;
                data.selectedSite = selectedSite;
            }
            data.contractor = contractor;
            data.loggedContractor = loggedContractor;
            data.selectedContractorSite = selectedContractorSite;
            
            data.user = user;
        }
                
        btn.text("Reporting...").disabled();
        neonBinding.events.emit("error-reporting/create", data).then(res => {
            infoDialog.open(<React.Fragment>
                        <p>Problem successfully reported!</p> 
                        <p>We will fix it as soon as possible.</p>    
                    </React.Fragment>);
            infoDialog.close(5000);
        }).finally(() => {
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