// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {
    Button,
    ClearableInput, Clickable, DateRangeInput, SelectAssetInput, SelectAssetTypeInput,
    SelectClientInput, SelectEmployeeInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import style from "./ExportAssetDocsDialog.lazy.css";
import {AControls, AExportDialog} from "components/exports/AExportDialog";
import {onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from "../../../utils";
import assetProfilePic from "assets/images/vehicle-image-loading.png";
import ProfileToolDialog from "../ToolsTab/forms/ProfileToolDialog";
import AssetDocsRenderRow from "../DocsTab/AssetDocsRenderRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportAssetDocsDialog extends AExportDialog {
    className = "ExportAssetDocsDialog";
    titleSingular = 'Asset Document';
    titlePlural = 'Assets Documents';
    
    componentWillMount() {
        super.componentWillMount();
        style.use();
    }
    
    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }
    
    get excludePDF() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends AControls {
    exportFn = sockets.of('assets/docs').fn('export-excel');

    @observable
    state = {
        lists: {
            manufacturers: [],
            locations: [],
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap'],
            type: [
                'Clearance Certificate',
                'Vehicle Registration Certificate',
                'Work Manual',
                'Work Procedure',
                'Break Test Report',
                'Certificate of Fitness (C.O.F)',
                'Invoice',
                'Vehicle License',
                'LUX Test Report',
            ],
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {
                label: '1 month',
                value: 1
            }, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
        },
        searchList: [],
        loadedSelectLists: false
    };
    @observable
    filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        asset_id: null,
        //
        // responsible_person_list: null,
        asset_type: null,
        manufacturer: null,
        location: null,
        condition: null,
        reg_num: null,
        serial_num: null,
        //
        type: null,
        title: null,
        //
        date: null,
        expiry_date: null,
        date_range: null,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onView = this.onView.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentMount">
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

    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            client_id,
            project_id,
            site_id,
            //
            date,
            expiry_date,
            date_range,
            //
            // responsible_person_list,
            //
            type,
            title,
            asset_id,
            //
            reg_num,
            manufacturer,
            location,
            asset_type,
            condition,
            status,
        } = filterData || {};

        const listByLogged = sockets.of('assets/docs').fn('listByLogged');

        return listByLogged({
            written_off: false,
            view: 'EACH',
            client_id,
            project_id,
            site_id,
            //
            date,
            expiry_date,
            date_range,
            //
            // responsible_person_list,
            //
            type,
            title,
            asset_id,
            //
            reg_num,
            manufacturer,
            location,
            asset_type,
            condition,
            status,
            //
            exact_orgs: true,
            data_export: true,
            //
            limit: 0,
            offset: 0,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>
    
    onView(evt, el) {
        const {profileDialog} = this.refs;
        const {id} = el.props;
        const item = this.state.searchList.find(v => v.id === id);
        profileDialog && item && profileDialog.open(item);
    }

    renderTHeadFrom() {
        return <THead>
            {/*<div className="td fixed-flex min-w-50">ID</div>*/}
            <div className="td fixed-flex min-w-80">Photo</div>
            <div className="td">Asset Type</div>
            <div className="td">Asset</div>
            <div className="td">Reg. No.</div>
            <div className="td">Serial No.</div>
            <div className="td">Document Title</div>
            <div className="td">Document Type</div>
            <div className="td fixed-flex min-w-105">Date</div>
            <div className="td fixed-flex min-w-105">Expiry Date</div>
            <div className="td fixed-flex min-w-80 padding-0"></div>
        </THead>;
    }

    renderItemFrom(item, n) {
        return <AssetDocsRenderRow key={item.id} idx={n} item={item} view="Document" isExport/>;
    }

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        if (!this.state.loadedSelectLists) {
            return <div className="col-lg-12 controls flex text-center">Loading...</div>;
        }
        const {onChange} = this.form;

        return <>
            {/*<SelectEmployeeInput ref="responsible_person_list" name="responsible_person_list"*/}
            {/*                     placeholder="Responsible Person..." type="select_multi"*/}
            {/*                     className="col-lg-12 form-control" onChange={onChange}/>*/}
            {/*<hr className="pull-left no-border bg-ddd h-2"/>*/}
            <SelectAssetInput ref="asset" name="asset" placeholder="Asset..." className="col-lg-12 form-control"
                              onChange={onChange}/>
            <SelectAssetTypeInput ref="asset_type" name="asset_type" placeholder="Asset Type..."
                                  className="col-lg-12 form-control"
                                  onChange={onChange}/>
            <ClearableInput ref="manufacturer" name="manufacturer" type="select" placeholder="Manufacturer..."
                            className="col-lg-12 form-control"
                            onChange={onChange} values={this.state.lists.manufacturers} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="location" name="location" type="select" placeholder="Location..."
                            className="col-lg-12 form-control"
                            onChange={onChange} values={this.state.lists.locations} returnValue/>
            <ClearableInput ref="condition" name="condition" type="select" placeholder="Condition..."
                            className="col-lg-12 form-control" onChange={onChange}
                            values={this.state.lists.conditions} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="reg_num" name="reg_num" type="text" placeholder="Registration No."
                            className="col-lg-12 form-control"
                            onChange={onChange}/>
            <ClearableInput ref="serial_num" name="serial_num" type="text" placeholder="Serial No."
                            className="col-lg-12 form-control"
                            onChange={onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="title" name="title" type="text" placeholder="Document Title"
                            className="col-lg-12 form-control"
                            onChange={onChange}/>
            <ClearableInput ref="type" name="type" type="select" placeholder="Document Type..."
                            className="col-lg-12 form-control" onChange={onChange}
                            values={this.state.lists.type} returnValue/>

            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
                            values={this.state.lists.expiry_date} returnValue/>
            <DateRangeInput ref="date_range" name="date_range"
                            className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Expiry Date Range"
                            onChange={onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            {/*<DateRangeInput ref="progress_date_range" name="progress_date_range"*/}
            {/*                className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Progress Date Range"*/}
            {/*                onChange={onChange}>*/}
            {/*    <label className="min-w-65">From</label>*/}
            {/*    <label className="min-w-50">To</label>*/}
            {/*</DateRangeInput>*/}
            {/*<DateRangeInput ref="completed_date_range" name="completed_date_range"*/}
            {/*                className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Completed Date Range"*/}
            {/*                onChange={onChange}>*/}
            {/*    <label className="min-w-65">From</label>*/}
            {/*    <label className="min-w-50">To</label>*/}
            {/*</DateRangeInput>*/}
            <ProfileToolDialog ref="profileDialog"/>
        </>;
    }

    // </editor-fold>
}

export default ExportAssetDocsDialog;
