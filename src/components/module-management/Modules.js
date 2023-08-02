// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import {Button} from '../inputs';
//import StripeForm from '../../components/stripe/StripeForm';
import {ModuleRenderer} from '../../components/FormComponents';
import {PluginsView} from '../../components/page-lists';

import SelectClientDialog from './SelectClientDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Modules">
@observer
class Modules extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        installed_permissions_modules: [],
        installed_plugins: []
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onInstall = this.onInstall.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onFilterAllInstalledSHEQ = this.onFilterAllInstalledSHEQ.bind(this);
        this.onFilterAllInstalledHR = this.onFilterAllInstalledHR.bind(this);
        this.onFilterAllInstalledClaim = this.onFilterAllInstalledClaim.bind(this);
        this.onFilterAllInstalledExtra = this.onFilterAllInstalledExtra.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onInfo">
    onInfo(e, el) {
        const {plugin, module} = el.props;
        let elem = window.$(e.target);
        const offset = elem.offset();
        const style = {left: offset.left, right: "auto", top: "auto", bottom: -offset.top + 10, width: 400};
        popover.settings({
            className: 'ModuleInfoPopover',
            style,
            contentNode: <div>{module.desc}</div>
        }).open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onInstall">
    onInstall(e, el) {
        const {module} = el.props;
        const {isConsultant} = storage.is;

        const {installed_permissions_modules: modules} = this.state;
        const isInstalled = modules.anyMatch(v => v.key === module.key);
        if (isInstalled) {
            module.company_list_added.clear();
            modules.remove(module);
            this.onChange();
        } else {
            const onAdd = (company_list_added) => {
                module.company_list_added = company_list_added;
                modules.push(module);
                this.onChange();
            };

            if (isConsultant) {
                const {selectClientDialog} = this.refs;
                const company_list = module.company_list_added || [];
                selectClientDialog.extraProp('company_list', company_list).open().then(onAdd);
            } else {
                const {loggedUser: {company}} = storage;
                onAdd([company]);
            }
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange">
    onChange() {
        const {name, onChange} = this.props;
        const {installed_permissions_modules: modules} = this.state;
        onChange(modules.map(v => {
            if (v.company_list_added) {
                v.company_list_added = v.company_list_added.map(toJS).slice();
            }
            return toJS(v);
        }).slice(), name, this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onFilter">
    onFilter(list) {
        return list.filter(item => item.key !== 'Dashboard' && item.status === 'Installed');
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onFilterAllInstalledSHEQ, onFilterAllInstalledHR, onFilterAllInstalledClaim, onFilterAllInstalledExtra">
    onFilterAllInstalledSHEQ(modules) {
        return onFilterByPluginName.call(this, "plugin_sheq_assist", modules);
    }

    onFilterAllInstalledHR(modules) {
        return onFilterByPluginName.call(this, "plugin_hr_management", modules);
    }

    onFilterAllInstalledClaim(modules) {
        return onFilterByPluginName.call(this, "plugin_claim_management", modules);
    }

    onFilterAllInstalledExtra(modules) {
        return onFilterByPluginName.call(this, "plugin_extra", modules);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(item, n) {
        const {installed_permissions_modules} = this.state;
        const isInstalled = installed_permissions_modules.anyMatch(v => v.key === item.key);       
        return <ModuleRenderer item={item} idx={n} isInstalled={isInstalled} isInstallable={true}>
            <InstallEachBtn state={this.state} item={item}/>
        </ModuleRenderer>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isConsultant} = storage.is;
        return <React.Fragment>
            <PluginsView
                loadNewList
                title='SHEQ Management Modules'
                onFilterAll={this.onFilterAllInstalledSHEQ}
                renderModuleItem={this.renderItem}
                gridClassName="padding-5 grid-view grid-6 grid-md-6 grid-sm-6 grid-xs-4 grid-xxs-2 grid-gap-5">
                <Header state={this.state} pluginKey="plugin_sheq_assist" title="SHEQ Management Modules"
                        onChange={this.onChange}/>
            </PluginsView>
            <Totals state={this.state} pluginKey="plugin_sheq_assist"/>

            <PluginsView
                loadNewList
                title='Human Resource Management Modules'
                onFilterAll={this.onFilterAllInstalledHR}
                renderModuleItem={this.renderItem}
                gridClassName="padding-5 grid-view grid-6 grid-md-6 grid-sm-6 grid-xs-4 grid-xxs-2 grid-gap-5">
                <Header state={this.state} pluginKey="plugin_hr_management" title="Human Resource Management Modules"
                        onChange={this.onChange}/>
            </PluginsView>
            <Totals state={this.state} pluginKey="plugin_hr_management"/>

            <PluginsView
                loadNewList
                title='Claim Management Modules'
                onFilterAll={this.onFilterAllInstalledClaim}
                renderModuleItem={this.renderItem}
                gridClassName="padding-5 grid-view grid-6 grid-md-6 grid-sm-6 grid-xs-4 grid-xxs-2 grid-gap-5">
                <Header state={this.state} pluginKey="plugin_claim_management" title="Claim Management Modules"
                        onChange={this.onChange}/>
            </PluginsView>
            <Totals state={this.state} pluginKey="plugin_claim_management"/>

            <PluginsView
                loadNewList
                title='Extra Modules'
                onFilterAll={this.onFilterAllInstalledExtra}
                renderModuleItem={this.renderItem}
                gridClassName="padding-5 grid-view grid-6 grid-md-6 grid-sm-6 grid-xs-4 grid-xxs-2 grid-gap-5">
                <Header state={this.state} pluginKey="plugin_extra" title="Extra Modules" onChange={this.onChange}/>
            </PluginsView>
            <Totals state={this.state} pluginKey="plugin_extra"/>

            <SelectClientDialog ref="selectClientDialog"/>
        </React.Fragment>;
    }

    // </editor-fold>
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InstallEachBtn">
@observer
class InstallEachBtn extends React.Component {
    render() {
        const {state, item} = this.props;
        const {installed_permissions_modules} = state;
        const isInstalled = installed_permissions_modules.anyMatch(v => v.key === item.key);
        if (isInstalled) {
            return <React.Fragment>
                <i className="fa fa-minus"/> Uninstall
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <i className="fa fa-plus"/> Install
            </React.Fragment>;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Header">
@observer
class Header extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onInstallAll = this.onInstallAll.bind(this);
        this.onUnInstallAll = this.onUnInstallAll.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onInstallAll">
    onInstallAll(e, el) {
        const {props: {pluginKey, onChange}, modules} = this;
        const {installed_permissions_modules: list = []} = this.props.state;
        list.push(...modules);
        const copy = [...list.distinct()];
        list.clear();
        list.push(...copy);
        onChange(pluginKey);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onUnInstallAll">
    onUnInstallAll(e, el) {
        const {props: {pluginKey, onChange}, modules} = this;
        const {installed_permissions_modules: list = []} = this.props.state;
//        list.removeAll(modules);
        setTimeout(() => {
            modules.forEach(v => {
                list.remove(v);
            });
            onChange(pluginKey);
        });
    }

    // </editor-fold>

    @computed get modules() {
        const {pluginKey} = this.props;
        const {listAll} = pluginManager;
        const plugin = listAll.find(({data: {key, status}}) => status === 'Installed' && key === pluginKey);
        if (!plugin) return [];
        return plugin.data.module_list.filter(({status}) => status === 'Installed');
    }

    @computed get allInstalled() {
        const {modules} = this;
        const {installed_permissions_modules: list} = this.props.state;
        return list.allMatch(v1 => modules.anyMatch(v2 => v2.key === v1.key));
    }

    @computed get showUninstall() {
        const {modules} = this;
        const {installed_permissions_modules: list} = this.props.state;
        return list.anyMatch(v1 => modules.anyMatch(v2 => v2.key === v1.key));
    }

    render() {
        const {modules, props: {state: {installed_permissions_modules: list}, title}} = this;
        if (!modules || modules.isEmpty()) return null;
        return <h4>
            {title}
            <Button className="btn btn-primary pull-right fixed-flex font-size-11 border-radius-t-20"
                    onClick={this.onInstallAll}>
                <i className="fa fa-plus"/> Install All
            </Button>
            {this.showUninstall &&
                <Button className="btn btn-primary pull-right fixed-flex font-size-11 border-radius-t-20"
                        onClick={this.onUnInstallAll}>
                    <i className="fa fa-minus"/> Uninstall All
                </Button>}
        </h4>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Totals">
@observer
class Totals extends React.Component {
    @computed get modules() {
        const {pluginKey} = this.props;
        const {listAll} = pluginManager;
        const plugin = listAll.find(({data: {key, status}}) => status === 'Installed' && key === pluginKey);
        if (!plugin) return [];
        return plugin.data.module_list.filter(({status}) => status === 'Installed');
    }

    render() {
        const {modules, props: {state}} = this;
        if (!modules || modules.isEmpty()) return null;
        return <div className="totals fixed-flex flex font-size-12 border-radius-b-20">
            <span className="total-modules-installed fixed-flex">
                Modules Installed
                <SubTotalModulesInstalled state={state} modules={modules}/>
            </span>
            <span className="total-price fixed-flex">
                Total Price
                <SubTotalPrice state={state} modules={modules}/>
            </span>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SubTotalPrice">
@observer
class SubTotalPrice extends React.Component {

    @computed get total() {
        const {props: {state: {installed_permissions_modules: list}, modules}} = this;
        return list.filter(v1 => modules.anyMatch(v2 => v2.key === v1.key)).map(v => v.price || 0).reduce((v1, v2) => v1 + v2, 0);
    }

    render() {
        return <b> {this.total.toCurrency('R ')}</b>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SubTotalModulesInstalled">
@observer
class SubTotalModulesInstalled extends React.Component {

    @computed get countInstalled() {
        const {props: {state: {installed_permissions_modules: list}, modules}} = this;
        return list.filter(v1 => modules.anyMatch(v2 => v2.key === v1.key)).length;
    }

    render() {
        return <b> {this.countInstalled}</b>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onFilterByPluginName">
function onFilterByPluginName(pluginKey, __modules) {
    const {listAll} = pluginManager;
    const plugin = listAll.find(val => val.data.key === pluginKey);
    if (!plugin) return [];
    const {selectedClientModules: {listNew: modules}} = storage.selected;
    return modules.filter(item => item.key !== 'Dashboard' && item.status === 'Installed')
        .filter(v => plugin.data.module_list.anyMatch(m => m.key === v.key))
        .filter(item => __modules.anyMatch(v2 => v2.key === item.key))
        .map(item => __modules.find(v2 => v2.key === item.key));
}

// </editor-fold>

export default Modules;
