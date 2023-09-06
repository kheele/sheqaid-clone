// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates, isWeb} from 'utils/Utils';
import {
    Button,
    SelectClientInput,
    SelectDepartmentInput, SelectEmployeeInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import PrintCardsPDFReader from '../printers/PrintCardsPDFReader';
import style from "./TransferEmployeesDialog.lazy.css";
import updateEmployee from "mutations/all/Employee/updateEmployee";

import byLogged from "../Query/List/listAllEmployeeByLogged";

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class TransferEmployeesDialog extends ANewDialog {
    pageKey = "TransferEmployeesDialog";

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

    get isTransfer() {
        return this.extraProp('role') === 'transfer';
    }

    get isExport() {
        return this.extraProp('role') === 'export';
    }

    get isBulkDelete() {
        return this.extraProp('role') === 'bulk-delete';
    }

    get isPrintCards() {
        return this.extraProp('role') === 'print-cards';
    }

    get title() {
        const {isTransfer, isExport, isBulkDelete, isPrintCards} = this;
        if (isTransfer) {
            return "Transfer Employee(s)";
        }
        if (isExport) {
            return "Export Employee(s)";
        }
        if (isBulkDelete) {
            return "Delete Employee(s)";
        }
        if (isPrintCards) {
            return "Print Cards Employee(s)";
        }
        return "";
    }

    get topButtons() {
        const {isTransfer, isExport, isBulkDelete, isPrintCards, extraProps} = this;
        if (!this.extraProp('role')) return null;
        const title = () => {
            if (isTransfer) return "Transfer";
            if (isExport) return "Export";
            if (isBulkDelete) return "Delete";
            return "Print Cards";
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
    path = 'plugin_sheq_assist/employees/';

    @observable
    state = {
        employeeList: []
    };
    @observable filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        department_id: null,
        job_position_id: null,
        supervisor_id: null,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onSearch = this.onSearch.bind(this);
        this.onLoadListEmployees = this.onLoadListEmployees.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onUnSelectAll = this.onUnSelectAll.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    //<editor-fold desc="onLoadListEmployees">
    onLoadListEmployees(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;

        const {
            site_id, project_id, client_id,
            department_id, job_position_id,
            supervisor_id
        } = this.filterData;

        const args = {
            department_id,
            job_position_id,
            supervisor_id,
            //
            site_id, project_id, client_id,
            //
            exact_orgs: true,
        };

        if(!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        return byLogged(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSearch">
    onSearch() {
        const {isConsultant, hasProjects, isContractor} = storage.is;

        const {form} = this;
        if (isConsultant) {
            if (!form.isValid('client_from')) {
                infoDialog.open('Company is required');
                return;
            }

            const {
                client_from
            } = form.data;
            this.filterData.client_id = client_from.id;
        }

        if (!isContractor && hasProjects) {
            const {
                project_from, site_from
            } = form.data;

            if (project_from) {
                this.filterData.project_id = project_from.id;
            }
            if (site_from) {
                this.filterData.site_id = site_from.id;
            }
        }

        const {
            department, job_position,
            supervisor
        } = form.data;

        if (department) {
            this.filterData.department_id = department.id;
        }
        if (job_position) {
            this.filterData.job_position_id = job_position.id;
        }
        if (supervisor) {
            this.filterData.supervisor_id = supervisor.id;
        }

        const {employeeList} = this.state;
        this.refs.selectEmployeeTable.setSelectedList(employeeList).open().then(list => {
            this.state.employeeList.clear();
            this.state.employeeList.push(...list);
            this.reset && this.reset();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {isTransfer, isExport, isBulkDelete, isPrintCards} = this.props.dialog;
//        return alert(this.title);
        if (isTransfer) {
            return this.onSubmitTransfer(e, btn, onSaved);
        }
        if (isExport) {
            return this.onSubmitExport(e, btn, onSaved);
        }
        if (isBulkDelete) {
            return this.onSubmitBulkDelete(e, btn, onSaved);
        }
        if (isPrintCards) {
            return this.onSubmitPrintCards(e, btn, onSaved);
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitTransfer">
    onSubmitTransfer(e, btn, onSaved) {
        const {form, state: {employeeList}} = this;
        if (!form.isValid('client_to')) {
            infoDialog.open('Company is required');
            return;
        }
        if (employeeList.isEmpty()) {
            infoDialog.open('Please select at least one Employee');
            return;
        }

        const {
            client_to, project_to, site_to
        } = form.data;

        const data = {client_id: client_to.id};

        if (project_to) {
            data.project_id = project_to.id;
        }
        if (site_to) {
            data.site_id = site_to.id;
        }

        const employeeListData = employeeList.map(({id}) => {
            return {id, ...data};
        });

//        console.log('employeeListData', employeeListData)

        progressDialog.open();
        btn.text("Saving...").disabled();
        Promise.all(employeeListData.map(async (data) => {
            return updateEmployee(data);
        })).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);//employeeListData
            confirmDialog.open(<React.Fragment>
                <p>Record(s) successfully transfered.</p>
                <p><b>Close Current Form?</b></p>
            </React.Fragment>).then(res => {
                if (res === 1) {
                    this.props.close();
                }
            });
        }).finally(() => {
            progressDialog.close();
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitExport">
    onSubmitExport(e, btn, onSaved) {
        const {form, state: {employeeList}} = this;

        if (employeeList.isEmpty()) {
            infoDialog.open('Please select at least one Employee');
            return;
        }

        const {
            client_from: client, project_from: project, site_from: site,
            department, job_position,
            supervisor
        } = form.data;

        progressDialog.open();
        btn.text("Exporting...").disabled();
        neonBinding.events.emit(this.path + "export-excel", {
            client,
            project,
            site,
            department,
            job_position,
            supervisor,
            list: employeeList.slice()
        }).then(res => {
            if (!res) {
                infoDialog.open(<React.Fragment>
                    <p>An error occurred. Please try again</p>
                </React.Fragment>);
            } else {
                if (isWeb()) {
                    infoDialog.open(<React.Fragment>
                        <p>Employees successfully exported.</p>
                        <p><small>The file will be automatically downloaded</small></p>
                    </React.Fragment>);
                    saveFileAs(res, `Employees-Report_${Dates.formatDate(new Date())}.xlsx`);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>Employees successfully exported.</p>
                        <p>Saved in the following folder:</p>
                        <p><small>{res.path}</small></p>
                        <p><small>The file will open after 3 seconds</small></p>
                    </React.Fragment>);
                }
            }
        }).finally(() => {
            progressDialog.close();
            btn.text("Export").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitBulkDelete">
    onSubmitBulkDelete(e, btn, onSaved) {
        const {form, state: {employeeList}} = this;

        if (employeeList.isEmpty()) {
            infoDialog.open('Please select at least one Employee');
            return;
        }

        progressDialog.open();
        btn.text("Deleting...").disabled();
        Promise.all(employeeList.map(async ({id}) => {
            return updateEmployee({id, removed: true});
        })).then(res => {
            const ids = res.map(v => v.id);
            console.log("res", ids)
            onSaved && onSaved(ids);//employeeListData
            confirmDialog.open(<React.Fragment>
                <p>Record(s) successfully deleted.</p>
                <p><b>Close Current Form?</b></p>
            </React.Fragment>).then(res => {
                if (res === 1) {
                    this.props.close();
                }
            });
        }).finally(() => {
            progressDialog.close();
            btn.text("Delete").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitPrintCards">
    onSubmitPrintCards(e, btn, onSaved) {
        const {form, state: {employeeList}, refs: {printCardsPDFReader}} = this;

        if (employeeList.isEmpty()) {
            infoDialog.open('Please select at least one Employee');
            return;
        }

        printCardsPDFReader.open(employeeList);
    }

    // </editor-fold>

    onSelectAll(e, btn) {

    }

    onUnSelectAll(e, btn) {

    }

    //<editor-fold desc="renderTHeadEmployeesFrom">
    renderTHeadEmployeesFrom() {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        return <THead>
            <div className="td">Name</div>
            <div className="td">Department</div>
            <div className="td">Job Position</div>
            {hasProjects && <React.Fragment>
                {isConsultant && <div className="td">Company</div>}
                <div className="td">Project</div>
                <div className="td">Site</div>
            </React.Fragment>}
            <div className="td fixed-flex no-padding min-w-70"></div>
        </THead>;
    }

    //</editor-fold>

    //<editor-fold desc="renderItemEmployeesFrom">
    renderItemEmployeesFrom(item, n) {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        let {
            id, data: {
                created_at, fname, lname,
                department, job_position,
                client,
                project,
                site,
                client_id, project_id, site_id
            }
        } = item;

        return <React.Fragment key={id}>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td">{department && department.name || 'N/A'}</div>
            <div className="td">{job_position && job_position.name || 'N/A'}</div>

            {hasProjects && <React.Fragment>
                {isConsultant && RenderUtils.renderOrgTD(client, null, 'Company')}
                {RenderUtils.renderOrgTD(project, null, 'Project')}
                {RenderUtils.renderOrgTD(site, null, 'Site')}
            </React.Fragment>}
        </React.Fragment>;
    }

    //</editor-fold>

    get title() {
        const {isTransfer, isExport, isBulkDelete, isPrintCards} = this.props.dialog;
        if (isTransfer) return "Transfer";
        if (isExport) return "Export";
        if (isBulkDelete) return "Delete";
        return "Print Cards";
    }

    get titleSelected() {
        const {isExport, isPrintCards} = this.props.dialog;
        return isExport ? "Export" : "Print Cards";
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        const {title, titleSelected, props: {dialog: {isTransfer, isExport, isPrintCards}}} = this;
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full">
                <div className="row col-lg-3 h-full padding-0 grid-1 align-content-top">
                    <label className="heading text-center h-45"><h4>Find Employee(s) To {title}:</h4></label>
                    <div
                        className="row sec-group margin-t-10 padding-l-10 grid-1 grid-gap-10 overflow-y-auto w-full h-full-calc-add-45">
                        {!isContractor && hasProjects && <React.Fragment>
                            {isConsultant && <SelectClientInput ref="client_id" name="client_from" group="orgs1"
                                                                placeholder="Company..." required
                                                                className="col-lg-12 margin-0 form-control"
                                                                onChange={this.form.onChange}/>}
                            <SelectProjectInput ref="project_id" name="project_from" group="orgs1"
                                                placeholder="Project..." required showAll
                                                className="col-lg-12 margin-0 form-control"
                                                onChange={this.form.onChange}/>
                            <SelectSiteInput ref="site_id" name="site_from" group="orgs1" placeholder="Site..." required
                                             showAll className="col-lg-12 margin-0 form-control"
                                             onChange={this.form.onChange}/>
                            <hr className="pull-left no-border bg-ddd h-2"/>
                        </React.Fragment>}
                        <SelectDepartmentInput name="department" placeholder="Department..." required
                                               className="col-lg-12 margin-0 form-control"
                                               onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_position" placeholder="Job Position..." required
                                                className="col-lg-12 margin-0 form-control"
                                                onChange={this.form.onChange}/>
                        <hr className="pull-left no-border bg-ddd h-2"/>
                        <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." required
                                             className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
                        <hr className="pull-left no-border bg-ddd h-2"/>
                        <Button className="btn btn-primary hor-center h-40 margin-b-10" onClick={this.onSearch}>
                            Find Employee(s)
                        </Button>
                    </div>
                    <SelectTable ref="selectEmployeeTable"
                                 isDialog
                                 replaceCols
                                 name="employee"
                                 desc="Employees"
                                 title="Select Employee(s)"
                                 className="col-lg-12 no-padding SelectEmployeeTable"
                                 renderTHead={this.renderTHeadEmployeesFrom}
                                 renderItem={this.renderItemEmployeesFrom}
                                 onLoadList={this.onLoadListEmployees}
                                 onUnSelectAll={this.onUnSelectAll}
                                 onSelectAll={this.onSelectAll}
                                 isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                </div>
                <div className="row col-lg-9 h-full pull-right padding-0">
                    <label className="heading text-center">
                        <h4>Employee(s) {isTransfer ? "Transferred To" : ("To " + titleSelected)}:</h4></label>
                    {isTransfer && <div className="row sec-group sec-group-transfer margin-10">
                        <SelectClientInput name="client_to" group="orgs2" placeholder="Company..." required showAll
                                           className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project_to" group="orgs2" placeholder="Project..." required showAll
                                            className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site_to" group="orgs2" placeholder="Site..." required showAll
                                         className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>}
                    <SelectTable ref="selectedEmployeeTable"
                                 replaceCols
                                 name="employee"
                                 desc="Employees"
                                 title="Selected Employee(s)"
                                 className={"col-lg-12 no-padding SelectedEmployeeTable Table-" + (title.replaceAll(' ', ''))}
                                 renderTHead={this.renderTHeadEmployeesFrom}
                                 renderItem={this.renderItemEmployeesFrom}
                                 list={this.state.employeeList}
                                 isChecked={(item, selectedList) => true}/>
                </div>
            </div>
            <PrintCardsPDFReader ref="printCardsPDFReader"/>
        </div>);
    }

    // </editor-fold>
}

export default TransferEmployeesDialog;
