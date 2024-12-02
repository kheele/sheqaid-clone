// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from 'views/plugins/utils';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ClearableInput, SelectAssetTypeInput} from 'components/inputs';
import {THead} from 'components/tables';

import style from "./ToolsWrittenOffTab.lazy.css";
import {updateAsset} from "mutations/update";
import ProfileToolDialog from "./forms/ProfileToolDialog";
import {listAssets} from "mutations/listByLogged";
import AssetsRenderRow from "./AssetsRenderRow";

// </editor-fold>

@observer
class ToolsWrittenOffTab extends React.Component {
    pageKey = "ToolsWrittenOffTab";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            manufacturers: [],
            locations: [],
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap']
        },
        loadedSelectLists: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onReInstead = this.onReInstead.bind(this);

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
        const loads = {
            manufacturers: onSelectLoadAssetManufacturers,
            locations: onSelectLoadAssetLocations,
        };
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k] = res.distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
            reg_num,
            serial_num,
            model,
            condition,
            location,
            manufacturer,
            asset_type,
        } = filterData || {};

        return listAssets({
            written_off: true,
            //
            name,
            reg_num,
            serial_num,
            model,
            condition,
            location,
            manufacturer,
            asset_type,
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

    // <editor-fold defaultstate="collapsed" desc="onReInstead">
    onReInstead(evt, btn) {
        confirmDialog.open("Are you sure you want to re-instead the asset?").then(res => {
            if (res === 1) {
                const {idx} = btn.props;
                const {list} = this.refs.root;
                const item = list[idx];
                progressDialog.open("Re-insteading the asset...");
                updateAsset({id: item.id, written_off: false}).then(res => {
                    setTimeout(() => {
                        list.removeIf((item, _idx) => _idx === idx);
                    });
                    infoDialog.open("Asset successfully re-insteaded.");
                    infoDialog.close(2000);
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    progressDialog.close();
                });
            }
        });
    }

    // </editor-fold>

    //<editor-fold desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="remove" idx={idx} onClick={this.onReInstead} faIconLeft="ban" title="Re-Instead"/>
        </Options>;
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        if (!this.state.loadedSelectLists) {
            return <div className="col-lg-12 controls flex text-center">Loading...</div>;
        }
        return <div className="col-lg-12 controls -margin-b-35">
            <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-4 form-control"
                                  onChange={onChange}/>
            <ClearableInput name="manufacturer" type="select" placeholder="Manufacturer..."
                            className="col-lg-4 form-control"
                            onChange={onChange} values={this.state.lists.manufacturers} returnValue/>
            <ClearableInput name="location" type="select" placeholder="Location..." className="col-lg-4 form-control"
                            onChange={onChange} values={this.state.lists.locations} returnValue/>
            <ClearableInput name="condition" type="select" placeholder="Condition..."
                            className="col-lg-4 margin-t-10 form-control" onChange={onChange}
                            values={this.state.lists.conditions} returnValue/>
            <ClearableInput name="name" type="text" placeholder="Asset Name"
                            className="col-lg-4 margin-t-10 form-control"
                            onChange={onChange}/>
            <ClearableInput name="reg_num" type="text" placeholder="Registration No."
                            className="col-lg-4 margin-t-10 form-control"
                            onChange={onChange}/>
            <ClearableInput name="serial_num" type="text" placeholder="Serial No."
                            className="col-lg-4 margin-t-10 form-control"
                            onChange={onChange}/>
            <ClearableInput name="model" type="text" placeholder="Model" className="col-lg-4 margin-t-10 form-control"
                            onChange={onChange}/>
            {/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
        </div>;
    }

    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Asset Name</div>
            <div className="td">Manufacturer</div>
            <div className="td">Location</div>
            <div className="td fixed-flex min-w-100">Reg No.</div>
            <div className="td fixed-flex min-w-160">Serial No.</div>
            <div className="td fixed-flex min-w-80">Condition</div>
            <div className="td">Reason Written Off</div>
            <div className="td">Written Off Comments</div>
            <div className="td fixed-flex min-w-120">Date Written Off</div>
            <div className="td fixed-flex min-w-70 padding-l-0 padding-r-0"></div>
        </THead>;
    }

    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <AssetsRenderRow
            item={item}
            idx={n}
            onClick={onClick}
            onView={this.refs.root.onView}
            onChangeStatus={this.onChangeStatus}
            isRemoved
        />
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            pageId={this.pageKey + "-tab"}
            pageTitle="Tools Written Off"
            pageTitleSingular="tool written off"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <ProfileToolDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }

    //</editor-fold>
}

/*
 scan with phone qr/bar code
 Date, Surname, Name, Type of tools, Quantity, Reason, Employee Signature
 management approval/disaproval()
 */

export default ToolsWrittenOffTab;
