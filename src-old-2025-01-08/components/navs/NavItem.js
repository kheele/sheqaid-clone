import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

import style from "./nav-item.lazy.css";

@observer
class NavItem extends React.Component {

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onClick(e) {
        const self = ReactDOM.findDOMNode(this);
        if ($(self).closest(".drawer-container").length > 0) {
            $(self).parent().children().removeClass("nav-item-active");
            self.classList.add("nav-item-active");
        }
        this.props.onClick && this.props.onClick(e, this);
    }

    render() {
        let {color, className: propsClassName, faIconLeft, faIconRight, leftIconBadge, rightIconBadge, title, children, } = this.props;
        let className = "nav-item";
        if (propsClassName) {
            className += " " + propsClassName;
        }
        return (<div id={"nav-item-" + this._reactInternals.key} className={className} style={{color}} onClick={this.onClick}>
            {faIconLeft && <i className={"nav-item-fa-icon-left fa fa-" + faIconLeft}>
                {leftIconBadge && <span className="badge">{leftIconBadge}</span>}
            </i>}
            {title && <span className="nav-item-title">{title}</span>}
            {children}
            {faIconRight && <i className={"nav-item-fa-icon-right fa fa-" + faIconRight}>
                {rightIconBadge && <span className="badge">{rightIconBadge}</span>}
            </i>}
        </div>);
    }
}

NavItem.propTypes = {
    faIconLeft: PropTypes.string,
    faIconRight: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default NavItem;
