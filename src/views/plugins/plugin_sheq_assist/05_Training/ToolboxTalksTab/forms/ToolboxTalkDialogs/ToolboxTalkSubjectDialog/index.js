import React from "react";
import {observer} from 'mobx-react';

import {Dates, Permissions} from 'utils/Utils';
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";

import NewDialog from "./NewDialog";
import ProfileDialog from "./ProfileDialog";
import EditDialog from "./EditDialog";

import style from "./ToolboxTalkSubjectDialog.lazy.css";
import byLogged from "./Query/List/listAllToolboxTalkSubjectByLogged";

@observer
class ToolboxTalkSubjectDialog extends ADialogList {
    pageKey = "ToolboxTalkSubjectDialog";
    title = "Toolbox Talk Subjects";

    constructor(props) {
        super(props);
        
        this.onLoadList = this.onLoadList.bind(this);
        
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};
        
        const limit = 50;
        
        const args = {
            name,
            //
            limit,
            //
            exact_orgs: true,
        };
        
        if (!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }
        
        return byLogged(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    
    //</editor-fold>
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Toolbox Talk Subjects";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Date Created</div>
            <div className="td">Name</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, name}} = item;
        return <TRow key={id}>
            <div className="td">{Dates.formatDate(created_at)}</div>
            <div className="td">{name}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="Toolbox Talk Subject"
            pageTitleSingular="toolbox talk subject"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog" path={this.path}/>
            <ProfileDialog ref="profileDialog" path={this.path}/>
            <EditDialog ref="editDialog" path={this.path}/>
        </APageListReadWrite>;
    }

}

export default ToolboxTalkSubjectDialog;
