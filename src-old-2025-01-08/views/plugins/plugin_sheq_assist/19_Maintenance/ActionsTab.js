import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./ActionsTab.lazy.css";

import APageListReadWrite from "views/APageListReadWrite";
import {Dates} from "utils/Utils";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewActionDialog from './dialogs/NewActionDialog.js';
import ProfileActionDialog from './dialogs/ProfileActionDialog.js';

@observer
class ActionsTab extends React.Component {
    path;
    pageKey = "ActionsTab";

    @observable
    state = {
    };
    
    constructor(props) {
        super(props);

        this.path = props.path + 'actions/';

        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
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
            <ClearableInput name="category" type="text" placeholder="Category" className="form-control" onChange={onChange}/>
            <ClearableInput name="location" type="text" placeholder="Location" className="form-control" onChange={onChange}/>
            <ClearableInput name="responsible_person" type="text" placeholder="Responsible Person" className="form-control" onChange={onChange}/>
            <ClearableInput name="due_date" type="date" placeholder="Due Date..." className="fixed-flex min-w-180 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Title</div>
            <div className="td">Category</div>
            <div className="td">Location</div>
            <div className="td">Responsible Person</div>
            <div className="td fixed-flex min-w-120">Due Date</div>
            <div className="td fixed-flex min-w-70 padding-l-0 padding-r-0"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, title, category, location, responsible_person, due_date}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{title}</div>
            <div className="td">{category}</div>
            <div className="td">{location}</div>
            <div className="td">{responsible_person.fname + ' ' + responsible_person.lname}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(due_date)}</div>
            <div className="td fixed-flex min-w-60 padding-l-0 padding-r-0">
                <Button idx={n} className="btn btn-primary pull-right w-40" onClick={onClick}>
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
            pageTitle="Actions"
            pageTitleSingular="action"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewActionDialog ref="newDialog"/>
            <ProfileActionDialog ref="profileDialog"/>        
        </APageListReadWrite>;
    }
}

export default ActionsTab;