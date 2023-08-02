import React from "react";
import {observer} from 'mobx-react';

import style from "./ClaimsEmployeeTab.lazy.css";

import {Dates} from "utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

//import ProfileClaimsEmployeeDialog from './dialogs/ProfileClaimsEmployeeDialog';

@observer
class ClaimsEmployeeTab extends React.Component {

    path;
    pageKey = "ClaimsEmployeeTab";

    constructor(props) {
        super(props, style);

        this.path = props.path + 'claims/employee/';
    }

    renderFilterNodeFirst(onChange) {
        return <React.Fragment>
            <ClearableInput name="status" type="select" placeholder="Status..." className="col-lg-6 col-xs-12 form-control margin-b-10" onChange={onChange} values={this.state.lists.status} returnValue/>
            <ClearableInput name="claim_status" type="select" placeholder="Claim Status..." className="col-lg-6 col-xs-12 form-control margin-b-10" onChange={onChange} values={this.state.lists.claim_status} returnValue/>
        </React.Fragment>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-100">MCR Ref #</div>
            <div className="td fixed-flex min-w-120">Claim #</div>
            <div className="td fixed-flex min-w-120">Accident Date</div>
            <div className="td fixed-flex min-w-120">Resume Date</div>
            <div className="td">Status</div>
            <div className="td">Claim Status</div>
            <div className="td">Injury/Disease</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, _target, client, project, site, type, doc, list}} = item;
//        console.log('ClaimsEmployee', item)
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{_target === "Client" ? "Company" : _target}</div>
            
            {RenderUtils.renderOrgTD(client, null, 'Company')}
            {RenderUtils.renderOrgTD(project, null, 'Project')}
            {RenderUtils.renderOrgTD(site, null, 'Site')}
            
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Client Claims"
            pageTitleSingular="claim"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
        </APageListReadWrite>;
    }
}

export default ClaimsEmployeeTab;
