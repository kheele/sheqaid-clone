// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from '../../../../utils/Form';
import {Dates, execWhen, SAIdUtils} from '../../../../utils/Utils';

import {
    Button,
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../components/tables';
import {ANewDialog, InputDialog} from '../../../../components/dialogs';

import style from "./ImportDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ImportDialog">
@observer
class ImportDialog extends ANewDialog {
    pageKey = "ImportEmployeesDialog";
    title = "Import Employees";

    constructor(props) {
        super(props, style);
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel" onClick={this.onCancel}>
                <i className="fa fa-times icon-left"/>Cancel
            </Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Save All
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
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            group_by: [
                {text: 'Job Position', value: 'Job Position', checked: true},
                {text: 'Department', value: 'Department', checked: false}
            ],
            genders: ["Male", "Female", "Other"]
        },
        list: [],
        groupBy: "Job Position"
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onUpload = this.onUpload.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("group_by", this.onChangeGroupBy.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeGroupBy">
    onChangeGroupBy(el, val) {
        this.state.groupBy = val || "Job Position";
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mapErrors">
    mapErrors(err, n) {
        const mapErrors = (v, i) => {
            const {length} = err.value;
            if(i === length-1) {
                return v;
            } else if(i === length-2) {
                return v + ' OR ';
            } else {
                return v + ', ';
            }
        };
        return <TRow key={"item-" + n} className="text-left font-size-15">
            {n+1} - {err.value.map(mapErrors).join('').trim()}
        </TRow>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onUpload">
    onUpload() {
        electronDialog.showOpenDialogSpreadsheetRaw().then(async res => {
            if (res) {
                progressDialog.open();
                const filePath = await FileConverters.asDataUrl(res.path);
                neonBinding.events.emit(this.path + "import/file", filePath).then(async res => {
//                    console.log("data", res)
                    if(!res) {
                        infoDialog.open('An error occured. Please try again');
                        return;
                    }
                    if(res.errors) {
                        infoDialog.open(<div className="info-dialog-content">
                            <THead className="padding-10 margin-b-15">The following Spreadsheet Header Column Cells are required:</THead>
                            {res.errors.map(this.mapErrors)}
                        </div>);
                    } else {
                        this.state.list = await Promise.all(res.map(async val => {
                            let {fname, id_num, passport_num, sex, dob, email, employee_num, job_position, job_category, department, employment_date} = val;
//                            console.log('val', val)
                            
                            const setGender = sex => {
                                if(sex) {
                                    const g = sex.trim().toLowerCase();
                                    console.log('g', g)
                                    if(g === 'female' || g === 'male') {
                                        val.sex = sex.toTitleCase();
                                    } else if(g === 'f' || g === 'm') {
                                        val.sex = g === 'f' ? 'Female' : "Male";
                                    }
                                }
                            };
                            
                            if(fname.toLowerCase().startsWith("mr ") || fname.toLowerCase().startsWith("ms ")) {
                                val.fname = fname.substring(2).trim();
                            } else if(fname.toLowerCase().startsWith("mrs ")) {
                                val.fname = fname.substring(3).trim();
                            } else if(fname.toLowerCase().startsWith("miss ")) {
                                val.fname = fname.substring(4).trim();
                            }
                            if(id_num) {
                                if(SAIdUtils.isValid(id_num)) {
                                    sex = SAIdUtils.getGender(id_num);
                                    dob = SAIdUtils.getDOB(id_num);
                                    if(sex) {
                                        val.sex = sex;
                                    } else {
                                        setGender(val.sex);
                                    }
                                    val.dob = dob || val.dob;
                                } else {
                                    if(!passport_num) {
                                        val.passport_num = id_num;
                                    }
                                    delete val.id_num;
                                    setGender(sex);
                                }
                            } else {
                                if(sex) {
                                    setGender(sex);
                                }
                                if(dob) {
                                    val.dob = Dates.parse(dob);
                                }
                            }
                            
                            if(!val.sex) {
                                delete val.sex;
                            }
                            if(!val.dob) {
                                delete val.dob;
                            }
                            
                            if(email) {
                                val.email = val.email.toLowerCase();
                            }
                            
                            if(employee_num || job_position || department || employment_date) {
                                val.optional_info = {};
                                if(employee_num) {
                                    val.optional_info.employee_num = employee_num;
                                    delete val.employee_num;
                                }
                                if(employment_date) {
                                    val.optional_info.employment_date = Dates.parse(employment_date);
                                }
                                if(job_position) {
                                    job_position = job_position.toLowerCase().toCapitalCase();
                                    const job_position_list = await neonBinding.events.emit(this.props.path + "job-positions/list/filter", {name: job_position});
                                    if(job_position_list && !job_position_list.isEmpty()) {
                                        const job_position_obj = job_position_list.find(v => v.data.name.toLowerCase() === job_position.toLowerCase());
                                        if(job_position_obj) {
                                            const {id, data: {name}} = job_position_obj;
                                            if(job_category) {
                                                val.optional_info.job_position = {id, name: name.toLowerCase().toCapitalCase(), job_category};//{name: job_position, job_category};
                                            } else {
                                                val.optional_info.job_position = {id, name: name.toLowerCase().toCapitalCase()};
                                            }
                                        } else {
                                            val.optional_info.job_position = job_position;
                                        }
                                    } else {
                                        if(job_category) {
                                            val.optional_info.job_position = {name: job_position, job_category};
                                        } else {
                                            val.optional_info.job_position = job_position;
                                        }
                                    }
                                    delete val.job_position;
                                }
                                if(department) {
                                    department = department.toLowerCase().toCapitalCase();
                                    const department_list = await neonBinding.events.emit(this.props.path + "departments/list/filter", {name: department});
                                    if(department_list && !department_list.isEmpty()) {
                                        const department_obj = department_list.find(v => v.data.name.toLowerCase() === department.toLowerCase());
                                        if(department_obj) {
                                            const {id, data: {name}} = department_obj;
                                            val.optional_info.department = {id, name: name.toLowerCase().toCapitalCase()};
                                        } else {
                                            val.optional_info.department = department;
                                        }
                                    } else {
                                        val.optional_info.department = department;
                                    }
                                    delete val.department;
                                }
                            }
                            delete val.job_category;
                            
                            return val;
                        }));
                    }
                }).catch(err => {
                    infoDialog.open('An error occured. Please try again');
                }).finally(() => {
                    progressDialog.close();
//                    btn.text("Save").enabled();
                });
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {groupBy: {innerRefsList}}} = this;
        
        btn.text("Saving...").disabled();
        
//        console.log('groupBy.innerRefsList', innerRefsList)
        if(btn.saving) {
            return;
        }
        btn.saving = true;
        
        const tasks = innerRefsList.map(async (ref, n) => {
            try{
                const res = await ref.onSave();
                console.log('innerRefsList', n, res)
            } catch(err) {
                console.error('innerRefsList err ' + n, err)
            }
        });
        return tasks.reduce((promiseChain, currentTask) => {
            return promiseChain.then(chainResults =>
                currentTask.then(currentResult =>
                    [ ...chainResults, currentResult ]
                )
            );
        }, Promise.resolve([])).then(results => {
            // Do something with all results
//            alert(results)
            console.log('results', results)
            btn.text("Save All").enabled();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">    
                        <SelectClientInput ref="client" name="client" placeholder="Company..." required showAll className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project" placeholder="Project..." required showAll className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site" placeholder="Site..." required showAll className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <Button className="btn btn-primary hor-center margin-t-5" onClick={this.onUpload}>Upload Spread Sheet</Button>
                    </div>
                </div>
                <div className="row padding-0 pos-relative">
                    <ClearableInput name="group_by" type="radio" placeholder="Group By" values={this.state.lists.group_by} className="w-415 margin-t-30 -margin-b-5 fixed-center form-control"/>
                    <GroupBy ref="groupBy" control={this} state={this.state} path={this.path}/>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="GroupBy">
@observer
class GroupBy extends React.Component {

    @observable innerRefs = {};
    @observable reload = 0;
    
    constructor(props) {
        super(props);
        
        this.onReload = this.onReload.bind(this);
        this.renderItemGroup = this.renderItemGroup.bind(this);
    }
    
    onLoadList() {
        return Promise.resolve();
    }
    
    @computed get isJobPos() {
        const {state: {groupBy}} = this.props;
        return groupBy === "Job Position";
    }
    
    @computed get groups() {
        const {state: {list}} = this.props;
        let groups;
        if(this.isJobPos) {
            groups = list.groupBy(({fname, lname, id_num, passport_num, sex, dob, phone, email, optional_info = {}}) => {
                const {employee_num, employment_date, job_position, department} = optional_info;
                if(job_position) {
                    if(job_position.id) {
                        return job_position.name;
                    } else {
                        return job_position.name || job_position;
                    }
                } else {
                    return "N/A";
                }
            });
        } else {
            groups = list.groupBy(({fname, lname, id_num, passport_num, sex, dob, phone, email, optional_info = {}}) => {
                const {employee_num, employment_date, job_position, department} = optional_info;
                if(department) {
                    if(department.id) {
                        return department.name;
                    } else {
                        return department;
                    }
                } else {
                    return "N/A";
                }
            });
        }
        
        const groupList = Object.keys(groups).map(k => {
            const list = groups[k];
            return {name: k, list};
        });
        groupList.sortBy('name');
        return groupList;
    }
    
    get innerRefsList() {
        return Object.values(this.innerRefs);
    }
    
    async onReload() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.reload++;
                setTimeout(resolve, 100);
            });
        });
    }
    
    renderItemGroup(n, onClick) {
        const {control, path, state} = this.props;
        
        const {groups} = this;
        const group = groups[n];
        return <RenderItemGroup 
            key={"group-" + n + new Date().getTime()} 
            ref={ref => this.innerRefs[n] = ref} 
            control={control}
            path={path} 
            innerRefs={this.innerRefs} 
            onReload={this.onReload} 
            state={state} 
            groups={groups} 
            group={group} 
            idx={n}
        />;
    }
    
    render() {
        return <Table key={"Table-" + this.reload} className="w-full min-h-200 margin-0">
            <THead key={"THead-" + this.reload} >
                <div className="td fixed-flex min-w-95">Employee #</div> 
                <div className="td">Last Name</div>
                <div className="td">First Name</div>
                <div className="td fixed-flex min-w-110">ID #</div>
                <div className="td fixed-flex min-w-100">Passport #</div>
                <div className="td fixed-flex min-w-60">Gender</div>
                <div className="td fixed-flex min-w-90">DOB</div>
                <div className="td">Email Address</div> 
                <div className="td fixed-flex min-w-100">Phone #</div> 
                <div className="td fixed-flex min-w-140">Employment Date</div>
                {!this.isJobPos && <div className="td padding-l-0 padding-r-0 margin-r-10">Job Position [Category]</div>}
                {this.isJobPos && <div className="td padding-l-0 padding-r-0 margin-r-10">Department</div>}
            </THead>
            <TBody key={"TBody-" + this.reload} renderItem={this.renderItemGroup} list={this.groups} onLoadList={this.onLoadList}/>
        </Table>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderItemGroup">
@observer
class RenderItemGroup extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.destroy = this.destroy.bind(this);
        this.onCloseAll = this.onCloseAll.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onView = this.onView.bind(this);
        
        this.onSaveGroup = this.onSaveGroup.bind(this);
        this.onSave = this.onSave.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {state, group: {name}} = this.props;
        execWhen(() => this.refs.renameB && this.refs.saveGroupB && this.refs.verifyingB).then(() => {
            const {renameB, saveGroupB, verifyingB} = this.refs;
            if(verifyingB) {
                const node = $(verifyingB.getDOMNode());
                const span = node.find('span');

    //            console.log('state.list', state.list.slice())
                const saved = state.list.find(({optional_info = {}}) => {
                    const {job_position, department} = optional_info;
                    if(this.isJobPos && job_position) {
                        return !!job_position.id && job_position.name.toLowerCase() === name.toLowerCase();
                    } else if(department) {
                        return !!department.id && department.name.toLowerCase() === name.toLowerCase();
                    }
                    return false;
                });
                if(saved) {
                    span.text("Saved");
                    node.addClass('saved fa-check');
                    renameB.hide();
                    saveGroupB.hide();
                } else {
                    span.text("Unsaved");
                    node.addClass('unsaved fa-times');
                    renameB.show();
                    saveGroupB.show();
                }
            }
        });
    }
    // </editor-fold>
    
    @computed get isJobPos() {
        const {state: {groupBy}} = this.props;
        return groupBy === "Job Position";
    }
    
    // <editor-fold defaultstate="collapsed" desc="destroy">
    async destroy() {
        const {state, group: {list}, innerRefs, idx, onReload} = this.props;
        const {tbody} = this.refs;
            if(tbody) {
                tbody.list.clear();
                tbody.close();
            }
            list.forEach(v => {
                state.list.remove(v);
            });
            list.clear();
            
            const ref = innerRefs[idx];
            if(ref) {
                ref.refs.tbody.close();
                ref.refs.tbody.list.clear();
                delete innerRefs[idx];
            }
            
        return await onReload();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCloseAll">
    onCloseAll() {
        const {groups, innerRefs, idx} = this.props;
        groups.filter((group, n) => {
            if(n !== idx) {
                const ref = innerRefs[n];
                ref && ref.refs.tbody.close();
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onRename">
    onRename(evt, btn) {
        const {state, state: {groupBy}, groups, group: {name}, innerRefs, idx} = this.props;
        this.refs.inputDialog.open("Rename " + groupBy, name).then(text => {
            if(!text) return;
            if(text.isEmpty()) {
                infoDialog.open(groupBy + ' is required');
                return;
            }
            
            setTimeout(() => {
                text = text.toLowerCase().toCapitalCase();
                state.list.forEach(({optional_info = {}}) => {
                    const {job_position, department} = optional_info;
                    if(this.isJobPos && name === (job_position.name || job_position)) {
                        if(isString(optional_info.job_position)) {
                            optional_info.job_position = text;
                        } else if(isObject(optional_info.job_position)) {
                            optional_info.job_position.name = text;
                        }
                    } else if(name === (department.name || department)) {
                        if(isString(optional_info.department)) {
                            optional_info.department = text;
                        } else if(isObject(optional_info.department)) {
                            optional_info.department.name = text;
                        }
                    }
                    return false;
                });
            });
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onRemove">
    onRemove(evt, btn) {
        this.destroy();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onView">
    onView(evt, btn) {
        const {idx} = btn.props;
        this.onCloseAll(idx);
        const {tbody} = this.refs;
        tbody.toggle();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSaveGroup">    
    onSaveGroup(evt, btn) {
        const {state, state: {groupBy}, group: {name, list}, idx, control: {form}} = this.props;
        
        const {renameB, removeB, saveB} = this.refs;
        renameB.hide();
        removeB.hide();
        
        saveB.text('Saving ' + groupBy + '...').disabled();
        
//        const {idx} = btn.props;
        const node = $(btn.getDOMNode());
        node.find('span').text('Saving ' + groupBy + '...');
        btn.disabled();
        
        const {
            client
        } = form.data;
        
        if(this.isJobPos) {
            const {optional_info, optional_info: {job_position}} = state.list.find(({optional_info = {}}) => {
                const {job_position} = optional_info;
                return (job_position.name || job_position).toLowerCase() === name.toLowerCase();
            });
            
            neonBinding.events.emit(this.props.path + "job-positions/create", {
                name: job_position.name || job_position, 
                job_category: job_position.job_category,
                client: {id: client.id, name: client.data.name}
            }).then(job_position => {
                if(job_position) {
                    const {id, data: {name, job_category}} = job_position;
                    if(job_category) {
                        optional_info.job_position = {id, name, job_category};
                    } else {
                        optional_info.job_position = {id, name};
                    }
                    
                    infoDialog.open(groupBy + ' successfully saved');
                    infoDialog.close(3000);
                } else {
                    infoDialog.open(groupBy + " couldn't be saved. Please try again.");
                    infoDialog.close(4000);
                    
                    node.find('span').text('Save ' + groupBy);
                    btn.enabled();
                }
            }).finally(() => {
                renameB.show();
                removeB.show();
                saveB.text('Save').enabled();
            });
        } else {
            const {optional_info, optional_info: {department}} = state.list.find(({optional_info = {}}) => {
                const {department} = optional_info;
                return (department.name || department).toLowerCase() === name.toLowerCase();
            });
            neonBinding.events.emit(this.props.path + "departments/create", {
                name: name,
                client: {id: client.id, name: client.data.name}
            }).then(res => {
                if(department) {
                    const {id, data: {name}} = department;
                    optional_info.department = {id, name};
                    
                    infoDialog.open(groupBy + ' successfully saved');
                    infoDialog.close(3000);
                } else {
                    infoDialog.open(groupBy + " couldn't be saved. Please try again.");
                    infoDialog.close(4000);
                    
                    node.find('span').text('Save ' + groupBy);
                    btn.enabled();
                }
            }).finally(() => {
                renameB.show();
                removeB.show();
                saveB.text('Save').enabled();
            });
        }
    }
    // </editor-fold>
        
    // <editor-fold defaultstate="collapsed" desc="onSave">
    async onSave(evt, btn) {
        let {state, state: {groupBy}, group: {name, list}, control: {form}} = this.props;
        
        return execWhen(() => this.refs.saveB && this.refs.saveGroupB && this.refs.removeB).then(() => {
            const {saveB, saveGroupB, removeB} = this.refs;
//            if(saveB) {
                const {idx} = saveB.props;

                const saved = state.list.find(({optional_info = {}}) => {
                    const {job_position, department} = optional_info;
                    if(this.isJobPos && job_position) {
                        return !!job_position.id && job_position.name.toLowerCase() === name.toLowerCase();
                    } else if(department) {
                        return !!department.id && department.name.toLowerCase() === name.toLowerCase();
                    }
                    return false;
                });

                if(!saved) {
                    const saveGroupBJQ = $(saveGroupB.getDOMNode());
                    infoDialog.open('Please first save ' + name);
                    infoDialog.close(3000);

                    let count = 0;
                    const to = setInterval(() => {
                        saveGroupBJQ.toggleClass('show-warning');
                        if(count >= 4) {
                            clearInterval(to);
                            saveGroupBJQ.removeClass('show-warning');
                        } else {
                            count++;
                        }
                    }, 1250);
                    if(btn) {
                        return;
                    } else {
                        return "NOT_SAVED";
                    }
                }

                const {
                    site, project, client
                } = form.data;

                if(site || project || client) {
                    list = list.map(v => {
                        const data = {...v};
                        if(isDate(data.dob)) {
                            data.dob = data.dob.getTime();
                        }
                        if(data.optional_info) {
                            const {employment_date} = data.optional_info;
                            if(isDate(employment_date)) {
                                data.optional_info.employment_date = employment_date.getTime();
                            }
                        }
                        if(client) {
                            if(client.id) {
                                const {id, data: _data, name} = client;
                                data.client = {id, name: name || _data.name};
                            } else {
                                data.client = client;
                            }
                        }
                        if(project) {
                            if(project.id) {
                                const {id, data: _data, name} = project;
                                data.project = {id, name: name || _data.name};
                            } else {
                                data.project = project;
                            }
                        }
                        if(site) {
                            if(site.id) {
                                const {id, data: _data, name} = site;
                                data.site = {id, name: name || _data.name};
                            } else {
                                data.site = site;
                            }
                        }
                        return data;
                    });
                }

                removeB.hide();
                saveB.text('Saving ' + list.length + ' employee(s) in ' + name + '...').disabled();
                return neonBinding.events.emit(this.props.path + "import/create", toJS(list)).then(res => {
//                    const res = [];//{dups: []};
                    console.log("res", res)
                    if (res.dups) {
                        removeB.show();
                        saveB.text("Save").enabled();
                        infoDialog.open(<React.Fragment>
                            <p>The following employee email addresses already exist into the system</p>
                            {res.dups.map(v => <p>{v.email}</p>)}
                            <p>Each employee email address must be unique.<br />
                            This is due to the fact that email address is used as a username on the system.</p>
                        </React.Fragment>);
                    } else {
                        infoDialog.open(name + " " + res.length +  " employee(s) successfully saved.");
                        infoDialog.close(3000);
                        return this.destroy().then(() => {
                            return true;
                        });
                    }
                });
//            } else {
//                return new Promise((resolve, reject) => {
//                    setTimeout(() => {
//                        alert(name)
//                        this.onSave().then(resolve, reject);
//                    }, 500);
//                });
//            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {state, state: {groupBy}, group: {name, list}, idx} = this.props;
        
        return <div key={"item-group-" + idx} className="td-RenderItemGroup">
            <label className='title flex'>
                <span>
                    {idx + 1}. {name}
                    <Button ref="verifyingB" className='btn btn-primary fixed-flex fa group-actions-b verifying-b'>
                        <span>Verifying {name}...</span>
                    </Button>
                    <Button ref="saveGroupB" renderer={false} className='btn btn-primary fixed-flex fa fa-check group-actions-b save-b' onClick={this.onSaveGroup}>
                        <span>Save {groupBy}</span>
                    </Button>
                </span>
                <span className="fixed-flex min-w-150 text-right">{list.length} employee(s) |</span>
                <Button ref="renameB" idx={idx} className='btn btn-primary fixed-flex' text={'Rename ' + groupBy} onClick={this.onRename}/>
                <Button ref="removeB" idx={idx} className='btn btn-primary fixed-flex' text='Remove' onClick={this.onRemove}/>
                <Button ref="viewB" idx={idx} className='btn btn-primary fixed-flex' text='View' onClick={this.onView}/>
                <Button ref="saveB" idx={idx} className='btn btn-primary fixed-flex' text='Save' onClick={this.onSave}/>
            </label>
            <GroupByTBody key={idx + new Date().getTime()} ref="tbody" defaultValue={list} state={state} parentIdx={idx}/>
            <InputDialog ref="inputDialog"/>
        </div>;
    }
    // </editor-fold>
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="GroupByTBody">
@observer
class GroupByTBody extends ATableSavable {
    
    @observable selfState = {
        rendered: false
    };
    
    constructor(props) {
        super(props);
        
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    
    toggle() {
        this.selfState.rendered = !this.selfState.rendered;
    }
    
    close() {
        this.selfState.rendered = false;
    }
    
    @computed get isJobPos() {
        const {state: {groupBy}} = this.props;
        return groupBy === "Job Position";
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {fname, lname, id_num, passport_num, sex, dob, phone, email, optional_info = {}} = item;
        const {employee_num, employment_date, job_position, department} = optional_info;
        const job_category = job_position.job_category;
        return <TRow key={"item-" + n + new Date().getTime()}>
            <div className="td fixed-flex min-w-95">{employee_num || 'N/A'}</div>
            <div className="td">{lname}</div>
            <div className="td">{fname}</div>
            <div className="td fixed-flex min-w-110">{id_num}</div>
            <div className="td fixed-flex min-w-100">{passport_num}</div>
            <div className="td fixed-flex min-w-60">{sex || 'N/A'}</div>
            <div className="td fixed-flex min-w-90">{Dates.formatDate(dob) || 'N/A'}</div>
            <div className="td">{email || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{phone || 'N/A'}</div>
            <div className="td fixed-flex min-w-140">{Dates.formatDate(employment_date) || 'N/A'}</div>
            {!this.isJobPos && <div className="td padding-l-0">{job_position ? ((job_position.name || job_position) + (job_category ? (" ["+ job_category + "]") : "")) : 'N/A'}</div>}
            {this.isJobPos && <div className="td padding-l-0">{department || 'N/A'}</div>}
        </TRow>;
    }
    
    render() {
        if(!this.selfState.rendered) return null;
        const {parentIdx} = this.props;
        return (<TBody 
            key={"GroupByTBody-" + parentIdx + new Date().getTime()}
            ref="body" 
            title="Imported Employees" 
            className='GroupByTBody'
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            state={this.state}
            onLoadList={this.onLoadList}/>);
    }
}
// </editor-fold>

export default ImportDialog;