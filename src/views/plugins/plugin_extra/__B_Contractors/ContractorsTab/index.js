// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {Dates, getRandomRolor, Permissions} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, Clickable} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {NewContractorDialog, EditContractorDialog, ProfileContractorDialog} from '../forms';

import style from "./ContractorsTab.lazy.css";

// </editor-fold>

@observer
class ContractorsTab extends React.Component {
    path;
    pageKey = "ContractorsTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onAccept = this.onAccept.bind(this);
        this.onDecline = this.onDecline.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onRestore = this.onRestore.bind(this);
        this.onClickStatus = this.onClickStatus.bind(this);

        this.onOpen = this.onOpen.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            client_name,
            site_name,
            name,
            username,
        } = filterData || {};
        
        const {hasProjects, isConsultant,} = storage.is;
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
        const {selectedClient, selectedProject, selectedSite,} = storage.selected;
        
        const client_id = selectedClient && selectedClient.id;
        const project_id = selectedProject && selectedProject.id;
        const site_id = selectedSite && selectedSite.id;
        
        const listByLogged = sockets.of('contractors').fn('listByLogged');
        
        return listByLogged({
            hasProjects,
            isConsultant,
            sess_company_id,
            sess_my_client_id,
            sess_my_project_id,
            sess_my_site_id,
            client_id,
            project_id,
            site_id,
            //
            client_name,
            site_name,
            name,
            username,
            //
            exact_orgs: false,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onAccept">
    onAccept(e, btn) {
        const {idx, pending, declined} = btn.props;
        const item = this.refs.root.list[idx];
        const {
            data: {
                site_pending_list, site_accepted_list, site_declined_list, site_cancelled_list, site_removed_list,
            }
        } = item;

        let status = pending ? "Pending" : "Declined";
        this.refs.profileDialog.extraProp('status', status).open(item);

    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onDecline">
    onDecline(e, btn) {
        const {idx, status} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.profileDialog.extraProp('status', status).open(item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onRemove">
    onRemove(e, btn) {
        const {idx, status} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.profileDialog.extraProp('status', status).open(item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onRestore">
    onRestore(e, btn) {
        const {idx, status} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.profileDialog.extraProp('status', status).open(item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onClickStatus">
    onClickStatus(e, btn) {
        const {idx, title, value} = btn.props;
        const item = this.refs.root.list[idx];
        const {
            data: {
                site_pending_list, site_accepted_list, site_declined_list, site_cancelled_list, site_removed_list,
            }
        } = item;

        const isEmpty = site_pending_list.isEmpty() &&
            site_accepted_list.isEmpty() &&
            site_declined_list.isEmpty() &&
            site_cancelled_list.isEmpty() &&
            site_removed_list.isEmpty();

        if (isEmpty) {
            return infoDialog.open(`No ${title} sites found`);
        }

        this.refs.profileDialog.extraProp('status', title).open(item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onOpen">
    onOpen(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];

        defaultView.isOpen = false;
        mainView.isOpen = false;

        storage.login.loginContractor(item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {
            data: {
                site_pending_list, site_accepted_list, site_declined_list, site_cancelled_list, site_removed_list,
            }
        } = item;

        const pending = !site_pending_list.isEmpty();
        const declined = !site_declined_list.isEmpty();
        const cancelled = !site_cancelled_list.isEmpty();
        const accepted = !site_accepted_list.isEmpty();
        const removed = !site_removed_list.isEmpty();

        const showOpts = pending || declined || accepted || removed;

        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            {showOpts && <hr/>}
            {(pending || declined) && <NavItem
                idx={idx}
                pending={pending}
                declined={declined}
                onClick={this.onAccept}
                faIconLeft="check"
                title="Accept Site(s)"
            />}
            {(pending) && <NavItem
                idx={idx}
                status="Pending"
                onClick={this.onDecline}
                faIconLeft="ban"
                title="Decline Site(s)"
            />}
            {(accepted) && <NavItem
                idx={idx}
                status="Accepted"
                onClick={this.onRemove}
                faIconLeft="ban"
                title="Remove Site(s)"
            />}
            {(removed) && <NavItem
                idx={idx}
                status="Removed"
                onClick={this.onRestore}
                faIconLeft="check"
                title="Restore Site(s)"
            />}
            <hr/>
            <NavItem idx={idx} onClick={this.onOpen} faIconLeft="eye" title="Open"/>
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        const {hasProjects, isConsultant} = storage.is;
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Contractor Name" className="form-control"
                            onChange={onChange}/>
            <ClearableInput name="username" type="text" placeholder="Email Address" className="form-control"
                            onChange={onChange}/>
            {isConsultant && <ClearableInput name="client_name" type="text" placeholder="Client" className="form-control"
                                              onChange={onChange}/>}
            {hasProjects && <ClearableInput name="site_name" type="text" placeholder="Site" className="form-control"
                                              onChange={onChange}/>}
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {hasProjects} = storage.is;
        return <THead>
            <div className="td">Contractor</div>
            <div className="td">Email Address</div>
            {hasProjects && <div className="td fixed-flex min-w-100">Site(s)</div>}
            <div className="td fixed-flex min-w-180">Contractor's Pack?</div>
            <div className="td fixed-flex min-w-200">Questionnaires</div>
            <div className="td fixed-flex min-w-200">Compliance</div>
            <div className="td fixed-flex min-w-400">Site(s) Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                name, username, inc_contractor_pack, site_list,
                questionnaire_list_aggregate,
                questionnaire_active_list_aggregate,
                questionnaire_complete_list_aggregate,
                questionnaire_compliance_list_aggregate,
            }
        } = item;

        const {hasProjects} = storage.is;

        return <TRow key={id} className="w-full" ignoreResize>
            <div className="td">{name}</div>
            <div className="td">{username}</div>
            {hasProjects && <div className="td fixed-flex min-w-100">{site_list.length || 'N/A'}</div>}
            <div className="td fixed-flex min-w-180">{inc_contractor_pack}</div>
            <div className="td fixed-flex min-w-200 padding-r-10 flex td-stats">
                <Questions item={item}/>
            </div>
            <div className="td fixed-flex min-w-200 padding-r-10 flex td-stats">
                <Compliance item={item}/>
            </div>
            <div className="td fixed-flex min-w-400 padding-r-10 flex td-status">
                <Status item={item} idx={n} onClick={this.onClickStatus}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const permissionsKey = "__B_Contractors";
        const {isEmployee} = storage.is;
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Contractors"
            pageTitleSingular="contractor"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            loadOnScrolled={false}
        >
            <ConfirmDialog ref="removeDialog"/>
            <NewContractorDialog ref="newDialog"/>
            <EditContractorDialog ref="editDialog"/>
            <ProfileContractorDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="Status">
@observer
class Status extends React.Component {

    render() {
        const {
            onClick,
            idx,
            item: {
                data: {
                    site_pending_list,
                    site_accepted_list,
                    site_declined_list,
                    site_cancelled_list,
                    site_removed_list,
                }
            }
        } = this.props;

        const pending = site_pending_list.length;
        const declined = site_declined_list.length;
        const cancelled = site_cancelled_list.length;
        const accepted = site_accepted_list.length;
        const removed = site_removed_list.length;

        return <>
            <Stat idx={idx} title="Pending" value={pending} onClick={onClick}/>
            <Stat idx={idx} title="Declined" value={declined} onClick={onClick}/>
            <Stat idx={idx} title="Cancelled" value={cancelled} onClick={onClick}/>
            <Stat idx={idx} title="Accepted" value={accepted} onClick={onClick}/>
            <Stat idx={idx} title="Removed" value={removed} onClick={onClick}/>
        </>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Questions">
@observer
class Questions extends React.Component {

    render() {
        const {
            item: {
                data: {
                    questionnaire_list_aggregate,
                    questionnaire_active_list_aggregate,
                    questionnaire_complete_list_aggregate,
                }
            }
        } = this.props;

        return <>
            <Stat title="All" value={questionnaire_list_aggregate.aggregate.count} className="fixed-flex min-w-55"/>
            <Stat title="Active" value={questionnaire_active_list_aggregate.aggregate.count}
                  className="fixed-flex min-w-55"/>
            <Stat title="Complete" value={questionnaire_complete_list_aggregate.aggregate.count}/>
        </>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Requests">
@observer
class Requests extends React.Component {

    @observable state = {
        value: null,
        loading: true
    };

    async componentDidMount() {
        const {props: {value}} = this;
        this.state.loading = true;

        const list = await value;

        const requests = list.filter(({data}) => data.status === "CompleteRequested").length;
        const declines = list.filter(({data}) => data.status === "CompleteDeclined").length;

        this.state.value = {requests, declines};
        this.state.loading = false;
    }

    render() {
        const {value, loading} = this.state;
        if (loading) {
            return <CircularProgress className="fixed-center"/>;
        }
        const {requests, declines} = value;
        return <React.Fragment>
            <Stat title="Requested" value={requests} className="fixed-flex min-w-75"/>
            <Stat title="Declined" value={declines}/>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Compliance">
@observer
class Compliance extends React.Component {

    @computed get value() {
        const {
            item: {
                data: {
                    questionnaire_compliance_list_aggregate,
                }
            }
        } = this.props;

        const {
            nodes
        } = questionnaire_compliance_list_aggregate;

        const perc_list = nodes.map(({id, question_list_aggregate}) => {
            const {score, maxScore} = question_list_aggregate.aggregate.sum;
            const perc = maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 'N/A';
            return perc;
        }).filter(v => v !== 'N/A');

        const lowest = perc_list.isEmpty() ? "N/A" : (Math.min(...perc_list).toFixed(1) + "%");
        const average = perc_list.isEmpty() ? "N/A" : ((perc_list.reduce((n1, n2) => n1 + n2, 0) / perc_list.length).toFixed(1) + "%");
        const highest = perc_list.isEmpty() ? "N/A" : (Math.max(...perc_list).toFixed(1) + "%");

        return {lowest, average, highest};
    }

    render() {
        const {lowest, average, highest} = this.value;
        return <>
            <Stat title="Lowest" value={lowest}/>
            <Stat title="Average" value={average}/>
            <Stat title="Highest" value={highest}/>
        </>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stat">
@observer
class Stat extends React.Component {

    render() {
        let {props: {idx, title, value, className = '', onClick}} = this;
        className += ' grid-1 flex-center font-size-12 color-white'
        const style = {background: getRandomRolor()};
        return <Clickable idx={idx} title={title} value={value} onClick={onClick}>
            <div style={style} className={className}>
                {title}
                <b>{value}</b>
            </div>
        </Clickable>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="calculateCompliance">
// async function calculateCompliance({data: {question_list}}) {
//     question_list = all_question_list(question_list);
//
//     const list = question_list.filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);
//
//     const score = list.map(({score}) => ((score && isNumber(score)) ? score : 0)).reduce((n1, n2) => n1 + n2, 0);
//     const maxScore = list.map(({maxScore}) => maxScore).reduce((n1, n2) => n1 + n2, 0);
//
//     const perc =  maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 'N/A';
//     return perc;
// }
// </editor-fold>

export default ContractorsTab;
