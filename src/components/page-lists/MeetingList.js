/* eslint-disable no-unused-vars */

import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

import style from "./MeetingList.lazy.css";

import {Dates} from '../../utils/Utils';
import APageListReadWrite from "../../views/APageListReadWrite";
import {Button} from '../inputs';
import {THead, TRow} from '../tables';

@observer
class MeetingList extends React.Component {
    static propTypes = {
        listCountTopTitle: PropTypes.string,
        pageTitle: PropTypes.string,
        createBtnTitle: PropTypes.string,
        path: PropTypes.string,
        renderLeftButtons: PropTypes.func,
        renderRightButtons: PropTypes.func,
        renderPopoverOptions: PropTypes.func,
        renderFilterNode: PropTypes.func,
        renderNewDialog: PropTypes.func,
        removeDialog: PropTypes.object,
        action: PropTypes.node
    };

    pageKey = "MeetingList";

    constructor() {
        super();

        this.renderItem = this.renderItem.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-95">Start</div>
            <div className="td fixed-flex min-w-95">End</div>
            <div className="td">Agenda</div>
            <div className="td fixed-flex"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {action} = this.props;
        const {id, data:{created_at, title, start, end, participants}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-95">{Dates.formatDateTimeExcYear(start)}</div>
            <div className="td fixed-flex min-w-95">{Dates.formatDateTimeExcYear(end)}</div>
            <div className="td">{title}</div>
            <div className="td fixed-flex">
                {this.renderAction(action, n, onClick)}
            </div>
        </TRow>;
    }

    renderAction(action, n, onClick) {
        if (isFunction(action)) {
            return action(n);
        }

        return action.type.name === 'Button' ? action : 
	<Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
            {action}
	</Button>;
    }

    render() {
        const {listCountTopTitle, pageTitle, createBtnTitle, hasCreateBtn, path, filterNodeFloat, renderLeftButtons, renderRightButtons, renderPopoverOptions, renderFilterNode, renderNewDialog, removeDialog, children} = this.props;
        const ConfirmDialog = removeDialog;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle={createBtnTitle}
            hasCreateBtn={hasCreateBtn}
            pageId={this.pageKey}
            listCountTopTitle={listCountTopTitle}
            pageTitle={pageTitle}
            pageTitleSingular="upcoming meeting"
            path={path}
            noAnimation={true}
            filterNodeFloat={filterNodeFloat}
            renderLeftButtons={renderLeftButtons}
            renderRightButtons={renderRightButtons}
            renderPopoverOptions={renderPopoverOptions}
            renderFilterNode={renderFilterNode}
            renderNewDialog={renderNewDialog}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            {!!ConfirmDialog && <ConfirmDialog ref="removeDialog"/>}
            {children}
        </APageListReadWrite>;
    }
}

export default MeetingList;
