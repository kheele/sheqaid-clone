import React from "react";
import {observer} from 'mobx-react';

import APage from "../../APage";

@observer
class Support extends APage {
    static key = 'Support';
	
	constructor(props) {
        super(props);
    }
	
	componentDidMount() {
		super.componentDidMount();
		
//		window.app.onPageComplete();
	}
	
	render() {
		return (<div id="support-page" className={this.classNames}>
			<div className="page-title">{this.renderBackBtn()}<h3>Support</h3></div>
		</div>);
	}
}

Support.propTypes = {
	//classes: PropTypes.object.isRequired
};

export default Support;
