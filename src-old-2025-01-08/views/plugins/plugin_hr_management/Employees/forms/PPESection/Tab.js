import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APageListReadWrite from "views/APageListReadWrite";
import ConfirmDialog from "components/dialogs/ConfirmDialog";
import Popover from "components/popovers/Popover";
import {ClearableInput, SelectQuestionnaireTemplateInput} from "components/inputs";
import {THead} from "components/tables";
import NavItem from "components/navs/NavItem";
import TableRow from "./TableRow";

//<editor-fold desc="Tab">
@observer
class Tab extends React.Component {
    pageKey = "Tab";

    @observable state = {};

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onSign = this.onSign.bind(this);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    get isPending() {
        const {status} = this.props;
        return status === 'Pending';
    }

    get isCompleted() {
        const {status} = this.props;
        return status === 'Completed';
    }

    //</editor-fold>

    onSign(evt, btn) {

    }

    //<editor-fold desc="onLoadList">
    async onLoadList(params = {}) {
        const {status: _status} = this.props;
        const {
            item: {
                id, data: {
                    signable_doc_submitter_list = [],
                }
            }
        } = this.props;

        // const {item: asset, fn} = this.props;
        // const {page, lastItem, filterData, filtered, isNew} = params;
        // const {
        //     name,
        //     interval,
        //     template_id,
        //     asset_type,
        //     asset: asset2,
        // } = filterData || {};
        //
        // const today = Dates.formatDateSQL(new Date());
        //
        // const listByLogged = sockets.of('inspections').fn(fn);

        return signable_doc_submitter_list.map(({id, ...attrs}) => (
            {id, data: attrs}
        )).filter((
            {
                id,
                data: {status}
            }
        ) => status === _status);
    }

    //</editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {renderPopoverOptions, permissionKey, isUpcoming, unanswered} = this.props;
        if (renderPopoverOptions) {
            return renderPopoverOptions(idx, {onView, onEdit, onRemove, Options});
        }

        console.log('permissionKey', permissionKey)

        const item = this.refs.root.list[idx];
        const {
            id, data: {
                status,
                employee_id,
            }
        } = item;

        const {is: {isEmployee}, loggedUser: {user, user: {data: {linked_employee_id}}}} = storage;

        if (isEmployee) {
            const isLoggedUser = employee_id === user.id;
            return <Options idx={idx}>
                <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            </Options>;
        }

        let isLoggedUser = employee_id === linked_employee_id;

        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        const listByLogged = sockets.of('inspections').fn('listTemplatesByLogged');

        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput
                name="status"
                type="select"
                placeholder="Interval..."
                className="form-control"
                onChange={onChange}
                values={this.state.lists.interval}
                returnValue
            />
            <SelectQuestionnaireTemplateInput
                name="template"
                placeholder="Template..."
                className="form-control"
                byLogged={listByLogged}
                onChange={onChange}
            />
        </div>;
    }

    renderTHead() {
        const {isPending, isCompleted} = this;
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td">Document Name</div>
            <div className="td fixed-flex min-w-120">Date Sent</div>
            <div className="td fixed-flex min-w-120">Date Opened</div>
            {isCompleted && <div className="td fixed-flex min-w-120">Date Completed</div>}
            <div className="td fixed-flex min-w-120">Status</div>
            {isPending && <div className="td fixed-flex min-w-80">Action</div>}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const {status} = this.props;
        let item = this.refs.root.list[n];
        return <TableRow key={item.id} idx={n} item={item} status={status} onSign={this.onSign} onClick={onClick}/>;
    }

    render() {
        const {pageId, pageTitle, pageTitleSingular,} = this.props;
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={pageId}
            className="SignableDocTab"
            pageTitle={pageTitle}
            pageTitleSingular={pageTitleSingular}
            onLoadList={this.onLoadList}
            noAnimation={true}
            onLoaded={this.onLoaded}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <Popover key="popover" ref="popover"/>
        </APageListReadWrite>;
    }
}

//</editor-fold>

export default Tab;
