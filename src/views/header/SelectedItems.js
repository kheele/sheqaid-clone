import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import {Button, ProfilePic} from 'components/inputs';

import {execWhen, Permissions} from 'utils/Utils';

import notificationStore from './NotificationsStore';
import Divider from "@mui/material/Divider";

@observer
class SelectedItems extends React.Component {

    constructor() {
        super();
        window.selectedItems = this;//
    }

    open(key) {
        return new Promise((resolve, reject) => {
            execWhen(() => key && this.refs[key]).then(ref => {
                ref.doClick(resolve);
            });
        });
    }

    getPopover = () => this.refs.popover;

    render() {
        if (isAdminApp) return null;

        if (loggedInApp.isUserManualView) {
            return <div className="SelectedItems changeable-title flex">
                <div className="SelectedItem fixed-flex readonly">
                    USER MANUAL
                </div>
            </div>;
        }

        const {isContractor, isContractorView} = storage.is;
//        const {key} = pluginManager.selected;
        if (isContractor || isContractorView) return null;
//        if(!key || key !== 'plugin_sheq_assist') return null;

        const {onPopoverNotifications} = this.props;

        const {isTrial, isConsultant, isNoProjects} = storage.is;
        const {trialDaysLeft} = storage;
        const {selectedClient} = storage.selected;
        const {profile_pic, data: data_profile_pic} = selectedClient || {};
        const client_profile_pic = profile_pic || (data_profile_pic ? data_profile_pic.profile_pic : null);
        return <div className="SelectedItems changeable-title flex">
            {isConsultant && <>
                {selectedClient && <ProfilePic key={Math.random()} profilePic={client_profile_pic} readonly
                                               displayCenter={false} className="x50 pull-left fixed-flex"/>}
                {!selectedClient && <ProfilePic key={Math.random()} profilePic="clients" readonly displayCenter={false}
                                                className="x50 pull-left fixed-flex"/>}
                <SelectedItem key={Math.random()} ref="clients" onPopoverNotifications={onPopoverNotifications}
                              getPopover={this.getPopover} path="clients" selectedKey="selectedClient"
                              onLogout="logoutClient" onLogin="loginClient" module="Clients" args="New"
                              createTitle="Create Client" default="All Clients"/>
                <i className="fa fa-angle-right fixed-flex"/>
            </>}
            {!isConsultant && <>
                <ProfilePic key={Math.random()} profilePic={client_profile_pic} readonly
                            displayCenter={false} className="x50 pull-left fixed-flex"/>
                <SelectedItem key={Math.random()} ref="clients" path="clients"
                              selectedKey="selectedClient" readonly/>
                {!isNoProjects && <i className="fa fa-angle-right fixed-flex"/>}
            </>}
            {!isNoProjects && <>
                <SelectedItem key={Math.random()} ref="projects" onPopoverNotifications={onPopoverNotifications}
                              getPopover={this.getPopover} path="projects" selectedKey="selectedProject"
                              onLogout="logoutProject" onLogin="loginProject" module="Projects" args="New"
                              createTitle="Create Project" default="All Projects"/>
                <i key={Math.random()} className="fa fa-angle-right fixed-flex"/>
                <SelectedItem key={Math.random()} ref="sites" onPopoverNotifications={onPopoverNotifications}
                              getPopover={this.getPopover} path="sites" selectedKey="selectedSite"
                              onLogout="logoutSite" onLogin="loginSite" module="Sites" args="New"
                              createTitle="Create Site" default="All Sites"/>
            </>}
            {isTrial && <div className="flex trial-bar">
                <span className="fixed-flex padding-5">Trial</span>
                <span className="padding-5">{trialDaysLeft} days left</span>
            </div>}
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}

@observer
class SelectedItem extends React.Component {

    selecting;

    constructor() {
        super();

        this.onClickNotifications = this.onClickNotifications.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    doClick(resolve) {
        execWhen(() => findDOMNode(this)).then(ref => {
            this.onClick(resolve);
        });
    }

    onCreate(e, elem) {
        defaultView.onOpenPage(e, elem).then(elem.props.resolve);
    }

    reload() {
        const view = loggedInApp.topView;
        const reload = body => {
            if (body) {
                const {activePage} = body.refs;
//                console.log('activePage', activePage)
                if (activePage) {
                    let {root} = activePage.refs;
                    if (root) {
                        root.refs.body.onLoadList();
                    } else {
                        const {mainTabs} = activePage.refs;
//                        console.log('mainTabs', mainTabs)
                        if (mainTabs) {
                            const {tabContent: {activeTab}} = mainTabs.refs;
                            root = activeTab.refs.root;
//                            console.log('activeTab', activeTab)
                            if (root) {
//                                console.log('root.refs.body', root)
                                if (root.refs.body) {
                                    root.refs.body.onLoadList();
                                } else if (root.refs.root) {//Covid tabs
                                    root = root.refs.root;
//                                    console.log('root', root)
                                    if (root.refs.body) {
                                        root.refs.body.onLoadList();
                                    }
                                }
//                                else if(isFunction(root.update)) {
////                                alert('activeTab.update', activeTab.update)
//                                    root.update();
//                                } else {
////                                alert('activeTab.render', activeTab.render)
//                                    root.render();
//                                }
                            } else {
//                                console.log('activeTab', Object.keys(activeTab))
                                if (isFunction(activeTab.update)) {
//                                alert('activeTab.update', activeTab.update)
                                    activeTab.update();
                                } else {
//                                alert('activeTab.render', activeTab.render)
                                    activeTab.render();
                                }
                            }
                        } else if (isFunction(activePage.update)) {
                            activePage.update();
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
            if (mainView) {
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
                } catch (err) {
                }
            }).then(node => {
                const resolve = $(node).data('resolve');
                resolve && resolve(item);
            });
        });
    }

    onClick(resolve) {
        const {
            is: {isTrial, isConsultant},
            selected: {selectedClient, selectedProject, selectedSite},
            loggedUser
        } = storage;
        const {path, getPopover, module, args, createTitle} = this.props;

        if (path === 'clients') {
            const {client} = loggedUser.user.data
            if (!Permissions.allowOther("Clients") || (!isConsultant || (client && selectedClient && client.id === selectedClient.id))) {
                return;
            }
        }
        if (path === 'projects') {
            const {project} = loggedUser.user.data;
            if (!Permissions.allowOther("Projects") || (project && selectedProject && project.id === selectedProject.id)) {
                return;
            }
        }
        if (path === 'sites') {
            const {site} = loggedUser.user.data;
            if (!Permissions.allowOther("Sites") || (site && selectedSite && site.id === selectedSite.id)) {
                return;
            }
        }

        const jqElem = $(findDOMNode(this));
        const {left} = jqElem.offset();
        const list = this.selectedList;//storage.list[path + (path === 'clients' ? '' : 'Filtered')];

        //console.log(path, 'list', list.length)

        let createNav;
        if ((isTrial && list.length < 3) || !isTrial) {
            createNav =
                <NavItem key={-1} module={module} args={args} resolve={resolve} onClick={this.onCreate}
                         title={createTitle} className="text-center"/>;
        }
        getPopover().settings({
            style: {left, top: 60, width: 'auto', minWidth: 230},
            strictPos: true,
            isDialog: true,
            className: "SelectOrgPopover",
            preventClickAwayClose: () => path === 'clients' && (!this.selected || this.selecting),
            contentNode: <div>{
                list.isEmpty() ?
                    <>
                        <p key={Math.random()} className="text-center padding-t-20 padding-b-10"><i>No {path} available</i></p>
                        <Divider/>
                        {createNav}
                    </> :
                    <>
                        {createNav}
                        {createNav && <hr key={Math.random()}/>}
                        <p key={Math.random()}
                           className="padding-t-10 text-center">--- {createTitle.replace("Create", "Select")} ---</p>
                        <hr key={Math.random()} className="margin-t-0 margin-b-0"/>
                        {path !== 'clients' && <NavItem key={0} idx={-1} onClick={this.onSelect} title="All"/>}
                        {list.map(this.renderItem)}
                    </>
            }</div>
        }).open();
    }

    onClickNotifications(e, elem) {
        const {onPopoverNotifications} = this.props;
        const {idx} = elem.props;
        const item = this.selectedList[idx];
        setTimeout(() => {
            onPopoverNotifications(e);
        }, 100);
    }

    onSelect(e, elem) {
        this.selecting = true;
        const {path} = this.props;
        const {idx} = elem.props;
        const actions = [];
        if (idx === -1) {
            actions.push(storage.logout[this.props.onLogout]());
//            storage.logout[this.props.onLogout]().then(res => {
//                this.reload();
//            });
        } else {
            const item = this.selectedList[idx];
            //console.log(path, idx, item)
            if (!item || (this.selected && (this.selected.id === item.id))) {
                this.selecting = false;
                const {getPopover} = this.props;
                getPopover().close();
                return;
            }
//            this.select(item);
            actions.push(this.select(item, true));
        }
        if (path === 'clients') {
            // actions.push(storage.logout.logoutSite());
            // actions.push(storage.logout.logoutProject());
        } else if (path === 'projects') {
            // actions.push(storage.logout.logoutSite());
        }

        Promise.all(actions).then(async res => {
            this.reload();
            this.selecting = false;

            const {getPopover} = this.props;
            let popover = getPopover();
            if (!popover) {
                popover = await execWhen(() => getPopover());
            }
            popover.close();
        });
    }

    renderItem(item, n) {
        const {path, selectedKey} = this.props;
        return <SelectedItemRenderer
            key={item.id}
            path={path}
            selectedKey={selectedKey}
            item={item}
            idx={n}
            onClickNotifications={this.onClickNotifications}
            onSelect={this.onSelect}
        />;
    }

    @computed get isReadonly() {
        const {path} = this.props;
        return (path === 'clients' && !Permissions.allowOther("Clients")) ||
            (path === 'projects' && !Permissions.allowOther("Projects")) ||
            (path === 'sites' && !Permissions.allowOther("Sites"));
    }

    @computed get selectedList() {
        const {path} = this.props;
        const list = storage.list[path + (path === 'clients' ? '' : 'Filtered')];
        if (path === 'clients') {
            const {isClientBlacklisted} = storage.is;
            return list.filter(v => !isClientBlacklisted(v));
        }
        if (path === 'projects') {
            const {isProjectBlacklisted} = storage.is;
            return list.filter(v => !isProjectBlacklisted(v));
        }
        if (path === 'sites') {
            const {isSiteBlacklisted} = storage.is;
            return list.filter(v => !isSiteBlacklisted(v));
        }
        return list;
    }

    @computed get selected() {
        const {selectedKey} = this.props;
        return storage.selected[selectedKey];
    }

    @computed get selectedName() {
        const {selected} = this;
        if (!selected) {
            return null;
        }
        const {data, name} = selected;
        return name || data.name;
    }

    render() {
        const {selectedName, isReadonly} = this;
        return <div className={"SelectedItem fixed-flex" + (isReadonly ? " readonly" : "")} onClick={this.onClick}>
            {selectedName || this.props.default}
        </div>;
    }
}

@observer
class SelectedItemRenderer extends React.Component {
    @computed get selected() {
        const {selectedKey} = this.props;
        return storage.selected[selectedKey];
    }

    render() {
        const {path, item, idx, onClickNotifications, onSelect} = this.props;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;

        const className = this.selected && (this.selected.id === item.id) ? "active" : "";

        let item1, item2, item3;
        if (path === 'clients') {
            item1 = item;
        } else if (path === 'projects') {
            item1 = selectedClient;
            item2 = item;
        } else {
            item1 = selectedClient;
            item2 = selectedProject;
            item3 = item;
        }

        const name = item.name || item.data.name;

        const count = notificationStore.countBy(item1, item2, item3);
        const node = <div>
            <span>{name}</span>
            {count > 0 && <Button idx={idx} className="fa fa-bell btn" title="Notifications" hoverText="Notifications"
                                  onClick={onClickNotifications}>
                <small>{count}</small>
            </Button>}
        </div>;
        return <NavItem key={item.id} idx={idx} onClick={onSelect} title={node} className={className}/>;
    }
}

export default SelectedItems;
