import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Tabs} from "components/tabs";
import Tab from "./Tab";

// <editor-fold defaultstate="collapsed" desc="TabWrapper">
@observer
class TabWrapper extends React.Component {

    @observable
    state = {
        index: 0,
    };

    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
    }

    get index() {
        return this.state.index;
    }

    @computed get item() {
        return this.props.item;
    }

    componentDidMount() {
        this.onChange(this.props.tabIndex || 0);
    }

    onChange(index) {
        const {state, props: {onChange}} = this;
        state.index = index;
        onChange && onChange(index);
    }

    render() {
        if (!this.item) {
            return null;
        }

        const {
            item, item: {
                id, data: {
                    signable_doc_submitter_list = [],
                }
            }
        } = this;

        const {
            permissionKey,
            tabsHeight,
        } = this.props;

        const {isEmployee} = storage.is;

        return (<Tabs
            key="tabs"
            ref="mainTabs"
            className="Embedded-Tabs margin-t-0 h-full"
            tabsHeight={tabsHeight}
            permissionKey={permissionKey}
            index={this.state.index}
            onChange={this.onChange}
        >
            <Tab ref="pendingTab" title="Pending" item={item} pageId="SignablePending" status="Pending"/>
            <Tab ref="signedTab" title="Signed" item={item} pageId="SignableCompleted" status="Completed"/>
        </Tabs>);
    }
}

// </editor-fold>

export default TabWrapper;
