// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {
    Button,
    ClearableInput, Clickable, DateRangeInput, SelectAssetTypeInput,
    SelectClientInput, SelectEmployeeInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import style from "./ExportAssetsDialog.lazy.css";
import {AControls, AExportDialog} from "components/exports/AExportDialog";
import {onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from "../../../utils";
import assetProfilePic from "assets/images/vehicle-image-loading.png";
import ProfileToolDialog from "../ToolsTab/forms/ProfileToolDialog";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportAssetsDialog extends AExportDialog {
    className = "ExportAssetsDialog";
    titleSingular = 'Asset';
    titlePlural = 'Assets';
    
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
    exportFn = sockets.of('assets').fn('export-excel');

    @observable
    state = {
        lists: {
            manufacturers: [],
            locations: [],
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap']
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
        // responsible_person_list: null,
        asset_type: null,
        manufacturer: null,
        location: null,
        condition: null,
        name: null,
        reg_num: null,
        serial_num: null,
        model: null,
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
            name,
            reg_num,
            serial_num,
            model,
            condition,
            location,
            manufacturer,
            asset_type,
        } = filterData || {};

        const listByLogged = sockets.of("assets").fn('listByLogged');
        
        return listByLogged({
            written_off: false,
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
            <div className="td fixed-flex min-w-80">Photo</div>
            <div className="td">Type</div>
            <div className="td">Name</div>
            <div className="td">Manufacturer</div>
            <div className="td fixed-flex min-w-100">Reg No.</div>
            <div className="td fixed-flex min-w-160">Serial No.</div>
            <div className="td fixed-flex min-w-80">Condition</div>
            <div className="td fixed-flex min-w-100">Status</div>
            <div className="td fixed-flex no-padding min-w-70"></div>
        </THead>;
    }

    renderItemFrom(item, n) {
        if (!('statusVal' in item.data)) {
            item.data.statusVal = computed(() => {
                const {status} = item.data;
                // console.log(item.id, 'status', status)
                if (status === 'In Storage') {
                    return 'Check Out';
                } else if (status === 'Checked Out') {
                    return 'Check In';
                } else if (status === 'Loaned Out') {
                    return 'Check In';
                } else if (status === 'Out For Repair') {
                    return 'Check In';
                }
                return 'Check Out';
            });
        }
        const {
            id, data: {
                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                client, project, site,
                //1 done
                asset_detail: {
                    owning_company,
                    name,
                    asset_type,
                    desc,
                    manufacturer,
                    model,
                    reg_num,
                    serial_num,
                    location,
                    toolkit,
                    condition,
                    barcode,
                    qr_code,
                    notes,
                },
                //2 done
                photo_list,
                profile_pic: profile_pic_list,
                //3 done
                responsible_person,
                // //4 done
                // doc_list,
                // //5 done
                // purchase_info,
                // //6 done
                // depreciation,
                // //7 done
                // monitoring_plan_list,
                // //8 done
                // maintenance_plan_list,
                // //9 done
                // calibration_record_list,
                // //10
                // inspection_template_list = [],
                // inspection_list = [],
            }
        } = item;

        const statusValFinal = statusVal.get ? statusVal.get() : statusVal;

        let [profile_pic] = profile_pic_list || [];
        if(!profile_pic) {
            profile_pic = (photo_list || [])[0];
        }

        return <React.Fragment key={id}>
            <div className="td fixed-flex min-w-80">
                <Clickable id={id} onClick={this.onView}>
                    {RenderUtils.renderImage(profile_pic && profile_pic.doc, null, '100%', assetProfilePic)}
                </Clickable>
            </div>
            <div className="td">{asset_type}</div>
            <div className="td">{name || 'N/A'}</div>
            <div className="td">{manufacturer || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{reg_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-160">{serial_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-80">{condition || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{status}</div>
        </React.Fragment>;
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
            <SelectAssetTypeInput ref="asset_type" name="asset_type" placeholder="Asset Type..."
                                  className="col-lg-12 form-control"
                                  onChange={onChange}/>
            <ClearableInput ref="manufacturer" name="manufacturer" type="select" placeholder="Manufacturer..."
                            className="col-lg-12 form-control"
                            onChange={onChange} values={this.state.lists.manufacturers} returnValue/>
            <ClearableInput ref="location" name="location" type="select" placeholder="Location..."
                            className="col-lg-12 form-control"
                            onChange={onChange} values={this.state.lists.locations} returnValue/>
            <ClearableInput ref="condition" name="condition" type="select" placeholder="Condition..."
                            className="col-lg-12 form-control" onChange={onChange}
                            values={this.state.lists.conditions} returnValue/>
            <ClearableInput ref="name" name="name" type="text" placeholder="Asset Name"
                            className="col-lg-12 form-control"
                            onChange={onChange}/>
            <ClearableInput ref="reg_num" name="reg_num" type="text" placeholder="Registration No."
                            className="col-lg-12 form-control"
                            onChange={onChange}/>
            <ClearableInput ref="serial_num" name="serial_num" type="text" placeholder="Serial No."
                            className="col-lg-12 form-control"
                            onChange={onChange}/>
            <ClearableInput ref="model" name="model" type="text" placeholder="Model" className="col-lg-12 form-control"
                            onChange={onChange}/>

            {/*<hr className="pull-left no-border bg-ddd h-2"/>*/}
            {/*<DateRangeInput ref="due_date_range" name="due_date_range"*/}
            {/*                className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Due Date Range"*/}
            {/*                onChange={onChange}>*/}
            {/*    <label className="min-w-65">From</label>*/}
            {/*    <label className="min-w-50">To</label>*/}
            {/*</DateRangeInput>*/}
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

export default ExportAssetsDialog;
