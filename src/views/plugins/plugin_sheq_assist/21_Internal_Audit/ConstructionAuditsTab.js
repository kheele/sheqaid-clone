import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewContractorsAuditDialog from './dialogs/NewContractorsAuditDialog.js';
//import ProfileNCRDialog from './dialogs/ProfileNCRDialog';
import style from "./ConstructionAuditsTab.lazy.css";

@observer
class ConstructionAuditsTab extends React.Component {
    path;
    pageKey = "ConstructionAuditsTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'construction-audits/';

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="date" type="date" placeholder="Audit Date" className="form-control" onChange={onChange}/>
            <ClearableInput name="auditor" type="text" placeholder="Auditor" className="form-control" onChange={onChange}/>
            <ClearableInput name="company" type="text" placeholder="Company" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-110">Date Created</div>
            <div className="td fixed-flex min-w-110">Audit Date</div>
            <div className="td">Audit Type</div>
            <div className="td">Auditor</div>
            <div className="td">Scope Of Audit</div>
            <div className="td">Company</div>
            <div className="td fixed-flex min-w-195">Company Representative</div>
            <div className="td fixed-flex min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, date, type, auditor, scope, company, representative}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
            <div className="td">{type}</div>
            <div className="td">{auditor}</div>
            <div className="td">{scope}</div>
            <div className="td">{company}</div>
            <div className="td fixed-flex min-w-195">{representative}</div>
            <div className="td fixed-flex min-w-60">
                <Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
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
            pageTitle="Construction Audits"
            pageTitleSingular="construction audit"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewContractorsAuditDialog ref="newDialog"/>
            {/*<ProfileNCRDialog ref="profileDialog"/>*/}
        </APageListReadWrite>;
    }
}

export default ConstructionAuditsTab;
