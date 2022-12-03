import React from "react";
import {findDOMNode} from 'react-dom';
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ErrorBoundary} from '../';

import style from "./Tabs.lazy.css";

import Tab from './Tab';

@observer
class Tabs extends React.Component {
    static propTypes = {
	children: PropTypes.instanceOf(Array).isRequired,
        onChange: PropTypes.func,
        index: PropTypes.number
    }

    @observable
    state = {
        activeIndex: 0
    };

    constructor(props) {
        super(props);

        const {index} = this.props;
        if (!!index) {
            this.state.activeIndex = index;
        }

        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onChange(index) {
        this.state.activeIndex = index;
        const {onChange} = this.props;
        onChange && onChange(index);
    }

    getTabByRef(ref) {
        const {tabs} = this.refs.tabContent;
        return tabs[ref];
    }

    render() {
        const {onChange, props: {permissionKey, position, keepState, children}, state} = this;
        const pos = position || 'top';
	return (<div className="tabs">
            {pos === 'top' && <ol className={"tab-list " + pos}>
                <TabList ref="tabList" onChange={onChange} state={state}>{children}</TabList>
            </ol>}
            <div className={"tab-content " + pos}>
                <TabContent ref="tabContent" permissionKey={permissionKey} keepState={keepState} state={state}>{children}</TabContent>
            </div>
            {pos === 'bottom' && <ol className={"tab-list " + pos}>
                <TabList ref="tabList" onChange={onChange} state={state}>{children}</TabList>
            </ol>}
	</div>);
    }
}

@observer
class TabList extends React.Component {

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
    }
    
    renderItem(child, index) {
        const {props: {children, onChange, state: {activeIndex}}} = this;
        if(!child) return undefined;
        const {title} = child.props;
        return <Tab index={index} activeIndex={activeIndex} key={title} title={title} onClick={onChange}/>;
    }

    render() {
	return (<React.Fragment>
            {React.Children.map(this.props.children, this.renderItem)}
	</React.Fragment>);
    }
}

@observer
class TabContent extends React.Component {

    activeTab;
    tabs = {};
    
    constructor(props) {
        super(props);
        
        this.renderItem = this.renderItem.bind(this);
    }
    
    renderItem(child, index) {
        const {props: {permissionKey, keepState, state}} = this;
        if(!child) return undefined;
        return <ActiveTab permissionKey={permissionKey} state={state} keepState={keepState} index={index} child={child} tabContent={this} tabs={this.tabs}/>;
    }

    render() {
	return (<React.Fragment>
            {React.Children.map(this.props.children, this.renderItem)}
        </React.Fragment>);
    }
}

@observer
class ActiveTab extends React.Component {

    constructor(props) {
        super(props);
        this.setRef = this.setRef.bind(this);
    }
    
    componentDidMount() {
        this.showScrollbars();
    }
    
    componentWillUpdate() {
        this.showScrollbars();
    }

    componentWillUnmount() {
        const node = findDOMNode(this);
        node && $(node).removeScrollbars();
    }

    showScrollbars() {
        const {child} = this.props;
        if(child && child.props.scrollable) {
            const {props: {child, index, keepState, state: {activeIndex}}} = this;
            if (!child || (!keepState && index !== activeIndex)) return;
            const active = index === activeIndex;
            if(!active) {
                setTimeout(() => {
                    $(findDOMNode(this)).removeScrollbars();
                }, 500);
            } else {
                setTimeout(() => {
                    $(findDOMNode(this)).showScrollbars(0.8, "rgb(2,168,168)");
                }, 500);
            }
        }
    }
    
    setRef(ref, refName, active) {
        this.props.tabs[refName] = ref; 
        active && (this.props.tabContent.activeTab = ref);
    }

    render() {
        const {props: {permissionKey, scrollable, child, index, keepState, state: {activeIndex}}} = this;
        if (!child || (!keepState && index !== activeIndex)) return null;
        const active = index === activeIndex;
        let className = child.props.scrollable ? 'nice-scrollbars' : '';
        if(active) {
            className += ' active';
        }
        const refName = child.ref;
	return <div className={className}>
            <ErrorBoundary>
               {React.cloneElement(child, {permissionKey, active, ref: ref => this.setRef(ref, refName, active)})}
            </ErrorBoundary>
        </div>;
    }
}

export default Tabs;
