// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {getRandomRolor, Permissions} from "../../../../utils/Utils";
import {convertQuestionnaireObjectToArray} from "../../../../utils/ArrayMapperUtils";

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewContractorDialog from './dialogs/NewContractorDialog.js';
import EditContractorDialog from './dialogs/EditContractorDialog.js';
import ProfileContractorDialog from './dialogs/ProfileContractorDialog.js';

import style from "./ContractorsTab.lazy.css";

// </editor-fold>

@observer
class ContractorsTab extends React.Component {
    path;
    pageKey = "ContractorsTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path;

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
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr/>
            <NavItem idx={idx} onClick={this.onOpen} faIconLeft="eye" title="Open"/>
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        const {isHasProjects} = storage.is;
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Contractor Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="username" type="text" placeholder="Email Address" className="form-control" onChange={onChange}/>
            {isHasProjects && <ClearableInput name="site_name" type="text" placeholder="Site" className="form-control" onChange={onChange}/>}
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {isHasProjects} = storage.is;
        return <THead>
            <div className="td">Contractor</div>
            <div className="td">Email Address</div>
            {isHasProjects && <div className="td fixed-flex min-w-100">Site(s)</div>}
            <div className="td fixed-flex min-w-180">Contractor's Pack?</div>
            <div className="td fixed-flex min-w-200">Questionnaires</div>
            <div className="td fixed-flex min-w-200">Compiance</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {name, username, inc_contractor_pack, site_list, questionnaire_list}} = item;
//        console.log('user', id, 'o', old_id, 'n', new_id, fname, lname)

        const {isHasProjects} = storage.is;
        
        return <TRow key={id} className="w-full" ignoreResize>
            <div className="td">{name}</div>
            <div className="td">{username}</div>
            {isHasProjects && <div className="td fixed-flex min-w-100">{site_list.length || 'N/A'}</div>}
            <div className="td fixed-flex min-w-180">{inc_contractor_pack}</div>
            <div className="td fixed-flex min-w-200 padding-r-10 flex td-stats">
                <Questions value={questionnaire_list}/>
            </div>
            <div className="td fixed-flex min-w-200 flex td-stats">
                <Compliance value={questionnaire_list}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {permissions_modules} = storage.loggedUser.user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === "__B_Contractors");
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Contractors"
            pageTitleSingular="contractor"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            loadOnScrolled={false}>
            {Permissions.allowRemove(permissions_mod) && !storage.is.isEmployee && <ConfirmDialog ref="removeDialog"/>}
            {Permissions.allowCreate(permissions_mod) && !storage.is.isEmployee && <NewContractorDialog ref="newDialog"/>}
            {Permissions.allowEdit(permissions_mod) && !storage.is.isEmployee && <EditContractorDialog ref="editDialog"/>}
            {Permissions.allowView(permissions_mod) && <ProfileContractorDialog ref="profileDialog"/>}
        </APageListReadWrite>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="Questions">
@observer
class Questions extends React.Component {
    
    @observable state = {
        value: null,
        loading: true
    };

    async componentDidMount() {
        const {props: {value}} = this;
        this.state.loading = true;
        
        const list = await value;
        
        const active = list.filter(({data}) => data.status !== "CompleteAccepted").length;
        const complete = list.filter(({data}) => data.status === "CompleteAccepted").length;
        
        this.state.value = {list, active, complete};
        this.state.loading = false;
    }
    
    render() {
        const {value, loading} = this.state;
        if(loading) {
            return <CircularProgress/>;
        }
        const {list, active, complete} = value;
        return <React.Fragment>
            <Stat title="All" value={list.length} className="fixed-flex min-w-55"/>
            <Stat title="Active" value={active} className="fixed-flex min-w-55"/>
            <Stat title="Complete" value={complete}/>
        </React.Fragment>;
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
        if(loading) {
            return <CircularProgress/>;
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
    
    @observable state = {
        value: null,
        loading: true
    };

    async componentDidMount() {
        const {props: {value}} = this;
        this.state.loading = true;
        
        const complete = value.filter(({data}) => data.status === "CompleteAccepted");
        const complianceList = await Promise.all(complete.map(calculateCompliance));
        
        const percList = complianceList.filter(v => v !== 'N/A');
        
        const lowest = percList.isEmpty() ? "N/A" : (Math.min(...percList).toFixed(1) + "%");
        const average = percList.isEmpty() ? "N/A" : ((percList.reduce((n1, n2) => n1 + n2, 0) / percList.length).toFixed(1) + "%");
        const highest = percList.isEmpty() ? "N/A" : (Math.max(...percList).toFixed(1) + "%");
        
        this.state.value = {lowest, average, highest};
        this.state.loading = false;
    }
    
    render() {
        const {value, loading} = this.state;
        if(loading) {
            return <CircularProgress/>;
        }
        const {lowest, average, highest} = value;
        return <React.Fragment>
            <Stat title="Lowest" value={lowest}/>
            <Stat title="Average" value={average}/>
            <Stat title="Highest" value={highest}/>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stat">
@observer
class Stat extends React.Component {
    
    render() {
        let {props: {title, value, className = ''}} = this;
        className += ' grid-1 flex-center font-size-12 color-white'
        const style = {background: getRandomRolor()};
        return <div style={style} className={className}>
            {title}
            <b>{value}</b>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="calculateCompliance">
async function calculateCompliance({data: {form: {questions}}}) {
    questions = await convertQuestionnaireObjectToArray(questions);
    questions = questions.
                map(v => v.questions || [v]).
                reduce((a1, a2) => [...a1, ...a2], []);
       
    const list = questions.filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);
        
    const score = list.map(({score}) => ((score && isNumber(score)) ? score : 0)).reduce((n1, n2) => n1 + n2, 0);
    const maxScore = list.map(({maxScore}) => maxScore).reduce((n1, n2) => n1 + n2, 0);
    
    const perc =  maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 'N/A';
    return perc;
}
// </editor-fold>
    
export default ContractorsTab;
