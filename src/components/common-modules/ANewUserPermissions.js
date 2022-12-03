// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';
import {ATableSavable, Table, TBody, THead, TRow} from '../tables';
import {Button} from '../inputs';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ANewUserPermissions">
@observer
class ANewUserPermissions extends ATableSavable {
    @observable
    selfState = {
        lists: {}
    };

    constructor(props, args = {}) {
        super(props);

        const {plugin, key} = args;

        if (plugin) {
            let {selectedList, readonly} = props;

            const {selectedClientModules: {[plugin]: defaultList}} = storage.selected;

            if (selectedList) {
                selectedList = selectedList.filter(v => moduleManager.isInPlugin(v, key)).map(v => {
                    if (!('create' in v.actions)) {
                        extendObservable(v.actions, {create: false});
                    }
                    if (!('edit' in v.actions)) {
                        extendObservable(v.actions, {edit: false});
                    }
                    if (!('view' in v.actions)) {
                        extendObservable(v.actions, {view: false});
                    }
                    if (!('remove' in v.actions)) {
                        extendObservable(v.actions, {remove: false});
                    }
                    if (!('share' in v.actions)) {
                        extendObservable(v.actions, {share: false});
                    }
                    return v;
                });
                const newList = defaultList.filter(({key, desc, actions}) => {
                    return selectedList.noneMatch(v => {
                        return key === v.key;
                    });
                });
                selectedList.sortBy('status');
                selectedList.sortBy('desc');
                this.state.list = [...newList, ...selectedList];
            } else {
                defaultList.sortBy('status');
                defaultList.sortBy('desc');
                this.state.list = defaultList;
            }

            if (!readonly) {
                const {onChange, name} = props;
                onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);
            }
        }

        this.selectAll = this.selectAll.bind(this);
        this.unselectAll = this.unselectAll.bind(this);
        this.onChangeInternal = this.onChangeInternal.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    selectAll() {
        const {name} = this.props;
        console.log(this)
        this.list.forEach(({actions}) => {
            actions.create = true;
            actions.edit = true;
            actions.view = true;
            actions.remove = true;
            actions.share = true;
        });
        this.props.onChange && this.props.onChange(toJS(this.list), name, this);
    }

    unselectAll() {
        const {name} = this.props;
        this.list.forEach(({actions}) => {
            actions.create = false;
            actions.edit = false;
            actions.view = false;
            actions.remove = false;
            actions.share = false;
        });
        this.props.onChange && this.props.onChange(toJS(this.list), name, this);
    }

    onChangeInternal() {
        const {name} = this.props;
        const list = toJS(this.list);
        list.sortBy('status');
        list.sortBy('desc');
        this.onChange(list, name, this);
        this.props.onChange && this.props.onChange(list, name, this);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {readonly} = this.props;
        return <TRow key={"item-" + n} className="tr-readonly w-full">
            <div className="td td-question"><h5 className="no-margin">{item.desc}</h5></div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
                <ButtonWrapper item={item} readonly={readonly} action="create" onChange={this.onChangeInternal}/>
            </div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
                <ButtonWrapper item={item} readonly={readonly} action="edit" onChange={this.onChangeInternal}/>
            </div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
                <ButtonWrapper item={item} readonly={readonly} action="view" onChange={this.onChangeInternal}/>
            </div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
                <ButtonWrapper item={item} readonly={readonly} action="remove" onChange={this.onChangeInternal}/>
            </div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
                <ButtonWrapper item={item} readonly={readonly} action="share" onChange={this.onChangeInternal}/>
            </div>
        </TRow>;
    }

    render() {
        return (<Table className="pull-left">
            <THead>
                <div className="td">Permission</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">Create</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">Edit</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">View</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">Delete</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60 margin-r-10">Share</div>
            </THead>
            <TBody ref="body" title="Permission" renderItem={this.renderItem} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonWrapper">
@observer
class ButtonWrapper extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e, btn) {
        const {item: {actions}, action, onChange} = this.props;
        actions[action] = !actions[action];
        onChange();
    }

    @computed
    get isChecked() {
        const {item: {actions}, action} = this.props;
        return actions[action];
    }

    render() {
        const {readonly} = this.props;
        return <Button readonly={readonly} className="btn btn-primary hor-center w-40" onClick={this.onChange}>
            {this.isChecked ? <i className="fa fa-check"/> : <i className="fa fa-times"/>}
        </Button>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissions">
@observer
class NewUserModulePermissions extends ANewUserPermissions {

    constructor(props) {
        super(props);

        let {selectedList} = this.props;

        const {selectedClientModules: {permissions: defaultList}} = storage.selected;

        if (selectedList) {
            selectedList = selectedList.map(v => {
                if (!('create' in v.actions)) {
                    extendObservable(v.actions, {create: false});
                }
                if (!('edit' in v.actions)) {
                    extendObservable(v.actions, {edit: false});
                }
                if (!('view' in v.actions)) {
                    extendObservable(v.actions, {view: false});
                }
                if (!('remove' in v.actions)) {
                    extendObservable(v.actions, {remove: false});
                }
                if (!('share' in v.actions)) {
                    extendObservable(v.actions, {share: false});
                }
                return v;
            });
            const newList = defaultList.filter(({key, desc, actions}) => {
                return selectedList.noneMatch(v => {
                    return key === v.key;
                });
            });
            selectedList.sortBy('status');
            selectedList.sortBy('desc');
            this.state.list = [...newList, ...selectedList];

        } else {
            defaultList.sortBy('status');
            defaultList.sortBy('desc');
            this.state.list = defaultList;
        }
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsBySHEQ">
@observer
class NewUserModulePermissionsBySHEQ extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_sheq_assist", plugin: "permissionsSHEQ"});
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsByHR">
@observer
class NewUserModulePermissionsByHR extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_hr_management", plugin: "permissionsHR"});
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsByClaim">
@observer
class NewUserModulePermissionsByClaim extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_claim_management", plugin: "permissionsClaim"});
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsByExtra">
@observer
class NewUserModulePermissionsByExtra extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_extra", plugin: "permissionsExtra"});
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserOtherPermissions">
@observer
class NewUserOtherPermissions extends ANewUserPermissions {

    constructor(props) {
        super(props);

        let {selectedList} = this.props;

        let defaultList = [...defaultOtherPermissions];

        if (selectedList) {
            selectedList = selectedList.filter(v => {
                return defaultOtherPermissions.contains(v.key);
            }).map(v => {
                if (!('create' in v.actions)) {
                    extendObservable(v.actions, {create: false});
                }
                if (!('edit' in v.actions)) {
                    extendObservable(v.actions, {edit: false});
                }
                if (!('view' in v.actions)) {
                    extendObservable(v.actions, {view: false});
                }
                if (!('remove' in v.actions)) {
                    extendObservable(v.actions, {remove: false});
                }
                if (!('share' in v.actions)) {
                    extendObservable(v.actions, {share: false});
                }
                return v;
            });
            const newList = defaultList.filter(key => {
                return selectedList.noneMatch(v => {
                    return key === v.key;
                });
            });
            selectedList.sortBy('status');
            selectedList.sortBy('desc');
            this.state.list = [...newList, ...selectedList];
        } else {
            defaultList.sortBy('status');
            defaultList.sortBy('desc');
            this.state.list = defaultList;
        }
//        console.log('NewUserOtherPermissions', this.state.list.slice())
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="defaultOtherPermissions">
window.defaultOtherPermissions = [
    //
    'Sectors',
    //
    'Clients', //done
    'Projects', //done
    'Sites', //done
    //
    'Users', //done
    //
    'Blacklisting',
    'Permissions',
    'Notifications Settings',
    //
    'Appointments', //done
    'Job Positions', //done
    'Departments', //done
    'Teams', //done
//    'Planned Job Observations', //done
    //
    'Quick Incident',
    'Contractor Documents', //done
    //
    'Document Categories',
//    'Audit Logs', //done: only view
//    'Settings'
].map(title => {
    return {key: title, desc: title, actions: {create: false, edit: false, view: false, remove: false, share: false}};
});
// </editor-fold>

export {
    NewUserModulePermissions,
    NewUserModulePermissionsBySHEQ,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsByClaim,
    NewUserModulePermissionsByExtra,
    NewUserOtherPermissions
};