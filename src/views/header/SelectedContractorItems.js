import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import NavItem from '../../components/navs/NavItem';
import Popover from '../../components/popovers/Popover';

import {execWhen} from '../../utils/Utils';

@observer
class SelectedContractorItems extends React.Component {

    componentWillMount() {
        window.selectedContractorItems = this;//
    }

    componentWillUnmount() {
        delete window.selectedContractorItems;
    }

    open(key) {
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                key && this.refs[key] && this.refs[key].doClick(resolve);
            }.bind(this), 500);
        });
    }
    
    getPopover = () => this.refs.popover;
    
    render() {
        if(isAdminApp) return null;
        const {is:{isContractor, isContractorView}, loggedContractor} = storage;
        if(!isContractorView) return null;
        
        const {id, data: {name, username, site_list = []}} = loggedContractor;
        
//        const {isOpen: isMainView} = mainView;
        return <div className="SelectedItems changeable-title flex">
            <div className="SelectedItem cursor-default contractors-pack-title fixed-flex">Contractor's Management</div>
            <div className="SelectedItem cursor-default fixed-flex">{name}</div>
            <i className="fa fa-angle-right fixed-flex"/>
            <SelectedItem 
                ref="sites" 
                getPopover={this.getPopover} 
                selectedKey="selectedContractorSite" 
                onLogout="logoutContractorSite" 
                onLogin="loginContractorSite" 
                selectedList={site_list}
            />
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}

@observer
class SelectedItem extends React.Component {

    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    
    doClick(resolve){
        $(findDOMNode(this)).data('resolve', resolve).click();
    }

    reload() {
        const view = loggedInApp.topView;
        const reload = body => {
            if(body) {
                const {activePage} = body.refs;
//                console.log('activePage', activePage)
                if (activePage) {
                    let {root} = activePage.refs;
                    if (root) {
                        root.refs.body.onLoadList();
                    } else {
                        const {mainTabs} = activePage.refs;
                        if (mainTabs) {
                            const {tabContent: {activeTab}} = mainTabs.refs;
                            root = activeTab.refs.root;
                            if (root) {
                                if(root.refs.body) {
                                    root.refs.body.onLoadList();
                                }
                            } else {
//                                console.log('activeTab', Object.keys(activeTab))
                                if(isFunction(activeTab.update)) {
                                    activeTab.update();
                                } else {
                                    activeTab.render();
                                }
                            }
                        } else {
//                            const {mainTabs} = activePage.refs;
//                            console.log('activePage', activePage)
                        }
                    }
                }
            }
        };
        if (view) {
            const {body} = view.refs;
            reload(body);
        } else {
            const {mainView} = loggedInApp.refs;
            if(mainView) {
                const {body} = mainView.refs;
                reload(body);
            }
        }
    }
    
    select(item, skipReload) {
//        console.log('select', item)
        return storage.login[this.props.onLogin](item.id).then(res => {
            !skipReload && this.reload();
            execWhen(() => {
                try {
                    return findDOMNode(this);
                } catch(err) {}
            }).then(node => {
                const resolve = $(node).data('resolve');
                resolve && resolve(item);
            });
        });
    }

    onClick() {
        const {getPopover} = this.props;
        
        const jqElem = $(findDOMNode(this));
        const {left} = jqElem.offset();
        
        const list = this.selectedList;
        getPopover().settings({
            style: {left, top: 60, width: 'auto', minWidth: 200},
            strictPos: true,
            isDialog: true,
            contentNode: <div>{
                list.isEmpty() ?
                <React.Fragment>
                    <p key={Math.random()} className="text-center"><i>No contractor sites available</i></p>
                </React.Fragment> :
                <React.Fragment>
                    <p key={Math.random()} className="padding-t-10 text-center">--- Select Site ---</p>
                    <hr key={Math.random()} className="margin-t-0 margin-b-0"/>
                    <NavItem key={0} idx={-1} onClick={this.onSelect} title="All"/>
                    {list.map(this.renderItem)}
                </React.Fragment>
            }</div>
        }).open();
    }

    onSelect(e, elem) {
        const {onLogout} = this.props;
        const {idx} = elem.props;
        const actions = [];
        if (idx === -1) {
            actions.push(storage.logout[onLogout]());
        } else {
            const item = this.selectedList[idx];
            if (!item) return;
            actions.push(this.select(item, true));
        }
        
        Promise.all(actions).then(res => {
            this.reload();
        });
    }

    renderItem(item, n) {
        const {name, client} = item.data;
        const {isConsultant} = storage.is;
        
        let title;
        if(isConsultant) {
            const clientName = (client.name || client.data.name);
            title = (clientName + " - " + name);
        } else {
            title = name;
        }
        return <NavItem key={item.id} idx={n} onClick={this.onSelect} title={title}/>;
    }
    
    @computed get selectedList() {
        const {selectedList} = this.props;
        return selectedList;
    }
    
    @computed get selected() {
        const {selectedKey} = this.props;
        return storage.selected[selectedKey];
    }
    
    @computed get selectedName() {
        if(!this.selected) {
            return null;
        }
        console.log('selectedName', this.selected)
        const {name, client} = this.selected.data;
        
        const {isConsultant} = storage.is;
        
        let title;
        if(isConsultant) {
            const clientName = (client.name || client.data.name);
            title = (clientName + " - " + name);
        } else {
            title = name;
        }
        
        return title;
    }

    render() {
        const {path} = this.props;
        return <div className="SelectedItem fixed-flex" onClick={this.onClick}>
            {this.selected ? this.selectedName : "All Sites"}
        </div>;
    }
}

export default SelectedContractorItems;
