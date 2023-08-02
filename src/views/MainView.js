import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {autorun, observable} from 'mobx';
import {Drawer as MUIDrawer} from "@material-ui/core";

import {execWhen, Permissions} from 'utils/Utils';
import {Button} from 'components/inputs';
import {Nav, NavItem} from 'components/navs';
import Popover from 'components/popovers/Popover';
import {NavigateTop} from 'components';
import Body from './Body';

import drawerStyle from "./drawer.lazy.css"; //

@observer
class MainView extends React.Component {

    @observable
    isOpen = false;
    bodyData;
    
    constructor() {
        super();

        window.mainView = this;

        this.navigate = this.navigate.bind(this);
        this.onOpenPage = this.onOpenPage.bind(this);
        this.onCloseMobileMenu = this.onCloseMobileMenu.bind(this);
    }

    componentDidMount() {
        autorun(() => {
            execWhen(() => {
                try {
                    this.self = ReactDOM.findDOMNode(this);
                    return this.self;
                } catch(ex) {
                    return false;
                }
            }).then(self => {
                this.self.querySelector(".main-content").addEventListener("scroll", this.onScroll = (e) => {
                    let pos = e.target.scrollTop;
                    if (pos > 60) {
                        this.refs.navigateTop.show();
                    } else {
                        this.refs.navigateTop.hide();
                    }
                }, false);

                if (document.querySelector('.header-wide')) {
                    this.self.classList.add('MainView-wide');
                } 
            });
        });
    }

    componentWillUnmount() {
        if(this.self) {
            this.self.querySelector(".main-content").removeEventListener("scroll", this.onScroll);
        }
    }

    navigate(module, args) {
        this.isOpen = true;
        return new Promise((resolve, reject) => {
            execWhen(() => this.refs.body).then(body => {
                body.navigate(module, args).then(resolve).catch(reject);
            });
        });
    }
    
    onCloseMobileMenu() {
        mainDrawer.isOpen = false;
    }

    onOpenPage(e, elem) {
        this.onCloseMobileMenu();
        this.isOpen = true;
        return new Promise((resolve, reject) => {
            execWhen(() => this.refs.navigateTop).then(navigateTop => {
                navigateTop.onClick(e);
                execWhen(() => this.refs.body).then(body => {
                    body.onOpenPage(e, elem).then(resolve).catch(reject);
                });
            });
        });
    }

    render() {
        if(!this.isOpen) return null;
        return <div ref="rootView" key="MainView" className="MainView">
            <Drawer ref="drawer" onCloseMobileMenu={this.onCloseMobileMenu} onOpenPage={this.onOpenPage}/>
            <div className="drawer-container-layer" onClick={this.onCloseMobileMenu}/>
            <div className="main-content nice-scrollbars">
                <Body ref="body"/>
                <NavigateTop ref="navigateTop"/>
            </div>
            {this.props.children}
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}

@observer
class Drawer extends React.Component {

    @observable
    isOpen = false;
    
    constructor(props) {
        super(props);
        
        window.mainDrawer = this;
    }

    componentWillMount() {
        drawerStyle.use();
    }
    
    componentWillUnmount() {
        drawerStyle.unuse();
    }

    selectItemByKey(key) {
        execWhen(() => this.refs.nav).then(nav => {
            nav.selectItemByKey(key);
        });
    }

    getSelectedPluginDOMNode() {
        return this.refs.selectedPlugin.getDOMNode();
    }

    render() {
        if(!this.isOpen) return null;
        return <MUIDrawer ref="drawer" className="drawer-container scale-up-center open" variant="permanent" anchor="left" open={true}>
            <div className="drawer-title">
                <Button onClick={this.props.onCloseMobileMenu}>
                    <i className="fa fa-times"/>
                </Button>
            </div>
            <DrawerNav ref="nav" onOpenPage={this.props.onOpenPage}/>
        </MUIDrawer>;
    }
}

@observer
class SelectedPlugin extends React.Component {

    render() {
        const {isContractorViewVisited} = storage.is;
        const {title} = pluginManager.selected;
        return <h1 className="selected-plugin-title changeable-title">
            <span>{isContractorViewVisited ? "Contractor's Pack" : title}</span>
        </h1>;
    }
}

@observer
class DrawerNav extends React.Component {

    constructor() {
        super();

        this.renderNavItem = this.renderNavItem.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            window.$(ReactDOM.findDOMNode(this)).showScrollbars(0.8, "rgb(2,168,168)");
        }, 0);
    }

    componentWillUnmount() {
        window.$(ReactDOM.findDOMNode(this)).removeScrollbars();
    }
    
    selectItemByKey(key) {
        execWhen(() => this.refs.nav).then(nav => {
            nav.selectItemByKey(key);
        });
    }

    onFilterAll(modules) {
        const {is: {isContractorViewIncContractorPack, isEmployee}} = storage;
        if(isAdminApp) {
            return onFilterImpl(modules).filter(({module: {key}}) => {
                const {permissions_module_list} = storage.loggedUser.user.data;
                const permissions_mod = (permissions_module_list || []).find(({module: {key: __key}}) => __key === key);
                const allow = Permissions.allow(permissions_mod);
                return allow;
            });
        }
        if(isContractorViewIncContractorPack) {
            const {contractorAllowedModules} = moduleManager;
            return onFilterImpl(modules).filter(({module: {key}}) => {
                if(item.key === "__B_Contractors") return false;

                const allow = contractorAllowedModules.contains(key);
                return allow;
            });
        }
        if(isEmployee) {
            const {employeeDisallowedModules} = moduleManager;
            return onFilterImpl(modules).filter(({module: {key}}) => {
                const allow = !employeeDisallowedModules.contains(key);
                return allow;
            });
        }
        
        return onFilterImpl(modules).filter(({module: {key}}) => {
            const {permissions_module_list} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_module_list || []).find(({module: {key: __key}}) => __key === key);
            const allow = Permissions.allow(permissions_mod);
            return allow;
        });
    }
    
    renderNavItem(item) {
        const {module: {key, color}} = item;
        let disallow;
        if(storage.is.isEmployee) {
            const {employeeDisallowedModules} = moduleManager;
            disallow = employeeDisallowedModules.contains(key);
        } else {
            const {isContractorView} = storage.is;
            const {contractorAllowedModules} = moduleManager;
            if((storage.is.isContractor || isContractorView) && key === "__B_Contractors") return null;

            const {permissions_module_list} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_module_list || []).find(v => v.module.key === key);
            disallow = Permissions.disallow(permissions_mod) || (isContractorView && !contractorAllowedModules.contains(key));
        }
        
        if(disallow) return null;
        
        return <NavItem onClick={this.props.onOpenPage} {...item} color={color && (`${color} !important`)}/>;
    }

    render() {
        const {selectedClientModules: {navs}} = storage.selected;
        return <Nav ref="nav" className="nice-scrollbars">
            {this.onFilterAll(navs).map(this.renderNavItem)}
        </Nav>;
    }
}

function onFilterImpl(modulesDashboard) {
    return modulesDashboard;
//    if(plugin.data.key === 'plugin_hr_management') return [];
//
//     const {selectedClientModules: {list: modules}} = storage.selected;
// //    console.log('permissions_module_list', __modules.map(v => v.key), modules.map(v => v.key))
//     return modules.filter(item => item.key !== 'Dashboard')
//         .filter(item => modulesDashboard.anyMatch(v2 => v2.key === item.key))
//         .map(item => modulesDashboard.find(v2 => v2.key === item.key));
}

export default MainView;
