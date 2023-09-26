import {observer} from "mobx-react";
import React from "react";
import Form from "utils/Form";
import {setDefaultVal} from "utils/UtilsFuns";

//<editor-fold desc="AControls">
@observer
class AControls extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props, style) {
		super(props);

		this.style = style;

		this.onNext && (this.onNext = this.onNext.bind(this));

		this.form = new Form();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="mounts">
	componentDidMount() {
		const {title, props: {dialog, dialog: {execWhen}}} = this;
		const setDefaultValue = setDefaultVal.bind(this);

		if (title) {
			dialog.setTitle(title);
		}

		if (this.item) {
			execWhen(() => this._reactInternals).then(_reactInternals => {
				return execWhen(() => {
					try {
						const {inputRefs} = _reactInternals.child.stateNode;
						return inputRefs;
					} catch (e) {

					}
				});
			}).then(children => {
				children.forEach(child => {
					setDefaultValue(child.ref);
				});
			});
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;

		const {formData} = form;

		const data = {...formData};

		console.log(data)

		return data;
	}

	// </editor-fold>

	get item() {
		return this.props.state.item;
	}

}

//</editor-fold>

export default AControls;