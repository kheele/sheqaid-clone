import React from "react";
import {observer} from 'mobx-react';
import {autorun} from 'mobx';

import {PluginsView} from '../components/page-lists';
import {Button} from '../components/inputs';
import Popover from '../components/popovers/Popover';

import style from "./InitViewOut.lazy.css";

@observer
class InitViewOut extends React.Component {

    constructor(props) {
        super(props);

        this.showScrollbars = this.showScrollbars.bind(this);
        this.removeScrollbars = this.removeScrollbars.bind(this);

        this.onInfo = this.onInfo.bind(this);
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

    render() {
        return <div ref="rootView" key="initView" className="InitViewOut">
            <div className="Features">
                <h2>Features Available</h2>
                <p className="margin-b-30">Take a closer look at services we provide for your business.<br/>
                Interested? Contact us on the details above.</p>
            </div>
            <div ref="contentView" className="view-content nice-scrollbars">
                <InitViewAdmin onInfo={this.onInfo}/>
                <InitViewHome onInfo={this.onInfo}/>
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
        return onFilterImpl(modules);
    }

    renderItem(item, idx) {
        const {color, key, svgIconLeft, faIconLeft, title} = item;
        
        const {onInfo, onClick} = this.props;
        
        return <ItemRenderer key={key} idx={idx} item={item} onInfo={onInfo}/>;
    }

    render() {
        if(!isAdminApp) return null;
        
        return <PluginsView 
            title='' 
            onFilterAll={this.onFilterAll} 
            renderModuleItem={this.renderItem}
        />;
    }
}

@observer
class InitViewHome extends React.Component {
    
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterAll(modules) {
        return onFilterImpl(modules);
    }

    renderItem(item, idx) {
        const {color, key, svgIconLeft, faIconLeft, title} = item;
        
        const {onInfo, onClick} = this.props;
        
        return <ItemRenderer key={key} idx={idx} item={item} onInfo={onInfo}/>;
    }

    render() {
        if(isAdminApp) return null;
        
        return <PluginsView 
            title='' 
            onFilterAll={this.onFilterAll} 
            renderModuleItem={this.renderItem}
            gridClassName="grid-lg-8 grid-md-6 grid-sm-5 grid-xs-3"
        />;
    }
}

@observer
class ItemRenderer extends React.Component {
    render() {
        const {idx, onInfo, item, item: {borderColor, key, svgIconLeft, faIconLeft, title}} = this.props;
        return <div key={key} className={`col-lg-2 col-md-2 col-sm-3 col-xs-4`} idx={idx}>
            <div style={{borderColor}}>
                {!svgIconLeft && <i className={"fa fa-" + faIconLeft}/>}
                {svgIconLeft && <img src={'img/svg/' + svgIconLeft + '.svg'} className="fa fa-"/>}
                <h3>{title}</h3>
                <div className="buttons">
                    <Button className="btn btn-primary" module={item} onClick={onInfo}>Info</Button>
                </div>
            </div>
        </div>;
    }
}

function onFilterImpl(__modules) {
//    if(plugin.data.key === 'plugin_hr_management') return [];
        
    const {moduleListInstalledDashboard: modules} = moduleManager;
//    console.log('permissions_modules', __modules.map(v => v.key), modules.map(v => v.key))
    return modules.filter(item => item.key !== 'Dashboard')
        .filter(item => __modules.anyMatch(v2 => v2.key === item.key))
        .map(item => __modules.find(v2 => v2.key === item.key));
}

export default InitViewOut;