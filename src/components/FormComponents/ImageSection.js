//<editor-fold desc="imports">
import {observer} from "mobx-react";
import React from "react";
import {ClearableInput, UploadButton} from "components/inputs";
import {ASectionSection, FormControls, Row} from "components/FormComponents";
import {computed, observable} from "mobx";
import {AEditDialog, ANewDialog} from "../dialogs";
import styleNewImage from "./NewImageDialog.lazy.css";
import styleEditImage from "./EditImageDialog.lazy.css";
import Form from "utils/Form";
import {ShouldUpdate, toDataURI} from "utils/Utils";
//</editor-fold>

//<editor-fold desc="NewImageDialog">
@observer
class NewImageDialog extends ANewDialog {
	pageKey = "NewImageDialog";
	title = "Add Image";

	constructor(props) {
		super(props, styleNewImage);
	}

	get controls() {
		return  ControlsNewImage;
	}
}
//</editor-fold>

//<editor-fold desc="EditImageDialog">
@observer
class EditImageDialog extends AEditDialog {
	pageKey = "EditImageDialog";
	title = "Edit Image";

	constructor(props) {
		super(props, styleEditImage);
	}

	get controls() {
		return ControlsEditImage;
	}
}
//</editor-fold>

//<editor-fold desc="ControlsNewImage">
@observer
class ControlsNewImage extends React.Component {

	constructor(props) {
		super(props);

		this.form = new Form();
	}

	async onSubmit(e, btn, onSaved) {
		const {form, isNewEmployee, embeddedEmployee, props: {dialog: {props:{item_id_key, onInsert}}}} = this;

		if(isNewEmployee) {
			console.log("res", form.data)
			onSaved && onSaved(form.data);
			infoDialog.open("Record added.");
			infoDialog.close(2000);
			this.props.close();
			return;
		}

		const {
			doc,//
		} = form.data;
		const data = {
			[item_id_key]: embeddedEmployee && embeddedEmployee.id,
			doc: doc ? {path: await toDataURI(doc.path)} : null,
		};

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		onInsert(data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}

	get embeddedEmployee() {
		const {props: {dialog: {props: {embeddedEmployee}}}} = this;
		return embeddedEmployee;
	}

	get isNewEmployee() {
		const {props: {dialog: {props: {isNewEmployee}}}} = this;
		return isNewEmployee;
	}

	get employeeItem() {
		return this.props.state.item;
	}

	render() {
		const {props:{onFormOpen}} = this;

		return <FormControls>
			<Row
				rendered
				activeAlways
				idx={1}
				title="1. Image Details"
				onFormOpen={onFormOpen}
			>
				<UploadButton
					name="doc"
					buttonTitle="Upload Image"
					type={['Image']}
					showOnlyIcon
					className="col-lg-12 margin-t-30"
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}
}
//</editor-fold>

//<editor-fold desc="ControlsEditImage">
@observer
class ControlsEditImage extends React.Component {

	constructor(props) {
		super(props);

		this.form = new Form();
	}

	onSubmit(e, btn, onSaved) {
		const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props:{embeddedEmployee, onUpdate}}}} = this;

		const {
			doc
		} = form.data;

		const data = {};

		ShouldUpdate.checkFile(data, old_data, doc, 'doc');

		if (Object.keys(data).isEmpty()) {
			infoDialog.open("Nothing changed!");
			return;
		}

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		onUpdate({id: this.item.id, ...data}).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}

	get isNewEmployee() {
		const {props: {dialog: {props: {isNewEmployee}}}} = this;
		return isNewEmployee;
	}

	get item() {
		return this.props.state.item;
	}

	render() {
		if (!this.item)
			return null;
		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {props: {embeddedEmployee, isNewEmployee,}}
			},
			item, item: {
				id, data: {
					doc
				}
			}
		} = this;

		return <FormControls>
			<Row
				rendered
				activeAlways
				idx={1}
				title="1. Image Details"
				onFormOpen={onFormOpen}
			>
				<UploadButton
					name="doc"
					buttonTitle="Upload Image"
					type={['Image']}
					showOnlyIcon
					defaultValue={doc}
					className="col-lg-12 margin-t-30"
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}
}
//</editor-fold>

//<editor-fold desc="ImageSection">
@observer
class ImageSection extends ASectionSection {

	// type = 'ID/Passport';
	NewDialog = NewImageDialog;
	EditDialog = EditImageDialog;

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
	}

	//</editor-fold>

	get onInsert() {
		return this.props.onInsert;
	}

	get onUpdate() {
		return this.props.onUpdate;
	}

	get listName() {
		return this.props.listName;
	}

	//<editor-fold desc="list">
	@computed get list() {
		if (this.isNewEmployee) {
			return this.state.newList;
		}

		const {itemData, listName} = this;
		const {[listName]: list} = itemData || {};
		return (list || []);//.filter(v => !v || v.type === "ID/Passport");
	}
	//</editor-fold>

	get itemRenderer() {
		return [
			<UploadButton
				name="doc"
				type={['PDF', 'Image']}
				defaultValueKey="doc"
				showOnlyIcon={false}
				readonly
				buttonTitle="Upload Image"
				className="col-lg-12 h-400"
			/>,
			// <ProfileField
			// 	name="expiry_date"
			// 	type="date"
			// 	placeholder="Expiry Date"
			// 	valKey="expiry_date"
			// 	className="col-lg-6 pull-left-3"
			// />
		];
	}

}
//</editor-fold>

export default ImageSection;
