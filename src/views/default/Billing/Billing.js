import React from "react";
import {observer} from 'mobx-react';

import APage from "../../APage";

@observer
class Billing extends APage {
    static key = 'Billing';
	
	constructor(props) {
        super(props);
    }
	
	componentDidMount() {
		super.componentDidMount();
		
//		window.app.onPageComplete();
	}
	
	render() {
		return (<div id="billing-page" className={this.classNames}>
			<div className="page-title">{this.renderBackBtn()}<h3>Billing</h3></div>
		</div>);
	}
}

Billing.propTypes = {
	//classes: PropTypes.object.isRequired
};

export default Billing;
