import React from "react";
import {observer} from 'mobx-react';

import APage from "../../APage";
//change mode: offline|online, backup offline mode
//change background, logo, company name
@observer
class Settings extends APage {
    static key = 'Settings';
	
	constructor(props) {
        super(props);
    }
	
	componentDidMount() {
		super.componentDidMount();
		
//		window.app.onPageComplete();
	}
	
	render() {
		return (<div id="settings-page" className={this.classNames}>
			<div className="page-title">{this.renderBackBtn()}<h3>Settings</h3></div>
		</div>);
	}
}

Settings.propTypes = {
	//classes: PropTypes.object.isRequired
};

export default Settings;
