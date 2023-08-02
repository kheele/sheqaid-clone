import React from "react";
import {observer} from 'mobx-react';

import style from "./EnviroRATab.lazy.css";

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewEnviroRADialog from './dialogs/NewEnviroRADialog.js';
import ProfileEnviroRADialog from './dialogs/ProfileEnviroRADialog.js';

@observer
class EnviroRATab extends React.Component {
    path;
    pageKey = "EnviroRATab";

    constructor(props) {
        super(props);

        this.path = props.path + 'enviro-ra/';

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
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="title" type="text" placeholder="Title" className="form-control" onChange={onChange}/>
            <ClearableInput name="created_at" type="date" placeholder="Date Created..." className="form-control fixed-flex min-w-280" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-160">Date Created</div>
            <div className="td">Title</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, title, list}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(created_at)}</div>
            <div className="td">{title}</div>
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
            pageTitle="Environmental Risk Assessment"
            pageTitleSingular="environmental risk assessment"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewEnviroRADialog ref="newDialog"/>
            <ProfileEnviroRADialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default EnviroRATab;
