import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

import {Dates} from "../../utils/Utils";

import APageListReadWrite from "../../views/APageListReadWrite";
import ConfirmDialog from '../dialogs/ConfirmDialog';
import {Button} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./ToolList.lazy.css";

@observer
class ToolList extends React.Component {
    static propTypes = {
        listCountTopTitle: PropTypes.string,
        pageTitle: PropTypes.string,
        createBtnTitle: PropTypes.string,
        renderLeftButtons: PropTypes.func,
        renderRightButtons: PropTypes.func,
        renderPopoverOptions: PropTypes.func,
        renderFilterNode: PropTypes.func,
        renderNewDialog: PropTypes.func,
        removeDialog: PropTypes.object,
        action: PropTypes.node
    };

    path = "plugin_sheq_assist/19_Maintenance/tools/";
    pageKey = "ToolList";

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
    
    get list(){
        return this.refs.root.list;
    }

    renderTHead() {
        return <THead className="align-left">
            <div className="td fixed-flex">ID</div>
            <div className="td fixed-flex min-w-150">Date</div>
            <div className="td">Category</div>
            <div className="td">Name</div>
            <div className="td fixed-flex"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {action} = this.props;
        const {id, created_at, data: {category, name, barcode_or_qr_code}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex">{id}</div>
            <div className="td fixed-flex min-w-150">{Dates.formatDate(created_at)}</div>
            <div className="td">{category}</div>
            <div className="td">{name}</div>
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
        const {listCountTopTitle, pageTitle, createBtnTitle, renderLeftButtons, renderRightButtons, renderPopoverOptions, renderFilterNode, renderNewDialog, removeDialog, onClick, children} = this.props;
        const ConfirmDialog = removeDialog;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle={createBtnTitle}
            pageId={this.pageKey}
            listCountTopTitle={listCountTopTitle}
            pageTitle={pageTitle}
            pageTitleSingular="tool"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={renderLeftButtons}
            renderRightButtons={renderRightButtons}
            renderPopoverOptions={renderPopoverOptions}
            renderFilterNode={renderFilterNode}
            renderNewDialog={renderNewDialog}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            onClick={onClick}>
            {!!ConfirmDialog && <ConfirmDialog ref="removeDialog"/>}
            {children}
        </APageListReadWrite>;
    }
}

export default ToolList;
