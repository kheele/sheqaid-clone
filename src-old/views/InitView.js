import React from "react";
import {observer} from 'mobx-react';
import {autorun} from 'mobx';

import {PluginsView} from '../components/page-lists';
import {Button} from '../components/inputs';
import Popover from '../components/popovers/Popover';
import {execWhen, Permissions} from '../utils/Utils';
import Footer from './Footer';

import style from "./InitView.lazy.css";

@observer
class InitView extends React.Component {

    constructor(props) {
        super(props);

        this.showScrollbars = this.showScrollbars.bind(this);
        this.removeScrollbars = this.removeScrollbars.bind(this);

        this.onInfo = this.onInfo.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        autorun(() => {
            if (!loggedInApp.isDefaultOverMainView) {
                this.showScrollbars();
            } else {
                this.removeScrollbars();
            }
        });
    }

    componentWillUnmount() {
        style.unuse();
        this.removeScrollbars();
    }

    showScrollbars() {
        const {contentView} = this.refs;
        if (!contentView)
            return;
//        $(contentView).showScrollbars(0.4, "rgb(2,168,168)");
    }

    removeScrollbars() {
        const {contentView} = this.refs;
        if (!contentView)
            return;
//        $(contentView).removeScrollbars();
    }

    onInfo(e, el) {
        const {module} = el.props;
        let elem = window.$(e.target);
        const offset = elem.offset();
        const style = {left: offset.left, right: "auto", top: "auto", bottom: -offset.top + 10, width: 400};
        this.refs.popover.settings({
            className: 'ModuleInfoPopover',
            style,
            contentNode: <div>{module.desc}</div>
        }).open();
    }

    async onClick(e, el) {
        const {module} = el.props;

        let allow;
        if (storage.is.isEmployee) {
            allow = true;
        } else {
            allow = await execWhen(() => {
                try {
                    const {permissions_modules} = storage.loggedUser.user.data;
                    return !permissions_modules || permissions_modules.find(v => v.key === module.key);
                } catch (e) {
                    console.error('InitView', e);
                    return undefined;
                }
            })
        }

        if (allow) {
            execWhen(() => !!loggedInApp && !!loggedInApp.refs && !!loggedInApp.refs.mainView).then(() => {
                loggedInApp.refs.mainView.navigate(module);
            });
        }
    }

    render() {
        const {is: {isContractorView, isContractorViewIncContractorPack}} = storage;
        if (isContractorView && !isContractorViewIncContractorPack) return null;

        return <div ref="rootView" key="initView" className="InitView">
            <div ref="contentView" className="view-content nice-scrollbars">
                <InitViewAdmin onInfo={this.onInfo} onClick={this.onClick}/>
                <InitViewClientOrNonConsultant onInfo={this.onInfo} onClick={this.onClick}/>
                <InitViewContractor onInfo={this.onInfo} onClick={this.onClick}/>
                <InitViewEmployee onInfo={this.onInfo} onClick={this.onClick}/>
                <InitViewNotSelected/>
                <Footer/>
            </div>
            <Popover key="popover" ref="popover"/>
        </div>;
    }

}

@observer
class InitViewAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterAll(modules) {
        return onFilterImpl(modules).filter(item => {
            const {permissions_modules} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_modules || []).find(v => v.key === item.key);
            const allow = Permissions.allow(permissions_mod);
            return allow;
        });
    }

    renderItem(item, idx) {
        const {color, key, svgIconLeft, faIconLeft, title} = item;

        const {onInfo, onClick} = this.props;
        const {permissions_modules} = storage.loggedUser.user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === key);
        const allow = Permissions.allow(permissions_mod);

        return <ItemRenderer key={key} idx={idx} item={item} allow={allow} onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        if (!isAdminApp) return null;

        return <PluginsView
            title=''
            onFilterAll={this.onFilterAll}
            renderModuleItem={this.renderItem}
        />;
    }
}

@observer
class InitViewClientOrNonConsultant extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterAll(modules) {
        return onFilterImpl(modules).filter(item => {
            const {permissions_modules} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_modules || []).find(v => v.key === item.key);
            const allow = Permissions.allow(permissions_mod);
            return allow;
        });
    }

    onFilterReadonly(modules) {
        return onFilterImpl(modules).filter(item => {
            const {permissions_modules} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_modules || []).find(v => v.key === item.key);
            const disallow = Permissions.disallow(permissions_mod);
            return disallow;
        });
    }

    renderItem(item, idx) {
        const {color, key, svgIconLeft, faIconLeft, title} = item;

        const {onInfo, onClick} = this.props;
        const {permissions_modules} = storage.loggedUser.user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === key);
        const allow = Permissions.allow(permissions_mod);

        return <ItemRenderer key={key} idx={idx} item={item} allow={allow} onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        const {selected: {selectedClient}, is: {isConsultant, isEmployee, isContractorViewIncContractorPack}} = storage;
        if (isEmployee || isContractorViewIncContractorPack) return null;
        if (isConsultant && !selectedClient) return null;
//        if(!isConsultant) return null;

        return <PluginsView
            title=''
            onFilterReadonly={this.onFilterReadonly}
            onFilterAll={this.onFilterAll}
            renderModuleItem={this.renderItem}
        />;
    }
}

@observer
class InitViewContractor extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterReadonly(modules) {
        const {contractorAllowedModules} = moduleManager;
        return onFilterImpl(modules).filter(item => {
            if (item.key === "__B_Contractors") return false;

            const disallow = !contractorAllowedModules.contains(item.key);
            return disallow;
        });
    }

    onFilterAll(modules) {
        const {contractorAllowedModules} = moduleManager;
        return onFilterImpl(modules).filter(item => {
            if (item.key === "__B_Contractors") return false;

            const allow = contractorAllowedModules.contains(item.key);
            return allow;
        });
    }

    renderItem(item, idx) {
        const {color, key, svgIconLeft, faIconLeft, title} = item;
        if (key === "__B_Contractors") return null;

        const {onInfo, onClick} = this.props;

        const {contractorAllowedModules} = moduleManager;
        const allow = contractorAllowedModules.contains(key);
        return <ItemRenderer key={key} idx={idx} item={item} allow={allow} onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        const {is: {isContractorViewIncContractorPack, isEmployee}} = storage;
        if (!isContractorViewIncContractorPack) return null;

        return <PluginsView
            title=''
            onFilterReadonly={this.onFilterReadonly}
            onFilterAll={this.onFilterAll}
            renderModuleItem={this.renderItem}
        />;
    }
}

@observer
class InitViewEmployee extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterEmployeeOnly(modules) {
        const {employeeDisallowedModules} = moduleManager;
        return onFilterImpl(modules).filter(item => {
            const allow = !employeeDisallowedModules.contains(item.key);
            return allow;
        });
    }

    renderItem(item, idx) {
        const {onInfo, onClick} = this.props;
        return <ItemRenderer key={item.key} idx={idx} item={item} allow onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        const {is: {isEmployee}} = storage;
        if (!isEmployee) return null;

        return <PluginsView
            title=''
            onFilterEmployeeOnly={this.onFilterEmployeeOnly}
            renderModuleItem={this.renderItem}
        />;
    }
}

@observer
class InitViewNotSelected extends React.Component {
    render() {
        const {selected: {selectedClient}, is: {isConsultant, isContractorViewIncContractorPack, isEmployee}} = storage;
        if (isEmployee || isContractorViewIncContractorPack) return null;
        if (isConsultant && selectedClient) return null;
        if (!isConsultant && selectedClient) return null;
        return <div className="InitViewNotSelected"/>;
    }
}

@observer
class ItemRenderer extends React.Component {
    render() {
        const {
            idx,
            allow,
            onInfo,
            onClick,
            item,
            item: {borderColor, key, svgIconLeft, faIconLeft, title}
        } = this.props;
        return <div key={key} className={`col-lg-2 col-md-2 col-sm-3 col-xs-4${!allow ? " readonly" : ""}`} idx={idx}>
            <div style={{borderColor}}>
                {!svgIconLeft && <i className={"fa fa-" + faIconLeft}/>}
                {svgIconLeft && <img src={'img/svg/' + svgIconLeft + '.svg'} className="fa fa-"/>}
                <h3>{title}</h3>
                <div className="buttons">
                    <Button className="btn btn-primary" module={item} onClick={onInfo}>Info</Button>
                    {allow && <Button className="btn btn-primary" module={item} onClick={onClick}>Open</Button>}
                </div>
                {!allow && <p className="access-hint">No Access</p>}
            </div>
        </div>;
    }
}

function onFilterImpl(__modules) {
//    if(plugin.data.key === 'plugin_hr_management') return [];

    const {selectedClientModules: {list: modules}} = storage.selected;
//    console.log('permissions_modules', __modules.map(v => v.key), modules.map(v => v.key))
    return modules.filter(item => item.key !== 'Dashboard')
        .filter(item => __modules.anyMatch(v2 => v2.key === item.key))
        .map(item => __modules.find(v2 => v2.key === item.key));
}

export default InitView;