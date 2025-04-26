// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, toJS} from 'mobx';

import {Dates, execWhen} from 'utils/Utils';

import {Button} from 'components/inputs';
import {InputDialog} from 'components/dialogs';

import {insertDepartment, insertEmployeeImported, insertJobPosition} from "mutations/create";
import GroupByTBody from "./GroupByTBody";
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

    @computed get isJobPos() {
        const {state: {groupBy}} = this.props;
        return groupBy === "Job Position";
    }

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {state, group: {name}} = this.props;
        execWhen(() => this.refs.renameB && this.refs.saveGroupB && this.refs.verifyingB).then(() => {
            const {renameB, saveGroupB, verifyingB} = this.refs;
            if (verifyingB) {
                const node = $(verifyingB.getDOMNode());
                const span = node.find('span');

                //            console.log('state.list', state.list.slice())
                const saved = state.list.find(({job_position, department}) => {
                    if (this.isJobPos && job_position) {
                        return !!job_position.id && job_position.name.toLowerCase() === name.toLowerCase();
                    } else if (department) {
                        return !!department.id && department.name.toLowerCase() === name.toLowerCase();
                    }
                    return false;
                });
                if (saved) {
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

    // <editor-fold defaultstate="collapsed" desc="destroy">
    async destroy() {
        const {state, group: {list}, innerRefs, idx, onReload} = this.props;
        const {tbody} = this.refs;
        if (tbody) {
            tbody.list.clear();
            tbody.close();
        }
        list.forEach(v => {
            state.list.remove(v);
        });
        list.clear();

        const ref = innerRefs[idx];
        if (ref) {
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
            if (n !== idx) {
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
            if (!text) return;
            if (text.isEmpty()) {
                infoDialog.open(groupBy + ' is required');
                return;
            }

            setTimeout(() => {
                text = text.toLowerCase().toCapitalCase();
                state.list.forEach((v) => {
                    const {job_position, department} = v;
                    if (this.isJobPos && name === (job_position.name || job_position)) {
                        if (isString(job_position)) {
                            v.job_position = text;
                        } else if (isObject(job_position)) {
                            v.job_position.name = text;
                        }
                    } else if (name === (department.name || department)) {
                        if (isString(department)) {
                            v.department = text;
                        } else if (isObject(department)) {
                            v.department.name = text;
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

        if (this.isJobPos) {
            const foundItem = state.list.filter(({job_position}) => !!job_position).find(({job_position}) => {
                return (job_position.name || job_position).toLowerCase() === name.toLowerCase();
            });

            const {job_position} = foundItem || {};

            const new_job_position = {
                name: job_position ? job_position.name || job_position : name,
                job_category: job_position && job_position.job_category,
                client_id: client.id,
            };
            if (job_position && job_position.job_category) {
                new_job_position.job_category = {data: job_position.job_category};
            }

            insertJobPosition(new_job_position).then(job_position => {
                if (job_position) {
                    const {id, data: {name, job_category}} = job_position;
                    // if(job_category) {
                    //     optional_info.job_position = {id, name, job_category};
                    // } else {
                    //     optional_info.job_position = {id, name};
                    // }

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
            const {department} = state.list.find(({department}) => {
                return (department.name || department).toLowerCase() === name.toLowerCase();
            });
            insertDepartment({
                name: name,
                client_id: client.id,
            }).then(res => {
                if (department) {
                    const {id, data: {name}} = department;
                    // optional_info.department = {id, name};

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

            const {is: {isContractor}} = storage;

            const saved = state.list.find(({job_position, department}) => {
                if (this.isJobPos && job_position) {
                    return !!job_position.id && job_position.name.toLowerCase() === name.toLowerCase();
                } else if (department) {
                    return !!department.id && department.name.toLowerCase() === name.toLowerCase();
                }
                return false;
            });

            if (!saved) {
                const saveGroupBJQ = $(saveGroupB.getDOMNode());
                infoDialog.open('Please first save ' + name);
                infoDialog.close(3000);

                let count = 0;
                const to = setInterval(() => {
                    saveGroupBJQ.toggleClass('show-warning');
                    if (count >= 4) {
                        clearInterval(to);
                        saveGroupBJQ.removeClass('show-warning');
                    } else {
                        count++;
                    }
                }, 1250);
                if (btn) {
                    return;
                } else {
                    return "NOT_SAVED";
                }
            }

            const {
                site, project, client
            } = form.data;

            if (site || project || client) {
                list = list.map(v => {
                    return {
                        ...v,
                        client_id: client && client.id,
                        project_id: project && project.id,
                        site_id: site && site.id,
                        contractor_client_id: isContractor ? (client && client.id) : null,
                        contractor_site_id: isContractor ? (site && site.id) : null,
                        dob: Dates.formatDateSQL(v.dob),
                        employment_date: Dates.formatDateSQL(v.employment_date),
                    };
                });
            }

            removeB.hide();
            saveB.text('Saving ' + list.length + ' employee(s) in ' + name + '...').disabled();
            return insertEmployeeImported(toJS(list)).then(res => {
//                    const res = [];//{dups: []};
                console.log("res", res)
                if (res.dups_email || res.dups_phone) {
                    removeB.show();
                    saveB.text("Save").enabled();
                    infoDialog.open(<>
                        {res.dups_email && <>
                            <p>The following employee email addresses already exist into the system</p>
                            {res.dups_email.map(v => <p>{v.email}</p>)}
                            <p>Each employee email address must be unique.</p>
                        </>}
                        {res.dups_phone && <>
                            <p>The following employee phone numbers already exist into the system</p>
                            {res.dups_phone.map(v => <p>{v.phone}</p>)}
                            <p>Each employee phone number must be unique.</p>
                        </>}
                    </>);
                } else {
                    infoDialog.open(name + " " + res.length + " employee(s) successfully saved.");
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
                    <Button ref="saveGroupB" renderer={false}
                            className='btn btn-primary fixed-flex fa fa-check group-actions-b save-b'
                            onClick={this.onSaveGroup}>
                        <span>Save {groupBy}</span>
                    </Button>
                </span>
                <span className="fixed-flex min-w-150 text-right">{list.length} employee(s) |</span>
                <Button ref="renameB" idx={idx} className='btn btn-primary fixed-flex' text={'Rename ' + groupBy}
                        onClick={this.onRename}/>
                <Button ref="removeB" idx={idx} className='btn btn-primary fixed-flex' text='Remove'
                        onClick={this.onRemove}/>
                <Button ref="viewB" idx={idx} className='btn btn-primary fixed-flex' text='View' onClick={this.onView}/>
                <Button ref="saveB" idx={idx} className='btn btn-primary fixed-flex' text='Save' onClick={this.onSave}/>
            </label>
            <GroupByTBody key={idx + new Date().getTime()} ref="tbody" defaultValue={list} state={state}
                          parentIdx={idx}/>
            <InputDialog ref="inputDialog"/>
        </div>;
    }

    // </editor-fold>
}

// </editor-fold>

export default RenderItemGroup;