import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

import navStyle from "./nav.lazy.css";

@observer
class Nav extends React.Component {

    constructor(props) {
        super(props);
    }
	
	componentWillMount() {
		navStyle.use();
	}
		
	componentWillUnmount() {
		navStyle.unuse();
	}
	
    selectItemByKey(key) {
		const self = ReactDOM.findDOMNode(this);
		$(self).children().removeClass("nav-item-active");
		const item = self.querySelector("#nav-item-" + key);
		!!item && item.classList.add("nav-item-active");
	}
	
	render() {
		const className = this.props.className ? (" " + this.props.className) : null;
		return (<div className={"nav" + className} >
			{this.props.children}
		</div>);
	}
}

Nav.propTypes = {
	children: PropTypes.node.isRequired
};

export default Nav;
