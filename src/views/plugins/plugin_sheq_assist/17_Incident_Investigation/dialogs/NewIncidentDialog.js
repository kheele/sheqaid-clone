// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewDialog from 'components/dialogs/ANewDialog';

import onSubmitCreate from "./IncidentForms/onSubmitCreate";
import onNextImpl from "./IncidentForms/onNext";
import {newRender} from './IncidentForms';
import style from "./NewIncidentDialog.lazy.css";
import AIncidentWritableForm from "./IncidentForms/AIncidentWritableForm";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
	pageKey = "NewIncidentDialog";
	title = "Create Incident";

	constructor(props) {
		super(props, style);
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AIncidentWritableForm {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		return onNextImpl.call(this, e, btn);
	}
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		onSubmitCreate.call(this, e, btn, onSaved);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		return newRender.call(this);
	}

	// </editor-fold>

}

export default NewDialog;
