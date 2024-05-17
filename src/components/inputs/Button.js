import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
//import Ripples from 'react-touch-ripple';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {calculateRightPos, isTouch} from '../../utils/Utils';

@observer
class Button extends React.Component {

    @observable
    shouldRender = true;
    @observable
    val = null;

    constructor(props) {
        super(props);
        if ("shouldRender" in props) {
            this.shouldRender = props.shouldRender;
        }
        if ("text" in props) {
            this.val = props.text;
        }

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.readonly || this.props.disabled) {
                this.disabled();
            }
        }, 0);
    }

    componentWillUpdate() {
        if (!this.shouldRender)
            return;
        setTimeout(() => {
            if (this.props.readonly || this.props.disabled) {
                this.disabled();
            } else if (this.isDisabled()) {
                this.enabled();
            }
        }, 0);
    }

    onMouseOver(e) {
        if(isTouch()) {
            return;
        }
        const {hoverText, hoverTextLeft, onMouseOver} = this.props;
        if(hoverText) {
            const target = this.getDOMNode();
            const jq = $(target);
            const w = jq.outerWidth();
            const h = jq.outerHeight();
            const {left: _left, top} = jq.offset();
            const right = hoverTextLeft ? 'auto' : calculateRightPos(target);
            const left = hoverTextLeft ? _left: 'auto';
            popover.settings({
                style: {left, right, top: top + h + 12, width: 'auto'},
                contentNode: <div>{hoverText}</div>,
            }).open();
        }
        onMouseOver && onMouseOver(e, this);
    }

    onMouseOut(e) {
        if(isTouch()) {
            return;
        }
        const {hoverText, onMouseOut} = this.props;
        if(hoverText) {
            popover.close();
        }
        onMouseOut && onMouseOut(e, this);
    }

    onClick(e) {
        const {onClick} = this.props;
        onClick && onClick(e, this);
    }

    text(val) {
        if (!!val) {
            this.val = val;
            return this;
        } else {
            return this.val;
        }
    }

    enabled() {
        const el = this.getDOMNode();
        if (el) {
            el.style.pointerEvents = "all";
            el.style.cursor = "pointer";
            el.style.opacity = "1";
        }
        return this;
    }

    disabled() {
        const el = this.getDOMNode();
        if (el) {
            el.style.pointerEvents = "none";
            el.style.cursor = "default";
            el.style.opacity = ".65";
        }
        return this;
    }

    isDisabled() {
        const el = this.getDOMNode();
        return el && (el.style.pointerEvents === "none" && el.style.cursor === "default" && el.style.opacity === ".65");
    }

    show() {
        this.shouldRender = true;
    }

    hide() {
        this.shouldRender = false;
    }

    toggle() {
        this.shouldRender = !this.shouldRender;
    }

    getDOMNode() {
        try {
            return ReactDOM.findDOMNode(this);
        } catch (e) {
//			console.error(e);
            return null;
        }
    }

    render() {
        const {style} = this.props;
        return this.shouldRender && <button className={this.props.className} style={style} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onClick}>
            {this.val || this.props.children}
        </button>;
    }
}

Button.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    text: PropTypes.string,
    rippleColor: PropTypes.string
};

Button.defaultProps = {
    rippleColor: "rgba(255, 255, 255, 0.3)"
};

export default Button;