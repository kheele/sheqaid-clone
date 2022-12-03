import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {execWhen} from '../../utils/Utils';
import {ErrorBoundary} from '../';

import style from './Dialog.lazy.css';

function isDescendant(parent, child) {
    var node = child.parentNode;

    while (node !== null) {
        if (node === parent)
            return true;
        node = node.parentNode;
    }

    return false;
}

@observer
class RenderToLayer extends React.Component {

    layer;

    constructor() {
        super();

        this.onClickAway = this.onClickAway.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    onClickAway(e) {//done
        if (e.defaultPrevented) {
            return;
        }

        const {preventEsc, state} = this.props;
        if (!this.props.state.isOpen) {
            return;
        }

        const el = this.layer;
        if (e.target !== el && e.target === window || document.documentElement.contains(e.target) && !isDescendant(el, e.target)) {
            this.props.onClickAway(e);
        }
    }

    onKeyUp(e) {//done
        if (e.defaultPrevented) {
            return;
        }

        const {preventEsc, state} = this.props;
        if (preventEsc || !state.isOpen) {
            return;
        }

        this.props.onKeyUp(e);
    }

    componentDidUpdate() {
        this.renderLayer();
    }

    componentWillUnmount() {
        this.unrenderLayer();
    }

    unrenderLayer() {//done
        if (!this.layer) {
            return;
        }

        if (this.props.useLayerForClickAway) {
            //this.layer.removeEventListener('touchstart', this.onClickAway);
            this.layer.removeEventListener('click', this.onClickAway);
            this.layer.removeEventListener('keyup', this.onKeyUp);
        } else {
            //window.removeEventListener('touchstart', this.onClickAway);
            window.removeEventListener('click', this.onClickAway);
            window.removeEventListener('keyup', this.onKeyUp);
        }

        ReactDOM.unmountComponentAtNode(this.layer);
        try {
            document.body.removeChild(this.layer);
        } catch (err) {

        }

        this.layer = null;
    }

    renderLayer() {//done
        if (this.props.state.isOpen) {
            if (!this.layer) {
                this.layer = document.createElement('div');
                this.layer.id = "root-layer";
                this.layer.tabIndex = "0";
                document.body.appendChild(this.layer);
                this.layer.focus();

                //setTimeout(function () {
                    const el = this.props.useLayerForClickAway ? this.layer : window;
                    //el.addEventListener('touchstart', this.onClickAway);
                    el.addEventListener('click', this.onClickAway);
                    el.addEventListener('keyup', this.onKeyUp);
                //}.bind(this), 0);
            }

            var layerElement = this.props.render();
            this.layerElement = ReactDOM.unstable_renderSubtreeIntoContainer(this, layerElement, this.layer);
        } else {
            this.unrenderLayer();
        }
    }

    render() {//done
        const isOpen = this.props.state.isOpen;
        return null;
    }
}

@observer
class DialogInline extends React.Component {

    contentElem;
    @observable
    state = {
        title: null,
        topButtons: null
    };

    constructor(props) {
        super(props);

        this.setTitle = this.setTitle.bind(this);
    }

    componentWillMount() {
        style.use();
        const {title, topButtons} = this.props;
        this.state.title = title;
        this.state.topButtons = topButtons;
    }

    componentWillUnmount() {
        this.contentElem = null;
        style.unuse();
    }

    setTitle(title) {
        this.state.title = title;
    }
    
    setTopButtons(topButtons) {
        this.state.topButtons = topButtons;
    }
    
    addClass(c) {
        $(this.getDOMNode()).addClass(c);
    }
    
    removeClass(c) {
        $(this.getDOMNode()).removeClass(c);
    }
    
    getDOMNode() {
        return this.refs.dialogRef;
    }

    render() {
        const {className, onCancel, onClose, noBackAction, preventEsc, bottomButtons, children} = this.props;
        return (<div ref="dialogRef" key="dialog" id="dialog-overlay" className={className}>
            <div className="dialog-container">
                <div className="row dialog-header">
                    {!noBackAction && <i key="backButtonIcon" className="page-back-btn fa fa-arrow-left" onClick={onCancel || onClose}/>}
                    {(!noBackAction && !preventEsc) && <i className="close-escape">Esc</i>}
                    <h3>{this.state.title || ""}</h3>
                    {!!this.state.topButtons && <div className="dialog-top-buttons">
                        <ErrorBoundary>{this.state.topButtons}</ErrorBoundary>
                    </div>}
                </div>
                <div className="row dialog-content nice-scrollbars">
                    <ErrorBoundary>{children}</ErrorBoundary>
                </div>
                {!!bottomButtons && <div className="row dialog-footer">
                    <div className="dialog-bottom-buttons">
                        <ErrorBoundary>{bottomButtons}</ErrorBoundary>
                    </div>
                </div>}
            </div>
        </div>);
    }
}

@observer
class Dialog extends React.Component {

    renderLayer;
    @observable layerState = {
        isOpen: false
    }

    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        const _props = {
            ...props,
            ref: ref => {
                this.dialogInline = ref;
            },
            onClose: this.close,
        };

        this.renderLayer = () => {
            return React.createElement(DialogInline, _props);
        };
    }

    setTitle(title) {
        execWhen(() => this.dialogInline).then(dialogInline => {
            dialogInline.setTitle(title);
        });
    }

    setTopButtons(topButtons) {
        execWhen(() => this.layerState.isOpen).then(() => {
            execWhen(() => this.dialogInline).then(dialogInline => {
                dialogInline.setTopButtons(topButtons);
            });
        });
    }

    open(title) {        
        return new Promise((resolve, reject) => {
            //this.isOpen = false;
            this.layerState.isOpen = true;
            (!!title && this.setTitle(title));
            resolve();
        });
    }

    close() {
        const {onClose} = this.props;
        onClose && onClose();
        this.layerState.isOpen = false;
    }

    onKeyUp(evt) {
        const {preventEsc} = this.props;
        if(preventEsc) {
            return;
        }
        
        let isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27 || evt.which === 27);
        }
        if (isEscape) {
            this.close();
        }
    }
    
    addClass(c) {
        this.dialogInline && this.dialogInline.addClass(c);
        return this;
    }
    
    removeClass(c) {
        this.dialogInline && this.dialogInline.removeClass(c);
        return this;
    }

    getDOMNode() {
        return this.dialogInline && this.dialogInline.getDOMNode();
    }

    render() {
        const {preventEsc, noBackAction} = this.props;
        return React.createElement(RenderToLayer, {
            render: this.renderLayer, 
            preventEsc: preventEsc || noBackAction,
            onClickAway: this.close, 
            onKeyUp: this.onKeyUp,
            state: this.layerState
        });
    }
}

RenderToLayer.propTypes = {
    preventEsc: PropTypes.bool,
    onClickAway: PropTypes.func,
    onKeyUp: PropTypes.func,
    render: PropTypes.func.isRequired,
    useLayerForClickAway: PropTypes.bool
};
RenderToLayer.defaultProps = {
    useLayerForClickAway: true
};
DialogInline.propTypes = {
    preventEsc: PropTypes.bool,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node.isRequired
};
Dialog.propTypes = {
    title: PropTypes.string,
    preventEsc: PropTypes.bool,
    noBackAction: PropTypes.bool,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    topButtons: PropTypes.node,
    bottomButtons: PropTypes.node,
    children: PropTypes.node.isRequired
};

export default Dialog;
