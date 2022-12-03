import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {calculateRightPos, isTouch} from '../../utils/Utils';

@observer
class Clickable extends React.Component {

    @observable
    shouldRender = true;
    
    constructor(props) {
        super(props);
        if ("shouldRender" in props) {
            this.shouldRender = props.shouldRender;
        }

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onMouseOver(e) {
        if(isTouch()) {
            return;
        }
        const {hoverText, onMouseOver} = this.props;
        if(hoverText) {
            const target = this.getDOMNode();
            const jq = $(target);
            const w = jq.outerWidth();
            const h = jq.outerHeight();
            const {top} = jq.offset();
            const right = calculateRightPos(target);
            popover.settings({
                style: {left: "auto", right: right, top: top + h + 12, width: 'auto'},
                contentNode: <div>{hoverText}</div>
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
        this.props.onClick && this.props.onClick(e, this);
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
        if(!this.shouldRender) return null;
        const childrenWithExtraProp = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {onClick: this.onClick});
        });
        return (<React.Fragment>
            {childrenWithExtraProp}
        </React.Fragment>);
    }
}

export default Clickable;
