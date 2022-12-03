import React from "react";
import {findDOMNode} from "react-dom";
import {computed, extendObservable, observable} from 'mobx';
import {observer} from 'mobx-react';

import {execWhen, scrollTo} from '../../utils/Utils';

//import {Dates, ShouldUpdate, execWhen} from '../../../../../utils/Utils';

@observer
class AFormDialog extends React.Component {
    style;

    @observable
    state = {item: null};
    onResponse;
    @observable
    extraProps = {};

    constructor(props, style) {
        super(props);

        this.style = style;
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onClose = this.onClose.bind(this);

        this.execWhen = execWhen.bind(this);
        this.scrollTo = scrollTo.bind(this);
        this.onFormGotoImpl = this.onFormGotoImpl.bind(this);
        this.onFormGoto = this.onFormGoto.bind(this);
        this.onFormGotoNext = this.onFormGotoNext.bind(this);
        this.onFormGotoPrev = this.onFormGotoPrev.bind(this);
        this.onFormOpen = this.onFormOpen.bind(this);
        this.onFormBack = this.onFormBack.bind(this);
        this.onFormNext = this.onFormNext.bind(this);
        this.onFormChange = this.onFormChange.bind(this);
        
        this.showSubmitBtn = this.showSubmitBtn.bind(this);
        this.showCancelBtn = this.showCancelBtn.bind(this);
        this.hideSubmitBtn = this.hideSubmitBtn.bind(this);
        this.hideCancelBtn = this.hideCancelBtn.bind(this);
    }

    componentWillMount() {
        !!this.style && this.style.use();
    }

    componentDidMount() {
        setTimeout(() => {
            const {open} = this.props;
            open && this.open();
        }, 0);
    }

    componentWillUnmount() {
        !!this.style && this.style.unuse();
    }

    setTitle(title) {
        setTimeout(() => {
            this.refs.dialog.setTitle(title);
        });
        return this;
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

    open(item) {
        return new Promise((resolve, reject) => {
            this.state.item = item;
            this.onResponse = resolve;
            
            const title = isFunction(this.title) ? this.title() : this.title;
            this.refs.dialog.open(title);
        });
    }

    close() {
        const {dialog} = this.refs;
        dialog && dialog.close();
    }

    onClose() {
        this.extraProps = {};
        this.state.item = null;
    }

    onCancel(e, btn) {
        this.close();
    }

    onSubmit(e, btn) {
        this.refs.controls.onSubmit(e, btn, this.onResponse);
    }

    onFormGotoImpl(currRow) {
        const curr = currRow.addClass('active');
        currRow.prevAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');
        currRow.nextAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');
        this.scrollTo(curr).then(() => {
            this.onFormChange(curr.index());
        });
    }

    onFormGoto(idx) {
        const currRow = $(findDOMNode(this.refs.controls)).find('.controls').children('.row:not(.row-profile-cover, .active-always):nth-child(' + idx + ')');
        this.onFormGotoImpl(currRow);
    }

    onFormGotoNext() {
        const currRow = $(findDOMNode(this.refs.controls)).find('.controls').children('.row.active').next(".row:not(.row-profile-cover, .active-always)");
        this.onFormGotoImpl(currRow);
    }

    onFormGotoPrev() {
        const currRow = $(findDOMNode(this.refs.controls)).find('.controls').children('.row.active').prev(".row:not(.row-profile-cover, .active-always)");
        this.onFormGotoImpl(currRow);
    }

    onFormOpen(e, btn) {
        const currRow = $(e.target).closest('.row');
        if (currRow.hasClass('active')) {
            currRow.removeClass('active');
        } else {
            const curr = currRow.addClass('active');
            currRow.prevAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');
            currRow.nextAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');
            this.scrollTo(curr).then(() => {
                this.onFormChange(curr.index());
            });
        }
    }

    onFormBack(e, btn) {
        const currRow = $(btn.getDOMNode ? btn.getDOMNode() : e.target).closest('.row.active');
        currRow.removeClass('active');
        const prev = currRow.prev(".row:not(.row-profile-cover, .active-always)").addClass('active');
        this.scrollTo(prev).then(() => {
            this.onFormChange(prev.index());
        });
    }

    async onFormNext(e, btn) {
        const {onNext} = this.refs.controls;
        if (isFunction(onNext)) {
            let res = onNext(e, btn);
            if(res instanceof Promise) {
                res = await res;
            }
            if(!res) return;
        }

        const currRow = $(btn.getDOMNode()).closest('.row.active');
        currRow.removeClass('active');
        const next = currRow.next(".row:not(.row-profile-cover, .active-always)").addClass('active');
        this.scrollTo(next).then(() => {
            this.onFormChange(next.index());
        });
    }
    
    onFormChange(idx) {
        const {onFormChange} = this.refs.controls;
        isFunction(onFormChange) && onFormChange(idx + 1);
    }

    addClass(c) {
        setTimeout(() => {
            const {dialog} = this.refs;
            dialog && dialog.addClass(c);
        });
        return this;
    }
    
    removeClass(c) {
        setTimeout(() => {
            const {dialog} = this.refs;
            dialog && dialog.removeClass(c);
        });
        return this;
    }

    getDOMNode() {
        return this.refs.dialog.getDOMNode();
    }

    @computed get item() {
        return this.state.item;
    }
    
    showSubmitBtn() {
        const {submit} = this.refs;
        submit && submit.show();
        return this;
    }
    
    showCancelBtn() {
        const {cancel} = this.refs;
        cancel && cancel.show();
        return this;
    }
    
    hideSubmitBtn() {
        const {submit} = this.refs;
        submit && submit.hide();
        return this;
    }
    
    hideCancelBtn() {
        const {cancel} = this.refs;
        cancel && cancel.hide();
        return this;
    }
    
}

export default AFormDialog;
