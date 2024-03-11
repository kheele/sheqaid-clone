// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates, isWeb} from 'utils/Utils';
import {Button, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import {ANewDialog} from 'components/dialogs';

import {IncidentStatus} from '../dialogs/IncidentComponentRows';

// </editor-fold>
import style from "./ExportQuickIncidentsDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportQuickIncidentsDialog extends ANewDialog {
    pageKey = "ExportQuickIncidentsDialog";

//    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    open(item) {
        this.execWhen(() => this.extraProp('role')).then(() => {
            this.refs.dialog.setTopButtons(this.topButtons);
        });
        return super.open(item);
    }

    get isExport() {
        return !this.extraProp('role') || this.extraProp('role') === 'export';
    }

    get isSelect() {
        return this.extraProp('role') === 'select';
    }

    get title() {
        const {isExport, isSelect} = this;
        if (isExport) {
            return "Export Quick Incident(s)";
        }
        return "Select Quick Incident(s)";
    }

    get topButtons() {
        const {isExport, isSelect} = this;
        const title = () => {
            if (isExport) return "Export";
            return "Done";
        };
        return <>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>{title()}
            </Button>
        </>;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/17_Incident_Investigation/';

    @observable
    state = {
        incidentList: []
    };
    filterData;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onSearch = this.onSearch.bind(this);
        this.onLoadListIncidents = this.onLoadListIncidents.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onUnSelectAll = this.onUnSelectAll.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    onLoadListIncidents(isNew) {
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

        const {incidentList} = this.state;
        this.refs.selectIncidentTable.setSelectedList(incidentList).open().then(list => {
            this.state.incidentList.clear();
            this.state.incidentList.push(...list);
            // this.reset();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {isExport, isSelect} = this.props.dialog;
        if (isExport) {
            return this.onSubmitExport(e, btn, onSaved);
        }
        return this.onSubmitSelect(e, btn, onSaved);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitExport">
    onSubmitExport(e, btn, onSaved) {
        const {form, state: {incidentList}} = this;

        if (incidentList.isEmpty()) {
            infoDialog.open('Please select at least one Incident');
            return;
        }

        btn.text("Exporting...").disabled();
        neonBinding.events.emit(this.path + "export-excel", incidentList.slice()).then(res => {
            if (!res) {
                infoDialog.open(<React.Fragment>
                    <p>An error occurred. Please try again</p>
                </React.Fragment>);
            } else {
                if (isWeb()) {
                    infoDialog.open(<React.Fragment>
                        <p>Incidents successfully exported.</p>
                        <p><small>The file will be automatically downloaded</small></p>
                    </React.Fragment>);
                    saveFileAs(res, `Incidents-Report_${Dates.formatDate(new Date())}.xlsx`);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>Incidents successfully exported.</p>
                        <p>Saved in the following folder:</p>
                        <p><small>{res.path}</small></p>
                        <p><small>The file will open after 3 seconds</small></p>
                    </React.Fragment>);
                }
            }
        }).catch(err => {
            infoDialog.open(<React.Fragment>
                <p>An error occurred. Please check your network connection and try again</p>
            </React.Fragment>);
        }).finally(() => {
            btn.text("Export").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitSelect">
    onSubmitSelect(e, btn, onSaved) {
        const {form, state: {incidentList}, props: {dialog}} = this;

        if (incidentList.isEmpty()) {
            infoDialog.open('Please select at least one Incident');
            return;
        }

        onSaved(incidentList);
        dialog.close();
    }

    // </editor-fold>

    onSelectAll(e, btn) {

    }

    onUnSelectAll(e, btn) {

    }

    renderTHeadIncidentsFrom() {
        return <THead>
            <div className="td fixed-flex min-w-120">Incident Date</div>
            <div className="td">Group</div>
            <div className="td">Category</div>
            <div className="td">Sub-Category</div>
            <div className="td">Sector(s)</div>
            <div className="td">Activities</div>
            <div className="td">Description</div>
            <div className="td">Exact Location</div>
            <div className="td fixed-flex min-w-140">Status</div>
            <div className="td fixed-flex no-padding min-w-70"></div>
        </THead>;
    }

    renderItemIncidentsFrom(item, n) {
        let {
            id, data: {
                created_at,
                //
                company,
                client,
                project,
                site,
                //
                logged_user,
                logged_employee,
                //Step 2 (Incident Details)
                latitude,
                longitude,
                exact_location,
                short_desc,
                //Step 3 (Date & Time)
                incident_date,
                incident_time,
                date_reported,
                time_reported,
                time_shift,
                //Step 4 (Incident Category)
                category_list,
                //Step 5 (Injury Report)
                person_reporting,
                //Step 6 (Injury Details)
                person_injured,
                nature_of_injury_list,
                bodily_injury_location_list,
                injury_mechanism_list,
                //6.2 Motor Vehicle
                is_vehicle_incident,
                driver,
                driver_email,
                driver_phone,
                vehicle_make,
                vehicle_reg_num,
                //6.3 Incident Severity
                severity,
                //Step 7 (Media Details)
                image_list,
                video_list,
            }
        } = item;
//        console.log('Incidents', item)

        return <React.Fragment key={id}>
            <div
                className="td fixed-flex min-w-120">{sec9_data && sec9_data.incident_date ? Dates.formatDate(sec9_data.incident_date) : 'N/A'}</div>
            <div className="td">{sec1_data && sec1_data.group || 'N/A'}</div>
            <div className="td">
                {
                    sec1_data && sec1_data.category_list ? sec1_data.category_list.map(v => (
                        <span>{isString(v) ? v : v.value}</span>
                    )) : 'N/A'
                }
            </div>
            <div className="td">
                {
                    sec2_data && sec2_data.sub_category_list ? sec2_data.sub_category_list.filter(v => !!v).map(v =>
                        <span>{isString(v) ? v : v.value}</span>
                    ) : 'N/A'
                }
            </div>
            <div className="td">
                {
                    sec1_data && sec1_data.sector_list ? sec1_data.sector_list.map(v => (
                        <span>{isString(v) ? v : v.value}</span>
                    )) : 'N/A'
                }
            </div>
            <div className="td">
                {
                    sec2_data && sec2_data.activity_list ? sec2_data.activity_list.map(v =>
                        <span>{isString(v) ? v : v.value}</span>
                    ) : 'N/A'
                }
            </div>
            <div className="td">{sec1_data && sec1_data.short_desc ? sec1_data.short_desc : 'N/A'}</div>
            <div className="td">{sec9_data && sec9_data.exact_location ? sec9_data.exact_location : 'N/A'}</div>
            <IncidentStatus key={new Date().getTime()} item={item}/>
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
                    <label className="heading text-center"><h4>Find Incident(s) To {title}:</h4></label>
                    <div className="row sec-group margin-t-10 padding-l-10 padding-r-10">
                        <SelectClientInput name="client_from" group="orgs1" placeholder="Company..." required showAll
                                           className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project_from" group="orgs1" placeholder="Project..." required showAll
                                            className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site_from" group="orgs1" placeholder="Site..." required showAll
                                         className="col-lg-12 margin-b-10 form-control" onChange={this.form.onChange}/>
                        <Button className="btn btn-primary hor-center margin-b-10" onClick={this.onSearch}>
                            Find Incident(s)
                        </Button>
                    </div>
                    <SelectTable ref="selectIncidentTable"
                                 isDialog
                                 replaceCols
                                 name="incident"
                                 desc="Incidents"
                                 title="Select Incident(s)"
                                 className="col-lg-12 no-padding SelectIncidentTable"
                                 renderTHead={this.renderTHeadIncidentsFrom}
                                 renderItem={this.renderItemIncidentsFrom}
                                 onLoadList={this.onLoadListIncidents}
                                 onUnSelectAll={this.onUnSelectAll}
                                 onSelectAll={this.onSelectAll}
                                 isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                </div>
                <div className="row col-lg-9 h-full pull-right padding-0">
                    <label className="heading text-center"><h4>Incident(s) To {titleSelected}:</h4></label>
                    <SelectTable ref="selectedIncidentTable"
                                 replaceCols
                                 name="incident"
                                 desc="Incidents"
                                 title="Selected Incident(s)"
                                 className={"col-lg-12 no-padding SelectedIncidentTable Table-" + (title.replaceAll(' ', ''))}
                                 renderTHead={this.renderTHeadIncidentsFrom}
                                 renderItem={this.renderItemIncidentsFrom}
                                 list={this.state.incidentList}
                                 isChecked={(item, selectedList) => true}/>
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default ExportQuickIncidentsDialog;
