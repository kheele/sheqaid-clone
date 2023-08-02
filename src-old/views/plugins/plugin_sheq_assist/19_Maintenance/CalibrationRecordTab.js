// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {onSelectLoadAssetConditions, onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from '../../utils';

import {Dates} from "../../../../utils/Utils";

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, SelectAssetTypeInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import ProfileToolDialog from './dialogs/ProfileToolDialog.js';
import EditToolDialog from './dialogs/EditToolDialog.js';

import style from "./CalibrationRecordTab.lazy.css";
import {CONSTANTS} from "./dialogs/AssetComponents";

// </editor-fold>

@observer
class CalibrationRecordTab extends React.Component {
    path;
    pageKey = "CalibrationRecordTab";

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

        this.path = props.path + 'calibration-record/';

        this.onView = this.onView.bind(this);
        this.onAddCalibrationService = this.onAddCalibrationService.bind(this);
        
        this.onPrintForm = this.onPrintForm.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
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

    onPrintForm() {
        this.refs.newCalibrationRecordPrintDialog.open();
    }
    
    onView(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        if(item) {
            this.refs.profileDialog.extraProp('index', CONSTANTS.CALIBRATION).open(item);
        }
    }
    
    onAddCalibrationService(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        if(item) {
            this.refs.editDialog.extraProp('index', CONSTANTS.CALIBRATION).open(item);
        }
    }

    renderLeftButtons() {
        return null/*<div className="left-buttons pull-left">
            <Button key="buttonPrintForm" className="btn btn-primary pull-right _888" onClick={this.onPrintForm}>
                <i key="buttonPrintFormIcon" className="fa fa-chart-bar icon-left"/>Print Form
            </Button>
        </div>*/;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={this.onView} faIconLeft="eye" title="View"/>
            <NavItem action="writable" idx={idx} onClick={this.onAddCalibrationService} faIconLeft="plus" title="Add Calibration Service"/>
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
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Type</div>
            <div className="td">Name</div>
            <div className="td">Registration No.</div>
            <div className="td fixed-flex min-w-120">Last Date</div>
            <div className="td fixed-flex min-w-190">Next Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
//        const {id, data: {maintanace_type, reference_standard, certificate_num, company_calibrating, calibration_date, next_calibration_date}} = item;
        const {id, data: {
                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/,
                //1
                name, asset_type, desc,
                manufacturer, model, reg_num, serial_num, 
                location, toolkit, condition,
                barcode_or_qr_code_type, barcode_or_qr_code, 
                notes,
                //2
                profile_pic,
                //3
                responsible_person,
                //4
                doc_pdf, doc_pdf_desc, doc_pdf_expiry,
                //5
                doc_work_manual, doc_procedure, doc_clearance_certificate,
                //6
                purchase_info,
                //7
                depreciation,
                //8
                monitoring_plan_list,
                //9
                maintenance_plan,
                //10
                calibration_record
            }
        } = item;
        
        const {next_calibration_date, next_calibration_interval, list = []} = calibration_record;
        //list = {reference_standard, certificate_num, calibrating_company, calibration_date}
        list.sortBy('service_date');
        const lastService = list.getLastElement() || {};
        const {reference_standard, certificate_num, calibrating_company, calibration_date} = lastService;

        //const isHours = asset_type.contains('Plant');
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{asset_type}</div>
            <div className="td">{name || 'N/A'}</div>
            <div className="td">{reg_num}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(calibration_date) || 'N/A'}</div>
            <div className="td fixed-flex min-w-190">{Dates.formatDate(next_calibration_date)} ({next_calibration_interval})</div>
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
            pageTitle="Calibration Record"
            pageTitleSingular="calibration record"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <EditToolDialog ref="editDialog"/>
            <ProfileToolDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default CalibrationRecordTab;
