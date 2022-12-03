import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ErrorBoundary} from '../components';

@observer
class Body extends React.Component {
    static key = 'Body';

    @observable
    routes = [];
    topViewNav;

    constructor() {
        super();

        this.navigate = this.navigate.bind(this);
        this.onOpenPage = this.onOpenPage.bind(this);
        this.onBack = this.onBack.bind(this);
    }

    componentWillMount() {
        window.appBody = this;
    }

    componentDidMount() {
//        window.app.onBodyDidMount(this);
//        console.log("Body.componentDidMount")
    }

    navigate(module, args) {
        if (isObject(module)) {
            module = module.key;
        }

        return new Promise((resolve, reject)=>{
            this.routes.pushFirst({module, args, promise: {resolve, reject}});
        });
    }

    onOpenPage(e, elem) {
//        console.log(elem)
        //
        if (elem && (elem.props.module || (elem._reactInternals && elem._reactInternals.key))) {
            const {module, args} = elem.props;
            return this.navigate(module || elem._reactInternals.key, args);
        } else if (e._targetInst) {
            elem = e._targetInst._currentElement._owner._instance._reactInternals;
            const {module, args} = elem.props;
            return this.navigate(module || elem.key, args);
        } else {
            alert("An error occured while opening a page. Please report this error.");
            return Promise.reject("An error occured while opening a page. Please report this error.");
        }
    }

    onBack() {
        this.routes.removeFirst();
    }

    @computed
    get hasOpenPlugin() {
        return !this.routes.isEmpty();
    }

    @computed
    get hasBackPage() {
        return this.routes.length > 1;
    }

    @computed
    get topView() {
        if (!this.hasOpenPlugin) {
            return null;
        } else {
            const nav = this.routes[0];
            const {module, args, promise} = nav;//{module, promise: {resolve, reject}};
            if (this.topViewNav !== nav) {
                //when(() => window.app.componentsDidMount.header, () => {
                //    window.app.refs.drawer.selectItemByKey(key);
                //});
                this.topViewNav = nav;
            }
//            console.log('Body.topView', module)

            let comp;
            if (isAdminApp) {
                comp = staticModuleManager.adminPluginModules[module];
            } else {
                comp = staticModuleManager.defaultPluginModules[module] || staticModuleManager.selectedPluginModules[module];
//                console.log('Body.topView', comp, module)
            }

            if(comp) {
                if (!!args) {
                    comp.args = args;
                }
                comp.promise = promise;
                comp.permissionKey = module;
//                comp.permissionGroup = module;
//                alert(module)
                
//                const {permissions_modules} = storage.loggedUser.user.data;
//                const permissions_mod = (permissions_modules || []).find(v => v.key === item.key);
            }

            return comp;
        }
    }

    getDOMNode() {
        return ReactDOM.findDOMNode(this);
    }

    render() {
        const Comp = this.topView;
//        console.log('Body.render', Comp)
        if (!Comp)
            return null;
        const props = {ref: "activePage"};
        if (Comp.args) {
            props.args = Comp.args;
        }
        props.permissionKey = Comp.permissionKey;
        props.promise = Comp.promise;
        return <ErrorBoundary key={Math.random()}>
            <Comp {...props}/>
        </ErrorBoundary>;
    }

}

export default Body;
         