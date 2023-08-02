// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {onSelectLoadAssetConditions, onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from 'views/plugins/utils';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    ClearableInput,
    SelectAssetInput,
    SelectAssetTypeInput,
    SelectEmployeeInput, SelectPartInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ProfilePartDialog from './forms/ProfilePartDialog.js';
import EditPartDialog from './forms/EditPartDialog.js';

import style from "./PartsTab.lazy.css";
import NewPartDialog from "./forms/NewPartDialog";

// </editor-fold>

@observer
class PartsTab extends React.Component {
    path;
    pageKey = "PartsTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'parts/';

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="name" type="text" placeholder="Part Name"
                            className="col-lg-3 form-control" onChange={onChange}/>
            <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-3 form-control"
                                  onChange={onChange}/>
            <SelectAssetInput name="asset" placeholder="Asset..." className="col-lg-3 form-control"
                              onChange={onChange}/>
            <SelectEmployeeInput name="requested_by" placeholder="Requested By..." className="col-lg-3 form-control"
                              onChange={onChange}/>
            {/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-80">Photo</div>
            <div className="td">Asset Type</div>
            <div className="td">Name</div>
            <div className="td">Asset</div>
            <div className="td">Requested By</div>
            <div className="td fixed-flex min-w-140">Qty Requested</div>
            <div className="td fixed-flex min-w-140">Qty Ordered</div>
            <div className="td fixed-flex min-w-140">Orders Received</div>
            <div className="td fixed-flex min-w-100">Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id, data: {
                created_at, status,
                //1
                name, asset, asset_type, part_photo,
                //2
                requested_by, date_requested, request_reason, measurement_unit, qty_requested,
                //3
                approving_manager, approving_manager_date,
                approving_finance, approving_finance_date,
                //4
                qty_ordered, date_ordered,
                //5
                order_received_list
            }
        } = item;

        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-80">{RenderUtils.renderImage(part_photo)}</div>
            <div className="td">{asset_type}</div>
            <div className="td">{name}</div>
            <div className="td">{asset ? asset.name || asset : 'N/A'}</div>
            <div className="td">{requested_by ? requested_by.lname + ' ' + requested_by.fname : 'N/A'}</div>
            <div className="td fixed-flex min-w-140">{qty_requested}</div>
            <div className="td fixed-flex min-w-140">{qty_ordered}</div>
            <div className="td fixed-flex min-w-140">{order_received_list ? order_received_list.lists : 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{status}</div>
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
            pageTitle="Parts"
            pageTitleSingular="part"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewPartDialog ref="newDialog"/>
            <EditPartDialog ref="editDialog"/>
            <ProfilePartDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default PartsTab;
