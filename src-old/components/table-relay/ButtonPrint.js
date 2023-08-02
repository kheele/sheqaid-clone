import React from "react";
import {observer} from 'mobx-react';

@observer
class ButtonPrint extends React.Component {
	render() {
		return null;/*<Button key="printButton" disabled={this.props.list.isEmpty() ? false : "disabled"} className="btn btn-primary pull-right top-btn-nav__print" onClick={this.props.onClick}>
			<i key="printButtonIcon" className="fa fa-print icon-left"/>Print...
		</Button>;*/
	}
}

ButtonPrint.propTypes = {

};

export default ButtonPrint;
