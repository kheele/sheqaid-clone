import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {GridView, ListLoaderState} from '../lists';

import style from "./PluginsView.lazy.css";

@observer
class PluginsView extends React.Component {
    path;

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        style.unuse();
    }

    showScrollbars() {
        const {rootView} = this.refs;
        this.show && $(rootView).showScrollbars();
        !this.show && (rootView.querySelector('.results-none').style.transform = 'translate(-50%, -50%)');
    }

    removeScrollbars() {
        const {rootView} = this.refs;
        rootView && $(rootView).removeScrollbars();
    }

    onLoad(resolve, reject) {
//        this.state.listState = 'action';
//        rootView.style.transform = 'translate3d(0px, 0px, 0px)';

        pluginManager.onLoadList().then(resolve, reject);
    }

    onChange(evt) {
        pluginManager.dataState.listState = evt.state;
    }

    @computed
    get show() {
        const {dataState: {dataLoaded, dataError, list}} = pluginManager;
        return dataLoaded && !list.isEmpty() && !dataError;
    }

    render() {
        const {dataState} = pluginManager;
        const {loadNewList, title, onFilterReadonly, onFilterAll, onFilterEmployeeOnly, gridClassName} = this.props;
        let className = 'PluginsView';
        if (!!this.props.className) {
            className += ' ' + this.props.className;
        }
        if (!this.show) {
            return <div ref="rootView" className={className}>
                <ListLoaderState ref="" onChange={this.onChange} onLoad={this.onLoad} state={dataState} title={title}/>
            </div>;
        }
        return <div ref="rootView" className={className + ' nice-scrollbars'}>
            {this.props.children}
            <Plugins 
                loadNewList={loadNewList}
                onFilterReadonly={onFilterReadonly} 
                onFilterAll={onFilterAll} 
                onFilterEmployeeOnly={onFilterEmployeeOnly}
                renderModuleItem={this.props.renderModuleItem}
                gridClassName={gridClassName}
            />
        </div>;
    }
}

@observer
class Plugins extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {props: {loadNewList, renderModuleItem, gridClassName, onFilterReadonly, onFilterAll, onFilterEmployeeOnly}} = this;
        
        return <div className="Plugins">
            <div className="Plugin">
                <GridFilteredEmployee 
                    loadNewList={loadNewList}
                    renderModuleItem={renderModuleItem} 
                    onFilterEmployeeOnly={onFilterEmployeeOnly}
                    gridClassName={gridClassName}
                />
                <GridFilteredAll 
                    loadNewList={loadNewList}
                    renderModuleItem={renderModuleItem} 
                    onFilterAll={onFilterAll} 
                    gridClassName={gridClassName}
                />
                <GridFilteredReadonly 
                    loadNewList={loadNewList}
                    renderModuleItem={renderModuleItem} 
                    onFilterReadonly={onFilterReadonly} 
                    gridClassName={gridClassName}
                />
            </div>
        </div>;
    }
}

@observer
class AGrid extends React.Component {

    @computed
    get modules() {
        const {isLoggedIn} = storage.is;
        if(!isLoggedIn) {
            return moduleManager.moduleListInstalledDashboard;
        }
        
        const {loadNewList} = this.props;
        const {selectedClientModules: {listDashboard, listNew}} = storage.selected;
        if(loadNewList) {
            return listNew;
        }
        return listDashboard;
    }
}

@observer
class GridFilteredEmployee extends AGrid {

    @computed
    get filtered() {
        const {modules} = this;
        const {onFilterEmployeeOnly} = this.props;
        return !!onFilterEmployeeOnly ? onFilterEmployeeOnly(modules) : [];
    }

    render() {
        const {isEmployee} = storage.is;
        if(!isEmployee) {
            return null;
        }
        
        const {filtered, props: {renderModuleItem, gridClassName}} = this;
        
        return <GridView
            key={"gridViewEmployeeOnly" + new Date().getTime()} 
            ref="gridViewEmployeeOnly" 
            title="Plugins" 
            renderItem={renderModuleItem} 
            list={filtered}
            className={gridClassName}
        />;
    }
}

@observer
class GridFilteredAll extends AGrid {

    @computed
    get filtered() {
        const {modules} = this;
        const {onFilterAll} = this.props;
        return !!onFilterAll ? onFilterAll(modules) : modules;
    }

    render() {
        const {isEmployee} = storage.is;
        if(isEmployee) {
            return null;
        }
        
        const {filtered, props: {renderModuleItem, gridClassName}} = this;
        
        if(filtered.isEmpty()) {
            return null;
        }
        
        return <GridView 
            key={"gridViewAll" + new Date().getTime()} 
            ref="gridViewAll" 
            title="Plugins" 
            renderItem={renderModuleItem} 
            list={filtered}
            className={gridClassName}
        />;
    }
}

@observer
class GridFilteredReadonly extends AGrid {

    @computed
    get filtered() {
        const {modules} = this;
        const {onFilterReadonly} = this.props;
        return !!onFilterReadonly ? onFilterReadonly(modules) : [];
    }

    render() {
        const {isEmployee} = storage.is;
        if(isEmployee) {
            return null;
        }
        
        const {filtered, props: {renderModuleItem, gridClassName}} = this;
        
        if(filtered.isEmpty()) {
            return null;
        }
        
        return <React.Fragment>
            <hr />
            <GridView 
                key={"gridViewReadonly" + new Date().getTime()} 
                ref="gridViewReadonly" 
                title="Plugins" 
                renderItem={renderModuleItem} 
                list={filtered}
                className={gridClassName}
            /> 
        </React.Fragment>;
    }
}

export default PluginsView;