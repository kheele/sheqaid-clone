import React from "react";
import {observer} from 'mobx-react';

import APage from "../../../APage";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = 'Notes';
    static title = 'Notes';
    static faIconLeft = 'users';

    path = "human_resource/notes/";
    pageKey = "Notes";

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove}) {
        return <div key="popover">
            <NavItem key={"item-view-" + idx} onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem key={"item-edit-" + idx} onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem key={"item-remove-" + idx} onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </div>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="title" type="text" placeholder="Title" className="form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex">ID</div>
            <div className="td fixed-flex min-w-100">Date</div>
            <div className="td">Title</div>
            <div className="td fixed-flex"></div>
        </THead>;
    }

    renderItem(n, onClick) {
	const item = this.refs.root.list[n];
        const {id, data: {date, title}} = item;
	return <TRow key={"item-" + n}>
            <div className="td fixed-flex">{id}</div>
            <div className="td fixed-flex min-w-100">{date}</div>
            <div className="td">{title}</div>
            <div className="td fixed-flex">
            	<Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
	</TRow>;
    }
	
    render() {
	return <div id={this.pageKey + "-page"} className={this.pageKey + "-page page-content"}>
            <div className="page-title">
                {this.renderBackBtn()}
                <h3>Notes</h3>
            </div>
            <div className="page-content">
                <APageListReadWrite 
                    ref="root"
                    page={this}
                    hasBackBtn={false}
                    createBtnTitle="Create"
                    pageId={this.pageKey + "-notes-page"}
                    pageTitle="Notes"
                    pageTitleSingular="note"
                    path={this.path + 'notes/'}
                    renderPopoverOptions={this.renderPopoverOptions}
                    renderFilterNode={this.renderFilterNode}
                    renderTHead={this.renderTHead}
                    renderItem={this.renderItem}>
                    <ConfirmDialog ref="removeDialog"/>
                    <NewDialog ref="newDialog"/>
                    <ProfileDialog ref="profileDialog"/>
                    <EditDialog ref="editDialog"/>
                </APageListReadWrite>
                <APageListReadWrite 
                    ref="root"
                    page={this}
                    hasBackBtn={false}
                    createBtnTitle="Create"
                    pageId={this.pageKey + "-todos-page"}
                    pageTitle="Todo"
                    pageTitleSingular="todo"
                    path={this.path + 'todos/'}
                    renderPopoverOptions={this.renderPopoverOptions}
                    renderFilterNode={this.renderFilterNode}
                    renderTHead={this.renderTHead}
                    renderItem={this.renderItem}>
                    <ConfirmDialog ref="removeDialog"/>
                    <NewDialog ref="newDialog"/>
                    <ProfileDialog ref="profileDialog"/>
                    <EditDialog ref="editDialog"/>
                </APageListReadWrite>
                <APageListReadWrite 
                    ref="root"
                    page={this}
                    hasBackBtn={false}
                    createBtnTitle="Create"
                    pageId={this.pageKey + "-meeting-minutes-page"}
                    pageTitle="Meeting Minutes"
                    pageTitleSingular="meeting minutes"
                    path={this.path + 'minutes/'}
                    renderPopoverOptions={this.renderPopoverOptions}
                    renderFilterNode={this.renderFilterNode}
                    renderTHead={this.renderTHead}
                    renderItem={this.renderItem}>
                    <ConfirmDialog ref="removeDialog"/>
                    <NewDialog ref="newDialog"/>
                    <ProfileDialog ref="profileDialog"/>
                    <EditDialog ref="editDialog"/>
                </APageListReadWrite>
            </div>
	</div>;
    }
}

export default Main;
