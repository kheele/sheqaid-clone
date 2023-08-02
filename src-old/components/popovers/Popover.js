import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';

import style from './Popover.lazy.css';

@observer
class RenderToLayer extends React.Component {

    layer;

    constructor() {
        super();

        this.onClickAway = this.onClickAway.bind(this);
    }

    onClickAway(e) {//done
//        console.log(e)
        if (e.defaultPrevented || !this.props.state.isOpen) {
            return;
        }
        
        let {preventClickAwayClose, onClickAway} = this.props.config;
        const clickedOut = $(e.target).closest('.popover-container').length === 0;
        
//        alert(isFunction(preventClickAwayClose))
        if(isFunction(preventClickAwayClose) && preventClickAwayClose()) {
            return;
        }
        if(clickedOut && preventClickAwayClose) {
            return;
        }
        
        if (clickedOut) {
            onClickAway && onClickAway(e);
            this.props.onClickAway(e);
            return;
        }

        setTimeout(() => {
//        console.log('onClickAway-', $(e.target).closest('.popover-container').length, this.props.state.preventAutoClose)
            if (!this.props.state.preventAutoClose) {
                this.props.onClickAway(e);
            }
        }, 100);
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

        let {className} = this.props.config;
        if (className) {
            const overlay = this.layer.querySelector('#popover-overlay');
            if(overlay) {
                const {classList} = overlay;
                classList.remove(...className.split(' '));
                classList.remove('dialog');
            }
        }

        this.props.onClose();

        //window.removeEventListener('touchstart', this.onClickAway);
        window.removeEventListener('click', this.onClickAway);

        ReactDOM.unmountComponentAtNode(this.layer);
        document.body.removeChild(this.layer);

        this.layer = null;
    }

    renderLayer() {//done
        if (this.props.state.isOpen) {
            if (!this.layer) {
                this.layer = document.createElement('div');
                this.layer.id = "root-layer";
                document.body.appendChild(this.layer);

                setTimeout(() => {
                    window.addEventListener('touchstart', this.onClickAway);
                    window.addEventListener('click', this.onClickAway);
                });
            }

            const layerElement = this.props.render();
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
class PopoverInline extends React.Component {

    contentElem;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        setTimeout(() => {
            try {
                this.contentElem = ReactDOM.findDOMNode(this).querySelector('.nice-scrollbars');
                const contentElemJq = window.$(this.contentElem);
                const container = contentElemJq.parent();

                container.css({visibility: 'visible'});
                
                const {strictPos, fixedCenter} = this.props.config;
                if(fixedCenter) {
                    container.addClass('fixed-center');
                } else if (!strictPos) {
                    const {top} = container.offset();
                    if (top < 0) {
                        container.css({top: 'clamp(10px, 10px, 10px)', bottom: 'auto'});
                    } else {
                        const wh = $(window).height();
                        const bottom = wh - (top + container.outerHeight());
                        if (bottom < 0) {
                            container.css({top: 'auto', bottom: -wh + 10});
                        }
                    }
                }

                this.props.config.onShown && this.props.config.onShown();
            } catch (e) {

            }
        });
    }

    componentWillUnmount() {
        const contentElemJq = window.$(this.contentElem);
        const container = contentElemJq.parent();
        container.removeClass('fixed-center');
        
        this.contentElem = null;
        
        style.unuse();
    }

    render() {
        const style = {width: 240, height: "auto", visibility: 'hidden', ...this.props.config.style};
        let {isDialog, contentNode, className} = this.props.config;
        isDialog && (className += " dialog");
        return (<div key={contentNode ? contentNode.key : new Date().getTime()} id="popover-overlay" className={className}>
            <div className="popover-container" style={style}>
                <div className="nice-scrollbars">
                    {contentNode}
                </div>
            </div>
        </div>);
    }
}

@observer
class Popover extends React.Component {

    renderLayer;
    @observable
    config = {
        style: null,
        //arrow: "center",
        contentNode: null,
        onShown: null,
        onResize: null,
        onClickAway: null,
        isDialog: false,
        preventClickAwayClose: false
    };
    @observable
    layerState = {
        preventAutoClose: false,
        isOpen: false
    };

    constructor(props) {
        super(props);

        this.settings = this.settings.bind(this);
        this.onCreateConfig = this.onCreateConfig.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        this.renderLayer = function () {
            const _props = {
                config: this.config,
                ...props
            };
            return React.createElement(PopoverInline, _props);
        };
    }

    settings(settings) {
        this.onCreateConfig();
        extendObservable(this.config, settings);
        const {preventAutoClose} = this.props;
        if (preventAutoClose || settings.className === 'calendar-popover' || settings.className === 'time-popover' || settings.className === 'signature-popover') {
            this.layerState.preventAutoClose = true;
        }
        return this;
    }

    onCreateConfig() {
        if(this.config) {
            const {onClosed} = this.config;
            onClosed && onClosed();
        }
        
        this.config.style = null;
        //this.config.arrow = "center";
        this.config.contentNode = null;
        this.config.onShown = null;
        this.config.onResize = null;
        this.config.onClickAway = null;
        this.config.isDialog = false;
        this.config.preventClickAwayClose = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            this.layerState.isOpen = true;
            resolve();
        });
    }

    close() {
        this.layerState.isOpen = false;
    }

    render() {
        return React.createElement(RenderToLayer, {
            render: this.renderLayer,
            onClickAway: this.close,
            state: this.layerState,
            config: this.config,
            onClose: this.onCreateConfig
        });
    }
}

RenderToLayer.propTypes = {
    state: PropTypes.object.isRequired,
    onClickAway: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired
};

PopoverInline.propTypes = {
    config: PropTypes.object.isRequired
};

export default Popover;
