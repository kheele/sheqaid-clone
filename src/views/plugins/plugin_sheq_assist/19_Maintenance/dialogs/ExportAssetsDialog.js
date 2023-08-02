// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';

import {Dates, isWeb} from 'utils/Utils';
import {Button, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';
// </editor-fold>
import style from "./ExportAssetsDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportAssetsDialog extends ANewDialog {
    pageKey = "ExportAssetsDialog";

//    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Export Asset(s)";
    }

    get topButtons() {
        const title = () => {
            return "Export";
        };
        return <React.Fragment>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>{title()}
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/19_Maintenance/tools/';

    @observable
    state = {
        assetList: []
    };
    filterData;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onSearch = this.onSearch.bind(this);
        this.onLoadListAssets = this.onLoadListAssets.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onUnSelectAll = this.onUnSelectAll.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    onLoadListAssets(isNew) {
        return neonBinding.events.emit(this.path + 'select/filter', {isNew, ...this.filterData});
    }

    // <editor-fold defaultstate="collapsed" desc="onSearch">
    onSearch() {
        const {form} = this;
        if (!form.isValid('client_from')) {
            infoDialog.open('Company is required');
            return;
        }
        const {
            client_from, project_from, site_from
        } = form.data;
        this.filterData = {client_id: client_from.id};
        if (project_from) {
            this.filterData.project_id = project_from.id;
        }
        if (site_from) {
            this.filterData.site_id = site_from.id;
        }

        const {assetList} = this.state;
        this.refs.selectAssetTable.setSelectedList(assetList).open().then(list => {
            this.state.assetList.clear();
            this.state.assetList.push(...list);
            this.reset();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        return this.onSubmitExport(e, btn, onSaved);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitExport">
    onSubmitExport(e, btn, onSaved) {
        const {form, state: {assetList}} = this;

        if (assetList.isEmpty()) {
            infoDialog.open('Please select at least one Asset');
            return;
        }

        btn.text("Exporting...").disabled();
        neonBinding.events.emit(this.path + "export-excel", assetList.slice()).then(res => {
            if (!res) {
                infoDialog.open(<React.Fragment>
                    <p>An error occurred. Please try again</p>
                </React.Fragment>);
            } else {
                if (isWeb()) {
                    infoDialog.open(<React.Fragment>
                        <p>Assets successfully exported.</p>
                        <p><small>The file will be automatically downloaded</small></p>
                    </React.Fragment>);
                    saveFileAs(res, `Assets-Report_${Dates.formatDate(new Date())}.xlsx`);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>Assets successfully exported.</p>
                        <p>Saved in the following folder:</p>
                        <p><small>{res.path}</small></p>
                        <p><small>The file will open after 3 seconds</small></p>
                    </React.Fragment>);
                }
            }
        }).finally(() => {
            btn.text("Export").enabled();
        });
    }

    // </editor-fold>

    onSelectAll(e, btn) {

    }

    onUnSelectAll(e, btn) {

    }

    renderTHeadAssetsFrom() {
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

    renderItemAssetsFrom(item, n) {
        if (!item.data.statusVal) {
            item.data.statusVal = computed(() => {
                const {status} = item.data;
                console.log(item.id, 'status', status)
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

        return <React.Fragment key={id}>
            <div className="td fixed-flex min-w-80">{RenderUtils.renderImage(profile_pic)}</div>
            <div className="td">{asset_type}</div>
            <div className="td">{name || 'N/A'}</div>
            <div className="td">{manufacturer || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{reg_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-160">{serial_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-80">{condition || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{status}</div>
        </React.Fragment>;
    }

    get title() {
        return "Export";
    }

    get titleSelected() {
        return "Export";
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {title, titleSelected} = this;
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full">
                <div className="row col-lg-3 h-full padding-0">
                    <label className="heading text-center"><h4>Find Asset(s) To {title}:</h4></label>
                    <div className="row sec-group margin-t-10 padding-l-10 padding-r-10">
                        <SelectClientInput name="client_from" group="orgs1" placeholder="Company..." required showAll
                                           className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project_from" group="orgs1" placeholder="Project..." required showAll
                                            className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site_from" group="orgs1" placeholder="Site..." required showAll
                                         className="col-lg-12 margin-b-15 form-control" onChange={this.form.onChange}/>
                        <Button className="btn btn-primary hor-center" onClick={this.onSearch}>
                            Find Asset(s)
                        </Button>
                    </div>
                    <SelectTable ref="selectAssetTable"
                                 isDialog
                                 replaceCols
                                 name="asset"
                                 desc="Assets"
                                 title="Select Asset(s)"
                                 className="col-lg-12 no-padding SelectAssetTable"
                                 renderTHead={this.renderTHeadAssetsFrom}
                                 renderItem={this.renderItemAssetsFrom}
                                 onLoadList={this.onLoadListAssets}
                                 onUnSelectAll={this.onUnSelectAll}
                                 onSelectAll={this.onSelectAll}
                                 isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                </div>
                <div className="row col-lg-9 h-full pull-right padding-0">
                    <label className="heading text-center"><h4>Asset(s) To {titleSelected}:</h4></label>
                    <SelectTable ref="selectedAssetTable"
                                 replaceCols
                                 name="asset"
                                 desc="Assets"
                                 title="Selected Asset(s)"
                                 className={"col-lg-12 no-padding SelectedAssetTable Table-" + (title.replaceAll(' ', ''))}
                                 renderTHead={this.renderTHeadAssetsFrom}
                                 renderItem={this.renderItemAssetsFrom}
                                 list={this.state.assetList}
                                 isChecked={(item, selectedList) => true}/>
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default ExportAssetsDialog;
