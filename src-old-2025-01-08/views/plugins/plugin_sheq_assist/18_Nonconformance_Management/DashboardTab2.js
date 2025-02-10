// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {getRandomRolor} from 'utils/Utils';
import {Clickable} from 'components/inputs';

import style from "./DashboardTab.lazy.css";
import NCRItemListDialog from "./dialogs/NCRItemListDialog";

// </editor-fold>

@observer
class DashboardTab extends React.Component {
    static key = 'Dashboard';

    // <editor-fold defaultstate="collapsed" desc="constructor, componentWillMount, componentWillUnmount">
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    update() {
        this.refs.ncr.update();
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {path, permissionKey} = this.props;
        return <div id="DashboardTab" className={"DashboardTab-page"}>
            <div className="page-content flex nice-scrollbars">
                <ContentNCR ref="ncr" state={this.state} path={path} permissionKey={permissionKey}/>
            </div>
        </div>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="AContent">
@observer
class AContent extends React.Component {

    @observable state = {
        list: [],
        loadStatus: null
    };

    // <editor-fold defaultstate="collapsed" desc="constructor, componentDidMount">
    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update();
    }

    // </editor-fold>

    @computed get list() {
        return this.state.list;
    }

    update() {
        this.state.loadStatus = "LOADING";
        neonBinding.events.emit(`${this.props.path}list`).then(list => {
            this.state.list = list;
            this.state.loadStatus = "SUCCESS";
        }).catch(err => {
            this.state.loadStatus = "ERROR";
        });
    }

}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentNCR">
@observer
class ContentNCR extends AContent {

    constructor(props) {
        super(props);

        this.onClickModule = this.onClickModule.bind(this);
    }

    onClickModule(evt, el) {
        const {value: list, title: source} = el.props;

        const {ncrItemListDialog} = this.refs;
        ncrItemListDialog && ncrItemListDialog.extraProp('source', source).open(list);
    }

    //type
    @computed get typeCorrectiveActionList() {
        const {list} = this;
        return list.filter(({data}) => data.type === "Corrective Action");
    }

    @computed get typePreventativeActionList() {
        const {list} = this;
        return list.filter(({data}) => data.type === "Preventative Action");
    }

    @computed get typeOpportunityForImproverList() {
        const {list} = this;
        return list.filter(({data}) => data.type === "Opportunity For Improver");
    }

    @computed get typeUnclassifiedList() {
        const {list} = this;
        return list.filter(({data}) => !data.type);
    }

    //priority
    @computed get priorityLowList() {
        const {list} = this;
        return list.filter(({data}) => data.priority === "Low");
    }

    @computed get priorityMediumList() {
        const {list} = this;
        return list.filter(({data}) => data.priority === "Medium");
    }

    @computed get priorityHighList() {
        const {list} = this;
        return list.filter(({data}) => data.priority === "High");
    }

    @computed get priorityCriticalList() {
        const {list} = this;
        return list.filter(({data}) => data.priority === "Critical");
    }

    @computed get priorityUnclassifiedList() {
        const {list} = this;
        return list.filter(({data}) => !data.priority);
    }

    //status
    @computed get statusPendingList() {
        const {list} = this;
        return list.filter(({data}) => data.status === 'Pending');
    }

    @computed get statusProgressList() {
        const {list} = this;
        return list.filter(({data}) => data.status === 'Progressed');
    }

    @computed get statusApprovedList() {
        const {list} = this;
        return list.filter(({data}) => data.status === 'Approved');
    }

    @computed get statusRejectedList() {
        const {list} = this;
        return list.filter(({data}) => data.status === 'Rejected');
    }

    @computed get statusCompletedList() {
        const {list} = this;
        return list.filter(({data}) => data.status === 'Completed');
    }

    @computed get statusUnclassifiedList() {
        const {list} = this;
        return list.filter(({data}) => !data.status);
    }

    //result
    @computed get resultPassList() {
        const {list} = this;
        return list.filter(({data}) => data.result === 'Pass');
    }

    @computed get resultFailList() {
        const {list} = this;
        return list.filter(({data}) => data.result === 'Fail');
    }

    @computed get resultUnclassifiedList() {
        const {list} = this;
        return list.filter(({data}) => !data.result);
    }

    //source
    @computed get sourceSiteAuditList() {
        const {list} = this;
        return list.filter(({data}) => data.source === 'Site Audit');
    }

    @computed get sourceComplianceAuditList() {
        const {list} = this;
        return list.filter(({data}) => data.source === 'Compliance Audit');
    }

    @computed get sourceInspectionList() {
        const {list} = this;
        return list.filter(({data}) => data.source === 'Inspection');
    }

    @computed get sourceIncidentInvestigationList() {
        const {list} = this;
        return list.filter(({data}) => data.source === 'Incident Investigation');
    }

    render() {
        const {list, state: {loadStatus}, props: {path, permissionKey}} = this;
        if (!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if (loadStatus === "ERROR") {

        }
        return <React.Fragment>
            <div
                className="StatsByModule margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top fixed-flex min-w-500">
                <h4 className="margin-0 min-h-20 text-center">Stats By Module</h4>
                <div className="margin-0 grid-1 grid-gap-10">
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <div className="margin-0 grid-1 grid-gap-10 fixed-flex h-full">
                            <Stats value={this.sourceSiteAuditList} title='Site Audit' onClick={this.onClickModule}/>
                            <Stats value={this.sourceComplianceAuditList} title='Compliance Audit'
                                   onClick={this.onClickModule}/>
                            <Stats value={this.sourceInspectionList} title='Inspection'
                                   onClick={this.onClickModule}/>
                            <Stats value={this.sourceIncidentInvestigationList} title='Incident Investigation'
                                   onClick={this.onClickModule}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="StatsByAttributes margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="margin-0 min-h-20 text-center">Stats By Non-Conformance Attributes</h4>
                <div className="margin-0 grid-1 grid-gap-10">
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Type</h4>
                        <div className="margin-0 grid-4 grid-gap-10 fixed-flex">
                            <Stats value={this.typeCorrectiveActionList} title='Corrective Action'/>
                            <Stats value={this.typePreventativeActionList} title='Preventative Action'/>
                            <Stats value={this.typeOpportunityForImproverList} title='Opportunity For Improver'/>
                            <Stats value={this.typeUnclassifiedList} title='Unclassified'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Priority</h4>
                        <div className="margin-0 grid-5 grid-gap-10 fixed-flex">
                            <Stats value={this.priorityLowList} title='Low'/>
                            <Stats value={this.priorityMediumList} title='Medium'/>
                            <Stats value={this.priorityHighList} title='High'/>
                            <Stats value={this.priorityCriticalList} title='Critical'/>
                            <Stats value={this.priorityUnclassifiedList} title='Unclassified'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Status</h4>
                        <div className="margin-0 grid-3 grid-gap-10 fixed-flex">
                            <Stats value={this.statusPendingList} title='Pending'/>
                            <Stats value={this.statusProgressList} title='Progressed'/>
                            <Stats value={this.statusApprovedList} title='Approved'/>
                            <Stats value={this.statusRejectedList} title='Rejected'/>
                            <Stats value={this.statusCompletedList} title='Completed'/>
                            <Stats value={this.statusUnclassifiedList} title='Unclassified'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Result</h4>
                        <div className="margin-0 grid-3 grid-gap-10 fixed-flex">
                            <Stats value={this.resultPassList} title='Pass'/>
                            <Stats value={this.resultFailList} title='Fail'/>
                            <Stats value={this.resultUnclassifiedList} title='Unclassified'/>
                        </div>
                    </div>
                </div>
            </div>

            <NCRItemListDialog ref="ncrItemListDialog" path={path} permissionKey={permissionKey}/>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {

    @observable state = {
        value: null,
        loading: true
    };

    async componentDidMount() {
        const {props: {value}} = this;
        this.state.loading = true;
        if (value instanceof Promise) {
            this.state.value = await value;
        } else {
            this.state.value = value;
        }
        this.state.loading = false;
    }

    render() {
        const {props: {title, className = "", onClick}} = this;
        const {value, loading} = this.state;
//        console.log('value', value)
        const style = {background: getRandomRolor()};
        return <Clickable value={value} title={title} onClick={onClick}>
            <div style={style} className={"padding-10 Statistics min-h-100 " + className}>
                <label className="text-center w-full margin-b-10">{title}</label>
                <div className="content">
                    {loading && <CircularProgress/>}
                    {!loading && ((isArray(value) || isObservableArray(value)) ? value.length : value)}
                </div>
            </div>
        </Clickable>;
    }
}

// </editor-fold>

export default DashboardTab;
