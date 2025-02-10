// <editor-fold defaultstate="collapsed" desc="import">
import React, {Suspense} from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import {execWhen} from 'utils/Utils';

import {Hierarchies} from 'components/hierarchies';
import PageLoadingProgress from 'components/PageLoadingProgress';

import {Button} from 'components/inputs';
import {Row} from 'components/FormComponents';

import EmployeeProfileDialog from 'views/plugins/plugin_hr_management/Employees/forms/ProfileDialog';
import NewOrganogramPersonDialog from "./NewOrganogramPersonDialog";

// </editor-fold>

@observer
class TypedWrapper extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        list: []
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onAdd = this.onAdd.bind(this);
        this.onAddImpl = this.onAddImpl.bind(this);
        this.create = this.create.bind(this);
    }
    // </editor-fold>
    
    componentWillMount()   {
        const {list = []} = this.props;
        this.state.list = list;
    }
    
    async getPrintCanvas() {
        return execWhen(() => this.refs.hierarchies).then(hierarchies => {
            return hierarchies.getPrintCanvas();
        });
    }
    
    onAdd(evt, btn) {
        this.onAddImpl();
    }
    
    // <editor-fold defaultstate="collapsed" desc="onAddImpl">
    onAddImpl(item, edit = false) {
        const {hierarchies, newDialog} = this.refs;
        const idx = this.list.indexOf(item);
        newDialog.open(item).then(item => {
            if(edit) {
                this.list.removeIf((item, _idx) => {
                    return idx === _idx;
                });
                this.list.insertAt(idx, item);
            } else {
                this.list.push(item);
            }
            hierarchies.update(this.listDisplay);
            
            const {onChange} = this.props;
            onChange && onChange(toJS(this.list), "list", this);
        });
    }
    // </editor-fold>
                 
    // <editor-fold defaultstate="collapsed" desc="create">                               
    create({employee, employee_list, team, employee_reported_to}, idx) {
        const {refName, readonly} = this.props;
        
        if(!employee) {
            employee_list = (employee_list ? employee_list.map((v) => v.employee || v) : (team ? team.list || team.data.list : [])).
            filter(employee => {
                const {id, data: employee_data} = employee;
                const {removed} = employee_data || employee;
                return !removed;
            });
        }
        
        const getTeamMember = function(item, id) {
            return (item.employee_list || (item.team ? item.team.list || team.data.list : [])).find(function(_item) {
                return _item.id === id;
            });
        };
        
        const createRef = function(btn) {
            const refName = organogramGetBtnRefName(btn);
            const {refs} = appBody.refs.activePage.refs.mainTabs.refs.tabContent.activeTab;
            return refs[refName].refs.controls.refs.typedWrapper;
        };
        const onRemove = function(btn, createRef, getTeamMember, isTeamMember) {
            const $this = createRef(btn);
            const {list, listDisplay, props: {onChange}, refs: {hierarchies}} = $this;
            organogramOnRemove(function (name) {
                const parentId = organogramGetParentId(btn);
                if(organogramIsTeam(btn)) {
                    list.removeIf(function(val) {
                        const {employee_list, team, employee_reported_to} = val;
                        return (employee_list || team) && employee_reported_to && (employee_reported_to.id === parentId);
                    });
                } else {
                    const removeItem = function() {
                        if(isTeamMember) {
                            const item = list.find(function(item) {
                                return getTeamMember(item, parseInt(btn.id));
                            });
                            if(item) {
                                const {employee_list, team} = item;
                                (employee_list || team.list || team.data.list).removeIf(function(val) {
                                    return val.id === parseInt(btn.id);
                                });
                            }
                        } else {
                            list.removeIf(function(val) {
                                return val.id === parseInt(btn.id);
                            });
                        }
                    };
                    removeItem();
                }
//
                hierarchies.update(listDisplay);
                onChange && onChange(list, name, $this);
            });
        };
        const onEdit = function(btn, createRef) {
            const parentId = organogramGetParentId(btn);
            const {list, onAddImpl} = createRef(btn);
//            organogramOnEdit(btn, list, onAddImpl);
            if(organogramIsTeam(btn)) {
                const item = list.find(function(val) {
                    const {employee_list, team, employee_reported_to} = val;
                    return (employee_list || team) && employee_reported_to && employee_reported_to.id === parentId;
                });
//                console.log('onEdit', item)
                onAddImpl(item, true);
            } else {
                const item = list.find(function(val) {
                    const {employee} = val;
                    return employee && employee.id === parseInt(btn.id);
                });
//                console.log('onEdit', item)
                onAddImpl(item, true);
            }            
        };
        const onAdd = function(btn, createRef) {
            const {list, onAddImpl} = createRef(btn);
//            organogramOnAdd(btn, list, onAddImpl);
            const item = list.find(function(val) {
                const {employee} = val;
                return employee && (employee.id === parseInt(btn.id));
            });
            onAddImpl({employee_reported_to: item.employee});
        };
        const onView = function(btn, createRef, getTeamMember, isTeamMember) {
            const {list, refs: {profileDialog}} = createRef(btn);
            
            const findItem = function() {
                const item = list.find(function(item) {
                    if(isTeamMember) {
                        return !!getTeamMember(item, parseInt(btn.id));
                    }
                    return item.employee && (item.employee.id === parseInt(btn.id));
                });
                if(isTeamMember && item) {
                    return getTeamMember(item, parseInt(btn.id));
                }
                return item;
            };
            const item = findItem();
            if(item) {
                profileDialog.open(isTeamMember ? item : item.employee);
            } else {
                
            }
        };
        
        if(!readonly) {
            const {list} = this;
            if(list.length === 1 && employee_reported_to) {
                setTimeout(() => {
                    this.list.push({employee: employee_reported_to});
                }, 0);
            }
        }
        
        const createOnClickRefs = function(hasTeamMember) {
            return `var createRef = ${createRef};` + (hasTeamMember ? ` var getTeamMember = ${getTeamMember};` : '');
        };
        
        const parentId = employee_reported_to ? employee_reported_to.id : "";
        if(employee) {
            const {id, data: employee_data} = employee;
            const {removed, profile_pic, lname, fname, job_position} = employee_data || employee;
            let jobPosition;
            if(job_position) {
                jobPosition = job_position.name;
            } else {
                jobPosition = "N/A";
            }

            let f = '<div style="text-align: center;">';
            f +=    `${lname} ${fname}`;
            f +=    '<div class="desc">';
            f +=        (profile_pic && profile_pic.dlUrls ? `<img src="${profile_pic.dlUrls[0]}"/>` : '<i class="fa fa-user"></i>');
            f +=        (`<p>${jobPosition}</p>`);
            f +=    '</div>';
            if(readonly) {
                f +=    `<button id="${id}" refName="profileDialog" class="btn btn-primary fa fa-eye" onclick="${createOnClickRefs(true)} (${onView})(this, createRef, getTeamMember);"/>`;
            } else {
                f +=    `<button id="${id}" refName="${refName}" class="btn btn-primary fa fa-times" onclick="${createOnClickRefs(true)} (${onRemove})(this, createRef, getTeamMember);"/>`;
                f +=    `<button id="${id}" refName="${refName}" class="btn btn-primary fa fa-pen" onclick="${createOnClickRefs()} (${onEdit})(this, createRef);"/>`;
                f +=    `<button id="${id}" refName="${refName}" class="btn btn-primary fa fa-plus" onclick="${createOnClickRefs()} (${onAdd})(this, createRef);"/>`;
            }
            f += '</div>';
            if(removed) {
                f += '<div class="removed"/>';
            }
            return [
                {'v': String(id), 'f': f},
                String(parentId), jobPosition
            ];
        } else {
            const id = parentId + "-team-" + idx;
            let f = '<div>';
            f +=    `<div class="team-header">${employee_list.length} Member(s)</div>`;
            f +=    '<ul>';
            employee_list.forEach((employee, n) => {
                const {id, data: employee_data} = employee;
                const {removed, profile_pic, lname, fname, job_position} = employee_data || employee;
                if(removed) {
                    f +=    '<li class="removed">';
                } else {
                    f +=    '<li>';
                }
                f +=    `${n + 1}. ${lname} ${fname}`;
                if(readonly) {
                    f +=    `<button id="${id}" refName="profileDialog" class="btn btn-primary fa fa-eye pull-right" onclick="${createOnClickRefs(true)} (${onView})(this, createRef, getTeamMember, true);"/>`;
                } else {
                    f +=    `<button id="${id}" refName="${refName}" class="btn btn-primary fa fa-times pull-right" onclick="${createOnClickRefs(true)} (${onRemove})(this, createRef, getTeamMember, true);"/>`;
                }
                f +=    '</li>';
            });
            f +=    '</ul>';
            if(readonly) {
//                f +=    `<button id="${id}" parentId="${parentId}" refName="profileDialog" class="btn btn-primary fa fa-eye" onclick="${createOnClickRefs(true)} (${onView})(this, createRef, getTeamMember);"/>`;
            } else {
                f +=    `<button id="${id}" parentId="${parentId}" refName="${refName}" class="btn btn-primary fa fa-times" onclick="${createOnClickRefs(true)} (${onRemove})(this, createRef, getTeamMember);"/>`;
                f +=    `<button id="${id}" parentId="${parentId}" refName="${refName}" class="btn btn-primary fa fa-pen" onclick="${createOnClickRefs()} (${onEdit})(this, createRef);"/>`;
            }
            f += '</div>';
            return [
                {'v': id, 'f': f},
                String(parentId), "Team"
            ];
        }
    }
    // </editor-fold>

    @computed get listDisplay() {
        return this.list.map(this.create);
    }

    // <editor-fold defaultstate="collapsed" desc="list">
    @computed get list() {
        return this.state.list;
//                .map(v => {
//            if(v.employee_list) {
//                v.employee_list.sort((a, b) => {
////                    console.log('sort', a.employee.data.lname, b.employee.data.lname)
//                    if(a.employee.data.lname > b.employee.data.lname) {
//                        return 1;
//                    }
//                    if(a.employee.data.lname < b.employee.data.lname) {
//                        return -1;
//                    }
//                    return 0;
//                });
//            }  
//            return v;
//        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {readonly, onFormOpen, onFormBack, state = {}} = this.props;
        const idx = readonly ? 1 : 2;
        const {showTyping} = state;
        if(!readonly && !showTyping) return null;
        return <Row 
            rendered 
            idx={idx}
            title={idx + ". Typed Organogram Structure"}
            className="row-source"
            onFormOpen={onFormOpen} 
            onFormBack={onFormBack}>
            {!readonly && <Button className="btn btn-primary hor-center margin-t-10 margin-b-20" onClick={this.onAdd}>
                <i className="fa fa-plus"/> Add Person To Organogram
            </Button>}
            <Suspense fallback={<PageLoadingProgress/>}>
                <Hierarchies ref='hierarchies' list={this.listDisplay}/>
            </Suspense>
            {!readonly && <NewOrganogramPersonDialog ref="newDialog"/>}
            {readonly && <EmployeeProfileDialog ref="profileDialog"/>}
        </Row>
    }
    // </editor-fold>
}

export default TypedWrapper;
