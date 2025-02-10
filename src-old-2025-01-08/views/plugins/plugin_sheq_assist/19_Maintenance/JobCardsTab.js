// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from 'views/plugins/utils';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    ClearableInput,
    SelectAssetInput,
    SelectAssetTypeInput,
    SelectPartInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewJobCardDialog from "./forms/NewJobCardDialog";
import ProfileJobCardDialog from './PartsTab/forms/ProfilePartDialog.js';
import EditJobCardDialog from './PartsTab/forms/EditPartDialog.js';

import style from "./JobCardsTab.lazy.css";
// </editor-fold>

@observer
class JobCardsTab extends React.Component {
    path;
    pageKey = "JobCardsTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'job-cards/';

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
            <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-4 form-control"
                                  onChange={onChange}/>
            <SelectAssetInput name="asset" placeholder="Asset..." className="col-lg-4 form-control"
                              onChange={onChange}/>
            <SelectPartInput name="part" placeholder="Part Name..." className="col-lg-4 form-control"
                              onChange={onChange}/>
            {/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Asset Type</div>
            <div className="td">Asset</div>
            <div className="td fixed-flex min-w-120">Estimated Time</div>
            <div className="td fixed-flex min-w-100">Deadline</div>
            <div className="td fixed-flex min-w-170">Current ODO Reading</div>
            <div className="td fixed-flex min-w-140">Parts To Be Used</div>
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
                asset, asset_type, estimated_time, deadline, curr_odo_reading,
                //2
                job_instructions, additional_work_done,
                //3
                parts_used_list,
                //4
                time_management_list
            }
        } = item;

        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{RenderUtils.renderImage(part_photo)}</div>
            <div className="td">{asset_type}</div>
            <div className="td">{asset ? asset.name || asset : 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{estimated_time || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{deadline || 'N/A'}</div>
            <div className="td fixed-flex min-w-170">{curr_odo_reading || 'N/A'}</div>
            <div className="td fixed-flex min-w-140">{parts_used_list ? parts_used_list.length : 'N/A'}</div>
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

            <NewJobCardDialog ref="newDialog"/>
            <EditJobCardDialog ref="editDialog"/>
            <ProfileJobCardDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default JobCardsTab;
