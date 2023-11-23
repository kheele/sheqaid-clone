import React from "react";
import {observer} from 'mobx-react';

import style from "./ClaimsContractorTab.lazy.css";

import {Dates} from "../../../../../utils/Utils";
import APageListReadWrite from "../../../../APageListReadWrite";
import ConfirmDialog from '../../../../../components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    ClearableInput,
    SelectEmployeeInput,
    SelectJobPositionInput
} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

import AClaimsTab from '../AClaimsTab';
import ChatBtn from "../../dialogs/ChatBtn";
import {getDocsStatus, getWClStatus} from "../../ClaimFuns";

//import NewClaimsContractorDialog from './dialogs/NewClaimsContractorDialog';
//import ProfileClaimsContractorDialog from './dialogs/ProfileClaimsContractorDialog';
//import EditClaimsContractorDialog from './dialogs/EditClaimsContractorDialog';

@observer
class ClaimsContractorTab extends AClaimsTab {

    path;
    pageKey = "ClaimsContractorTab";

    constructor(props) {
        super(props, style);

        this.path = props.path + 'claims/contractor/';
    }

    renderFilterNodeFirst(onChange) {
        return <React.Fragment>
            <SelectEmployeeInput name="employee" placeholder="Employee..." required className="col-lg-4 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}/>
            <SelectJobPositionInput name="occupation" placeholder="Occupation..." required className="col-lg-4 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}/>
            <ClearableInput name="status" type="select" placeholder="Status..." className="col-lg-2 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange} values={this.state.lists.status} returnValue/>
            <ClearableInput name="claim_status" type="select" placeholder="Claim Status..." className="col-lg-2 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange} values={this.state.lists.claim_status} returnValue/>
        </React.Fragment>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-30"></div>
            <div className="td fixed-flex min-w-55">ID #</div>
            <div className="td fixed-flex min-w-100">Ref #</div>
            <div className="td fixed-flex min-w-100">Claim #</div>
            <div className="td fixed-flex min-w-100">Accident Date</div>
            <div className="td fixed-flex min-w-100">Resume Date</div>
            <div className="td fixed-flex min-w-110">Status</div>
            <div className="td fixed-flex min-w-140">Claim Status</div>
            <div className="td w-auto">Company</div>
            <div className="td w-auto">Employee</div>
            <div className="td fixed-flex min-w-110">Injury/Disease</div>
            <div className="td fixed-flex min-w-150">Documents</div>
            <div className="td fixed-flex min-w-160">W.Cl Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at,
                company, client, project, site,
                //
                employee, employee_id,
                claim_number,
                accident_date,
                //
                wcl_2 = {},
                wcl_4 = {},
                wcl_5_list = [],
                wcl_6 = {},
                annexture_1 = {},
                //
                ref_num,
                status,
                claim_status,
                message_list_provider = []
            }
        } = item;

        const {date_resumed_work} = wcl_2 || {};
        console.log('Claim', toJS(item))

        return <TRow key={"item-" + n} className="w-full">
            <div className="td fixed-flex min-w-30 padding-0">
                <ChatBtn idx={n} item={item} onClick={this.onClickChat}/>
            </div>
            <div className="td fixed-flex min-w-55 padding-0">{id}</div>
            <div className="td fixed-flex min-w-100 padding-0">
                {ref_num || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-100">{claim_number || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{Dates.formatDate(accident_date) || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{Dates.formatDate(date_resumed_work) || 'N/A'}</div>
            <div className="td fixed-flex min-w-110">{status || 'N/A'}</div>
            <div className="td fixed-flex min-w-140">{claim_status || 'N/A'}</div>
            <div className="td w-auto">{(client || company) ? (client || company).name : "N/A"}</div>
            <div className="td w-auto">{employee ? employee.full_name : "N/A"}</div>
            <div className="td fixed-flex min-w-110">Injury</div>
            <div className="td fixed-flex grid-1 min-w-150 padding-t-3">{getDocsStatus(item)}</div>
            <div className="td fixed-flex grid-2 min-w-160 padding-t-3">{getWClStatus(item)}</div>
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

export default ClaimsContractorTab;
