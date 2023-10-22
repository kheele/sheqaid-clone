import React from "react";
import {observer} from 'mobx-react';

import style from "./InspectionTab.lazy.css";
import APageListReadWrite from "views/APageListReadWrite";
import ConfirmDialog from "components/dialogs/ConfirmDialog";
import {EditResponseDialog, NewQuestionnaireDialog, ProfileResponseDialog} from "../InspectionTab/forms";
import Popover from "components/popovers/Popover";
import {toJS} from "mobx";
import NavItem from "components/navs/NavItem";
import {ClearableInput} from "components/inputs";
import {THead} from "components/tables";
import InspectionTableRow from "./InspectionTableRow";

@observer
class InspectionTab extends React.Component {
    pageKey = "InspectionTab";

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onCopy = this.onCopy.bind(this);

//        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
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

        const listByLogged = sockets.of('inspections').fn('listCompletedByLogged');

        return listByLogged({
            name,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    //<editor-fold desc="actions">
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }
    //</editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {renderPopoverOptions, permissionKey} = this.props;
        if(renderPopoverOptions) {
            return renderPopoverOptions(idx, {onView, onEdit, onRemove, Options});
        }

        console.log('permissionKey', permissionKey)

        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
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
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td">Name</div>
            <div className="td fixed-flex min-w-140">Asset Type</div>
            <div className="td fixed-flex min-w-140">Asset</div>
            <div className="td fixed-flex min-w-180">Responsible Person</div>
            <div className="td fixed-flex min-w-80">Interval</div>
            <div className="td fixed-flex min-w-100">Start Date</div>
            <div className="td fixed-flex min-w-120">Date Scheduled</div>
            <div className="td fixed-flex min-w-160">Conducted On</div>
            <div className="td fixed-flex min-w-120">Next Schedule</div>
            <div className="td fixed-flex min-w-270">Progress</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        let item = this.refs.root.list[n];
        return <InspectionTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }

    render() {
        return <APageListReadWrite
          hasBackBtn={false}
          ref="root"
          page={this}
          createBtnTitle="Create"
          pageId={this.pageKey + "-tab"}
          pageTitle="Inspections"
          pageTitleSingular="inspection"
          onLoadList={this.onLoadList}
          noAnimation={true}
          onLoaded={this.onLoaded}
          renderLeftButtons={this.renderLeftButtons}
          renderPopoverOptions={this.renderPopoverOptions}
          renderFilterNode={this.renderFilterNode}
          renderTHead={this.renderTHead}
          renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            <NewQuestionnaireDialog ref="newDialog"/>
            <EditResponseDialog ref="editDialog"/>
            <ProfileResponseDialog ref="profileDialog"/>
            <Popover key="popover" ref="popover"/>
        </APageListReadWrite>;
    }
}

export default InspectionTab;
