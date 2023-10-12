import {observer} from "mobx-react";
import {ANewDialog, PrivacyPolicyDialog} from "./index";
import style from "./CookieNoticePanelDialog.lazy.css";
import {execWhen} from "utils/UtilsFuns";
import React from "react";
import {observable} from "mobx";
import {FormControls, Row} from "../FormComponents";
import {Clickable} from "../inputs";

// <editor-fold defaultstate="collapsed" desc="CookieNoticePanelDialog">
@observer
class CookieNoticePanelDialog extends ANewDialog {
	pageKey = "CookieNoticePanelDialog";

	constructor(props) {
		super(props, style);
	}

	async componentDidMount() {
		await execWhen(() => this.refs.dialog);
		this.open();
	}

	title() {
		return 'Cookie Notice';
	}
	
	get topButtons() {
		return null;
	}

	get noBackAction() {
		return true;
	}

	get preventEsc() {
		return true;
	}

	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {

	@observable
	state = {};

	constructor(props) {
		super(props);

		this.onFormSave = this.onFormSave.bind(this);
		this.onViewCookiePolicy = this.onViewCookiePolicy.bind(this);
	}

	onFormSave() {
		this.props.dialog.close();
	}

	onViewCookiePolicy() {
		this.refs.privacyPolicyDialog.open();
	}

	render() {
		return <FormControls>
			<Row
				active
				rendered
				idx={0}
				saveText="OK"
				onFormSave={this.onFormSave}
			>
				<p>
					By using this software, you agree to the storing of cookies on your device to enhance site navigation,
					analyze site usage and allow third-party cookies from trusted partners.
					<Clickable onClick={this.onViewCookiePolicy}><a href="#"> Learn more.</a></Clickable>
				</p>
			</Row>
			<PrivacyPolicyDialog ref="privacyPolicyDialog"/>
		</FormControls>;
	}

}

// </editor-fold>

export default CookieNoticePanelDialog;
