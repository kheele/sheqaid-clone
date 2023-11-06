import React from "react";
import {observer} from 'mobx-react';
import {computed, observable,} from 'mobx';

import {CircularProgress} from "@mui/material";
import APage from "views/APage";

import {Dates, getRandomRolor} from 'utils/Utils';

import style from "./Main.lazy.css";
import MKBox from "components/MK/MKBox";

@observer
class Main extends APage {
    static key = 'Dashboard';

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    render() {
        return (<div id="dashboard-page" className={this.classNames + " dashboard-page"}>
            <div className="page-title">
                {this.renderBackBtn()}<h3>Dashboard</h3>
            </div>
            <div className="page-content nice-scrollbars">
                <Stats ref="stats"/>
            </div>
        </div>);
    }
}

@observer
class Stats extends React.Component {

    render() {
        return <div className="stats">
            <StatsCount ref="statsCount"/>
        </div>;
    }
}

@observer
class StatsCount extends React.Component {

    @observable
    state = {
        aggregates: null,
        dataLoaded: false,
    };

    constructor() {
        super();
    }

    componentDidMount() {
        this.update();
    }

    update() {
        const date = Dates.formatDateSQL(new Date().addDays(-30));

        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
        const {selectedClient, selectedProject, selectedSite, selectedContractorSite} = storage.selected;
        const {loggedContractor} = storage;
        const {hasProjects, isConsultant} = storage.is;

        const company_id = sess_company_id;
        const client_id = isConsultant ? selectedClient && selectedClient.id : undefined;
        const project_id = selectedProject && selectedProject.id;
        const site_id = selectedSite && selectedSite.id;

        const listBy = sockets.of('dashboard').fn();
        listBy({
            company_id,
            client_id,
            project_id,
            site_id,
            //
            date,
        }).then(async res => {
            this.state.aggregates = res;
        }).catch(e => {
            console.error(e);
        }).finally(() => {
            this.state.dataLoaded = true;
        });
    }

    @computed
    get dataLoaded() {
        return this.state.dataLoaded;
    }

    render() {
        const {dataLoaded} = this;
        const {aggregates} = this.state;
        // if (!dataLoaded)
            return <CircularProgress/>;
        if (!aggregates) return null;

        const {
            new_employee_list_aggregate,
            new_asset_list_aggregate,
            new_claim_list_aggregate,

            nearmiss_incident_list_aggregate,
            lti_incident_list_aggregate,
            vehicle_incident_list_aggregate,

            open_incident_list_aggregate,
            open_ncr_list_aggregate,
            open_claim_list_aggregate,

            active_questionnaire_list_aggregate,
            active_inspection_list_aggregate,
            expired_document_list_aggregate,

            all_compliance_audit_list,
        } = aggregates;

        return <div className="stats-count grid-3 grid-gap-10">
            <Tile className="green" plugin="plugin2" module="New Employees" stat={new_employee_list_aggregate}
                  onClick={appBody.onOpenPage}/>
            <Tile className="green" plugin="plugin2" module="New Assets" stat={new_asset_list_aggregate}
                  onClick={appBody.onOpenPage}/>
            <Tile className="red" plugin="plugin2" module="New Claims" stat={new_claim_list_aggregate}
                  onClick={appBody.onOpenPage}/>

            <Tile className="green" plugin="plugin2" module="Nearmisses" stat={nearmiss_incident_list_aggregate}
                  onClick={appBody.onOpenPage}/>
            <Tile className="green" plugin="plugin2" module="Lost Time Injuries" stat={lti_incident_list_aggregate}
                  onClick={appBody.onOpenPage}/>
            <Tile className="red" plugin="plugin2" module="Vehicles Involved"
                  stat={vehicle_incident_list_aggregate}
                  onClick={appBody.onOpenPage}/>

            <Tile className="red" plugin="plugin2" module="Open Incidents" stat={open_incident_list_aggregate}
                  onClick={appBody.onOpenPage}/>
            <Tile className="red" plugin="plugin2" module="Open Non-Conformances" stat={open_ncr_list_aggregate}
                  onClick={appBody.onOpenPage}/>
            <Tile className="red" plugin="plugin2" module="Open Claims" stat={open_claim_list_aggregate}
                  onClick={appBody.onOpenPage}/>

            <Tile className="red" plugin="plugin2" module="Active Contractor Questionnaires"
                  stat={active_questionnaire_list_aggregate} onClick={appBody.onOpenPage}/>
            <Tile className="red" plugin="plugin2" module="Active Inspections"
                  stat={active_inspection_list_aggregate}
                  onClick={appBody.onOpenPage}/>
            <Tile className="blue" plugin="plugin2" module="Expired Documents"
                  stat={expired_document_list_aggregate}
                  onClick={appBody.onOpenPage}/>

            <Tile className="blue" plugin="plugin2" module="Audits" stat={all_compliance_audit_list}
                  onClick={appBody.onOpenPage}/>
        </div>;
    }
}

@observer
class Tile extends React.Component {

    render() {
        const {className, plugin, module, stat: {aggregate}} = this.props;
        const color = getRandomRolor();
        return <MKBox className={className} sx={{background: color}}>
            <h4>{module}</h4>
            <span className="counter">{aggregate.count}</span>
        </MKBox>;
        // return <Clickable plugin={plugin} module={module} onClick={appBody.onOpenPage}>
        //     <MKBox className={className} sx={{background: color}}>
        //         <Clickable plugin={plugin} module={module} onClick={appBody.onOpenPage}><h4>{module}</h4></Clickable>
        //         <Clickable plugin={plugin} module={module} onClick={appBody.onOpenPage}><div>{aggregate.count}</div></Clickable>
        //     </MKBox>
        // </Clickable>;
    }
}

export default Main;
