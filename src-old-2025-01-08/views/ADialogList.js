import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';
import PropTypes from "prop-types";
import EventListener from 'react-event-listener';

import Dialog from 'components/dialogs/Dialog';

@observer
class ADialogList extends React.Component {
    _classNames = "ADialogList";
    static propTypes = {
        hasBackBtn: PropTypes.bool.isRequired
    }
    static defaultProps = {
        hasBackBtn: true
    }
    
    @observable
    state = {
        defaultList: null
    };
    
    @observable
    extraProps = {};
    
    constructor(props) {
        super(props);
        
        if(this.onLoadList) {
            this.onLoadList = this.onLoadList.bind(this);
        }
        if(this.renderTHead) {
            this.renderTHead = this.renderTHead.bind(this);
        }
        if(this.renderItem) {
            this.renderItem = this.renderItem.bind(this);
        }
        if(this.renderPopoverOptions) {
            this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        }
        if(this.renderFilterNode) {
            this.renderFilterNode = this.renderFilterNode.bind(this);
        }
        if(this.renderDefaultLeftButtons) {
            this.renderDefaultLeftButtons = this.renderDefaultLeftButtons.bind(this);
        }
        if(this.renderLeftButtons) {
            this.renderLeftButtons = this.renderLeftButtons.bind(this);
        }
        if(this.renderRightButtons) {
            this.renderRightButtons = this.renderRightButtons.bind(this);
        }

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.renderBackBtn = this.renderBackBtn.bind(this);
    }
    
    set classNames(val) {
        this._classNames += " " + val;
    }

    get classNames() {
        return this._classNames;
    }

    extraProp(key, val) {
        if(!!key && !!val){
            extendObservable(this.extraProps, {[key]: val});
            return this;
        } else if(!!key && val === null){
            if(key in this.extraProps){
                delete this.extraProps[key];
            }
            return this;
        } else if(key in this.extraProps){
            return this.extraProps[key];
        }
        return null;
    }

    open(list) {
        return new Promise((resolve, reject) => {
            if(list) {
                this.state.defaultList = list;
            }
            this.refs.dialog.open(this.props.title || this.title);
            resolve();
        });
    }

    close() {
        this.extraProps = {};
        this.state.defaultList = null;
        this.refs.dialog.close();
    }
    
    get rootRefs() {
        return this.refs.root.refs;
    }

    renderBackBtn() {
        return this.props.hasBackBtn && <BackButton key="backButton" onClose={this.onClose}>
            <EventListener target={window} onKeyDown={this.onClose} />
        </BackButton>;
    }

    render() {
        return (<Dialog
            key={this.pageKey + '-dialog-' + new Date().getTime()}
            ref="dialog"
            className={this.pageKey + '-dialog ' + this.classNames}
            dialog={this}
        >
            {this.renderPage()}
        </Dialog>);
    }

}

@observer
class BackButton extends React.Component {

    render() {
        return <i key="backButtonIcon" className="page-back-btn fa fa-arrow-left" onClick={this.props.onClose}>
            {this.props.children}
        </i>;
    }
}

export default ADialogList;
