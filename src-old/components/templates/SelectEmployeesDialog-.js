import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../utils/Form';
import {AsyncTD} from '../../views/plugins/components';
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

import style from "./SelectEmployeesDialog.lazy.css";

@observer
class SelectEmployeesDialog extends ANewDialog {
    pageKey = "SelectEmployeesDialog";
    title = "Select Employee(s)";
//    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    onReset(e, btn) {
        this.props.control.selectedList.refs.selectedEmployeeTable.onReset(e, btn);
    }
    
    get topButtons() {
        return <React.Fragment>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary reset" onClick={this.onReset}>Reset</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }
}

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/';

    @observable
    state = {
        employeeList: []
    };
    filterData;

    constructor() {
        super();
        
        this.onSearch = this.onSearch.bind(this);
        this.onLoadListEmployees = this.onLoadListEmployees.bind(this);
        
        this.form = new Form();
    }
    
    onLoadListEmployees() {
        return neonBinding.events.emit(this.path + 'select/filter', this.filterData);
    }
    
    onSearch(){
        const {form} = this;
        if (!form.isValid('client_from')) {
            infoDialog.open('Company is required');
            return;
        }
        const {
            client_from, project_from, site_from, department, job_position
        } = form.data;
        this.filterData = {client_id: client_from.id};
        if(project_from) {
            this.filterData.project_id = project_from.id;
        }
        if(site_from) {
            this.filterData.site_id = site_from.id;
        }
        if(department) {
            this.filterData.department_id = department.id;
        }
        if(job_position) {
            this.filterData.job_position_id = job_position.id;
        }
        
        const {employeeList} = this.state;
        this.refs.selectEmployeeTable.setSelectedList(employeeList).open().then(list => {
            this.state.employeeList.clear(); 
            this.state.employeeList.push(...list);
            this.filterData = null;
        });
    }

    onSubmit(e, btn, onSaved) {
        const {form, state: {employeeList}} = this;
        if(employeeList.isEmpty()) {
            infoDialog.open('Please select at least one Employee');
            return;
        } else {
            onSaved && onSaved([...toJS(employeeList)]);
            this.props.close();
        }
    }
    
    renderTHeadEmployeesFrom() {
        return <THead>
            <div className="td">Name</div>
            <div className="td">Department</div>
            <div className="td">Job Position</div>
            <div className="td">Company Name</div>
            <div className="td">Project Name</div>
            <div className="td">Site Name</div>
            <div className="td fixed-flex no-padding min-w-70"></div>
        </THead>;
    }

    renderItemEmployeesFrom(item, n){
        const {id, data: {created_at, fname, lname, optional_info, client, project, site, client_id, project_id, site_id}} = item;
        return <React.Fragment key={id}>
            <div className="td">{fname + ' ' + lname}</div>
            <AsyncTD title="Department" defaultValue={optional_info && optional_info.department} renderer={v => v.name || v.data.name}/>
            <AsyncTD title="Job Position" defaultValue={optional_info && optional_info.job_position} renderer={v => v.name || v.data.name}/>
            
            {RenderUtils.renderOrgTD(client, null, 'Company Name')}
            {RenderUtils.renderOrgTD(project, null, 'Project Name')}
            {RenderUtils.renderOrgTD(site, null, 'Site Name')}
        </React.Fragment>;
    }

    render() {
        return (<div className="controls-wrapper h-full">
            <div className="controls padding-0 h-full">
                <div className="row">
                    <label className="text-center margin-b-20"><h4>Find Employee(s):</h4></label>
                    <div className="row sec-group">    
                        <SelectClientInput name="client_from" placeholder="Company..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project_from" placeholder="Project..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site_from" placeholder="Site..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectDepartmentInput name="department" placeholder="Department..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_position" placeholder="Job Position..." required className="col-lg-6 form-control margin-b-20" onChange={this.form.onChange}/>
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
                        isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                </div>
                <div className="row min-h-200">
                    <label className="text-center padding-b-0 margin-b-0"><h4>Employee(s) Selected:</h4></label>
                    <SelectTable ref="selectedEmployeeTable" 
                        replaceCols
                        readonly
                        name="employee" 
                        desc="Employees" 
                        title="Selected Employee(s)" 
                        className="col-lg-12 min-h-160 no-padding SelectedEmployeeTable" 
                        renderTHead={this.renderTHeadEmployeesFrom} 
                        renderItem={this.renderItemEmployeesFrom} 
                        list={this.state.employeeList}
                        isChecked={(item, selectedList) => true}/>
                </div>
            </div>
        </div>);
    }
}

export default SelectEmployeesDialog;
