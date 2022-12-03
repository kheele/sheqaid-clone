// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {onSelectLoadAssetConditions, onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from '../../utils';

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {Button, ClearableInput, SelectAssetTypeInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import ProfileToolWrittenOffDialog from './dialogs/ProfileToolWrittenOffDialog.js';

import style from "./ToolsWrittenOffTab.lazy.css";

// </editor-fold>

@observer
class ToolsWrittenOffTab extends React.Component {
    path;
    pageKey = "ToolsWrittenOffTab";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            manufacturers: [],
	    locations: [],
            conditions: ['New', 'Good', 'Fair', 'Poor']
	},
        loadedSelectLists: false
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'tools/written-off/';

        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }
    
    componentDidMount() {
        const loads = {manufacturers: onSelectLoadAssetManufacturers, locations: onSelectLoadAssetLocations, conditions: onSelectLoadAssetConditions};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                if(k === 'conditions') {
                    this.state.lists[k] = [...this.state.lists[k], ...res].distinct();
                } else {
                    this.state.lists[k] = res.distinct();
                }
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        if(!this.state.loadedSelectLists) {
            return <div className="col-lg-12 controls flex text-center">Loading...</div>;
        }
        return <div className="col-lg-12 controls -margin-b-35">
            <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="manufacturer" type="select" placeholder="Manufacturer..." className="col-lg-4 form-control" onChange={onChange} values={this.state.lists.manufacturers} returnValue/>
            <ClearableInput name="location" type="select" placeholder="Location..." className="col-lg-4 form-control" onChange={onChange} values={this.state.lists.locations} returnValue/>
            <ClearableInput name="condition" type="select" placeholder="Condition..." className="col-lg-4 margin-t-10 form-control" onChange={onChange} values={this.state.lists.conditions} returnValue/>
            <ClearableInput name="name" type="text" placeholder="Asset Name" className="col-lg-4 margin-t-10 form-control" onChange={onChange}/>
            {/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-80">Photo</div>
            <div className="td">Type</div>
            <div className="td">Name</div>
            <div className="td">Manufacturer</div>
            <div className="td fixed-flex min-w-100">Reg No.</div>
            <div className="td fixed-flex min-w-160">Serial No.</div>
            <div className="td fixed-flex min-w-80">Condition</div>
            <div className="td fixed-flex min-w-100">Status</div>
            <div className="td fixed-flex min-w-70 padding-l-0 padding-r-0"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {
                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/,
                name, asset_type, desc,
                manufacturer, model, serial_num, 
                location, toolkit, condition, 
                barcode_or_qr_code_type, barcode_or_qr_code, 
                notes,
                photo,
                acquisition_date, vendor, acquisition_value, warranty_expiry, reference_num
            }
        } = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-80">{RenderUtils.renderImage(photo)}</div>
            <div className="td">{asset_type}</div>
            <div className="td">{name || 'N/A'}</div>
            <div className="td">{manufacturer || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{reg_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-160">{serial_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-80">{condition || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{status}</div>
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
            pageId={this.pageKey + "-tab"}
            pageTitle="Tools Written Off"
            pageTitleSingular="tool written off"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <ProfileToolWrittenOffDialog ref="profileDialog"/>       
        </APageListReadWrite>;
    }
}

/*
 scan with phone qr/bar code
 Date, Surname, Name, Type of tools, Quantity, Reason, Employee Signature
 management approval/disaproval()
 */

export default ToolsWrittenOffTab;
