import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import Popover from '../../../../components/popovers/Popover';
import {ClearableInput} from '../../../../components/inputs';
import {THead} from '../../../../components/tables';

import {InspectionTableRow} from './dialogs/InternalAuditComponents';

import NewCheckableDialog from './dialogs/NewCheckableDialog.js';

@observer
class ATab extends React.Component {

    @observable
    state = {
        lists: {
        }
    };

    constructor(props) {
        super(props);

        this.path = props.path;

//        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {renderPopoverOptions} = this.props;
        if(renderPopoverOptions) {
            return renderPopoverOptions(idx, {onView, onEdit, onRemove, Options});
        }
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="template" type="text" placeholder="Template" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-140">Date Created</div>
            <div className="td">Name</div>
            <div className="td">Template</div>
            <div className="td">Score</div>
            <div className="td">Conducted</div>
            <div className="td">Completed</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        let item = this.refs.root.list[n];
        return <InspectionTableRow idx={n} item={item} onClick={onClick}/>;
    }

    render() {
//        const {permissions_modules, permissions_other} = storage.loggedUser.user.data;
//        const permissions_mod = (permissions_modules || []).find(v => v.key === "__A_COVID_Management");
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");
        
        const {children, path, pageId, pageTitle, pageTitleSingular, type, NewDialog} = this.props;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={pageId}
            pageTitle={pageTitle}
            pageTitleSingular={pageTitleSingular}
            path={this.path}
            noAnimation={true}
            onLoaded={this.onLoaded}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <NewCheckableDialog ref="newDialog" title={pageTitleSingular.toTitleCase()} type={type} path={this.path}/>
            <Popover key="popover" ref="popover"/>
        </APageListReadWrite>;
    }
}

export default ATab;
