// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../utils/Form';
import {
    Button,
    SelectClientInput,
    SelectDepartmentInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput
} from '../inputs';
import {SelectTable, THead} from '../tables';
import ANewDialog from '../dialogs/ANewDialog';
// </editor-fold>
import style from "./SelectEmployeesDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class SelectEmployeesDialog extends ANewDialog {
    pageKey = "SelectEmployeesDialog";

//    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Select Employee(s)";
    }

    get topButtons() {
        return <React.Fragment>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
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
    filterData;

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

    onLoadListEmployees(isNew) {
        return workers.emit(this.path + 'select/filter', {isNew, ...this.filterData});
    }

    // <editor-fold defaultstate="collapsed" desc="onSearch">
    onSearch() {
        const {form} = this;
        if (!form.isValid('client_from')) {
            infoDialog.open('Company is required');
            return;
        }
        const {
            client_from, project_from, site_from, department, job_position
        } = form.data;
        this.filterData = {client_id: client_from.id};
        if (project_from) {
            this.filterData.project_id = project_from.id;
        }
        if (site_from) {
            this.filterData.site_id = site_from.id;
        }
        if (department) {
            this.filterData.department_id = department.id;
        }
        if (job_position) {
            this.filterData.job_position_id = job_position.id;
        }

        const {employeeList} = this.state;
        this.refs.selectEmployeeTable.setSelectedList(employeeList).open().then(list => {
            this.state.employeeList.clear();
            this.state.employeeList.push(...list);
//            this.filterData = null;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, state: {employeeList}} = this;
        if (employeeList.isEmpty()) {
            infoDialog.open('Please select at least one Employee');
        } else {
            onSaved && onSaved([...toJS(employeeList)]);
            this.props.close();
        }
    }

    // </editor-fold>

    onSelectAll(e, btn) {

    }

    onUnSelectAll(e, btn) {

    }

    renderTHeadEmployeesFrom() {
        return <THead>
            <div className="td">Name</div>
            <div className="td">Department</div>
            <div className="td">Job Position</div>
            <div className="td">Company</div>
            <div className="td">Project</div>
            <div className="td">Site</div>
            <div className="td fixed-flex no-padding min-w-70"></div>
        </THead>;
    }

    renderItemEmployeesFrom(item, n) {
        let {
            id, data: {
                created_at, fname, lname, optional_info = {},
                client,
                project,
                site,
                client_id, project_id, site_id
            }
        } = item;

        const {department, job_position} = optional_info;

        return <React.Fragment key={id}>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td">{department ? (department.name || department.data.name) : 'N/A'}</div>
            <div className="td">{job_position ? (job_position.name || job_position.data.name) : 'N/A'}</div>
            {RenderUtils.renderOrgTD(client, null, 'Company')}
            {RenderUtils.renderOrgTD(project, null, 'Project')}
            {RenderUtils.renderOrgTD(site, null, 'Site')}
        </React.Fragment>;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full">
                <div className="row col-lg-3 h-full padding-0">
                    <label className="heading text-center"><h4>Find Employee(s) To Select:</h4></label>
                    <div className="row sec-group margin-t-10 padding-l-10 padding-r-10">
                        <SelectClientInput name="client_from" group="orgs1" placeholder="Company..." required showAll
                                           className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project_from" group="orgs1" placeholder="Project..." required showAll
                                            className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site_from" group="orgs1" placeholder="Site..." required showAll
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectDepartmentInput name="department" placeholder="Department..." required
                                               className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_position" placeholder="Job Position..." required
                                                className="col-lg-12 margin-b-15 form-control"
                                                onChange={this.form.onChange}/>
                        <Button className="btn btn-primary hor-center" onClick={this.onSearch}>
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
                    <label className="heading text-center"><h4>Employee(s) Selected:</h4></label>
                    <SelectTable ref="selectedEmployeeTable"
                                 replaceCols
                                 name="employee"
                                 desc="Employees"
                                 title="Selected Employee(s)"
                                 className={"col-lg-12 no-padding SelectedEmployeeTable Table-Select"}
                                 renderTHead={this.renderTHeadEmployeesFrom}
                                 renderItem={this.renderItemEmployeesFrom}
                                 list={this.state.employeeList}
                                 isChecked={(item, selectedList) => true}/>
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default SelectEmployeesDialog;
