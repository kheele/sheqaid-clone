import React from "react";
import {findDOMNode} from "react-dom";
import {computed, extendObservable, observable} from 'mobx';
import {observer} from 'mobx-react';

import {createGetter, execWhen, findReactComponent, scrollTo} from '../../utils/Utils';

@observer
class AFormDialog extends React.Component {
    style;

    @observable
    state = {item: null, itemToView: null, onResponse: null,};
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

    @computed get item() {
        return this.state.item;
    }

    set cssWidth(w) {
        const {style} = document.documentElement;
        const attr = `--${this.pageKey}-dialog-width`;
        style.setProperty(attr, w);
        // this.setCssVar(`${this.pageKey}-dialog-width`, w);
    }

    set cssHeight(w) {
        const {style} = document.documentElement;
        const attr = `--${this.pageKey}-dialog-height`;
        style.setProperty(attr, w);
        // this.setCssVar(`${this.pageKey}-dialog-height`, w);
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
        this.execWhen(() => this.refs.dialog).then(dialog => {
            dialog.setTitle(title);
        });
        return this;
    }

    extraProp(key, val) {
        const argsLen = arguments.length;
        if (argsLen === 1) {
            return this.extraProps[key];
        }
        if (argsLen === 2) {
            if (!!key) {
                if (!!val) {
                    extendObservable(this.extraProps, {[key]: val});
                } else if (val === null || val === undefined) {
                    delete this.extraProps[key];
                }
            }
        }
        return this;
    }

    open(item) {
        this.state.itemToView = item;
        return new Promise(async (resolve, reject) => {
            this.state.onResponse = resolve;

            this.refs.dialog.open();

            if (!this.topButtonsHiddenCancel) {
                this.execWhen(() => this.refs.cancel).then(cancel => {
                    cancel.show();
                });
            }

            const {key, findById} = this;

            if (key === "ANewDialog" && item && findById) {
                this.state.item = await findById(item.id);
            } else if (item) {
                if (findById) {
                    this.state.item = await findById(item.id);
                } else {
                    this.state.item = item;
                }
            }

            let title = isFunction(this.title) ? this.title() : this.title;
            if (title instanceof Promise) {
                title = await title;
            }
            this.refs.dialog.setTitle(title);

            const controls = await execWhen(() => this.refs.controls);

            createGetter.call(controls, "dialog", () => this);

            // createGetter.call(controls, "item", () => this.state.item);
            if (item && controls.state) {
                controls.state.item = item;
                // createGetter.call(controls, "item", () => {
                // 	const {$mobx} = this;
                // 	console.log('createGetter', this, $mobx)
                // 	if ($mobx && $mobx.values) {
                // 		const {values} = $mobx;
                // 		if (values['item']) {
                // 			return values['item'].get();
                // 		}
                // 	}
                // });
                // 	// createGetter.call(controls, "item", computed(() => this.state.item));
                // 	// createGetter.call(controls, "item", () => this.state.item);
                // 	// extendObservable(controls, {item: computed(() => this.state.item)});
            }
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
        confirmDialog.open("Do you wish to cancel the form?").then(res => {
            if (res === 1) {
                this.close();
            }
        });
    }

    onSubmit(e, btn) {
        this.refs.controls.onSubmit(e, btn, this.state.onResponse);
    }

    onFormGotoImpl(currRow) {
        const curr = currRow.addClass('active');
        currRow.prevAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');
        currRow.nextAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');

        const currComp = findReactComponent(curr[0]);
        if (currComp && currComp.props.lazyLoad) {
            currComp.show();
        }
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
        const {idx, lazyLoad, getFormChildren} = btn.props;

        const currRow = $(e.target).closest('.row');
        if (currRow.hasClass('active')) {
            currRow.removeClass('active');
            if (lazyLoad) {
                const rows = getFormChildren();
                console.log('rows', rows)
                const currRowComp = rows.find(row => row.props.idx === idx);
                currRowComp && currRowComp.hide && currRowComp.hide();
            }
        } else {
            const curr = currRow.addClass('active');
            currRow.prevAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');
            currRow.nextAll(".row:not(.row-profile-cover, .active-always)").removeClass('active');

            if (lazyLoad) {
                const rows = getFormChildren();
                rows.forEach(row => {
                    const {idx: _idx, className} = row.props;

                    if (className && (className.contains('row-profile-cover') || className.contains('active-always'))) return;

                    if (_idx === idx) {
                        row.show && row.show();
                    } else {
                        row.hide && row.hide();
                    }
                });
            }
            this.scrollTo(curr).then(() => {
                this.onFormChange(curr.index());
            });
        }
    }

    onFormBack(e, btn) {
        const {idx, lazyLoad, getFormChildren} = btn.props;

        const currRow = $(btn.getDOMNode ? btn.getDOMNode() : e.target).closest('.row.active');
        currRow.removeClass('active');
        if (lazyLoad) {
            const rows = getFormChildren();
            const currRowComp = rows.find(row => row.props.idx === idx);
            currRowComp && currRowComp.hide && currRowComp.hide();
        }

        const prev = currRow.prev(".row:not(.row-profile-cover, .active-always)").addClass('active');
        if (lazyLoad) {
            const rows = getFormChildren();
            const prevRowCompIdx = rows.indexOfWithPredicate(row => row.props.idx === idx);
            const prevRowComp = rows[prevRowCompIdx - 1];
            prevRowComp && prevRowComp.show && prevRowComp.show();
        }
        this.scrollTo(prev).then(() => {
            this.onFormChange(prev.index());
        });
    }

    async onFormNext(e, btn) {
        const {onNext} = this.refs.controls;
        if (isFunction(onNext)) {
            let res = onNext(e, btn);
            if (res instanceof Promise) {
                res = await res;
            }
            if (!res) return;
        }

        const {idx, lazyLoad, getFormChildren} = btn.props;

        const currRow = $(btn.getDOMNode()).closest('.row.active');
        currRow.removeClass('active');
        if (lazyLoad) {
            const rows = getFormChildren();
            const currRowComp = rows.find(row => row.props.idx === idx);
            currRowComp && currRowComp.hide && currRowComp.hide();
        }

        const next = currRow.next(".row:not(.row-profile-cover, .active-always)").addClass('active');
        if (lazyLoad) {
            const rows = getFormChildren();
            const nextRowCompIdx = rows.indexOfWithPredicate(row => row.props.idx === idx);
            const nextRowComp = rows[nextRowCompIdx + 1];
            nextRowComp && nextRowComp.show && nextRowComp.show();
        }
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

    getHeader() {
        return this.refs.dialog.getHeader();
    }

    getHeaderDOMNode() {
        return this.refs.dialog.getHeaderDOMNode();
    }

    getTitleDOMNode() {
        return this.refs.dialog.getTitleDOMNode();
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

    setCssVar(attr, val) {
        const {style} = document.documentElement;
        attr = `--${attr}`;
        style.setProperty(attr, val);
    }
}

export default AFormDialog;
