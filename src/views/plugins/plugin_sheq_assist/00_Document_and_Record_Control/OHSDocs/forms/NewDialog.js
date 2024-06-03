import React from "react";
import { observer } from 'mobx-react';
import { computed, observable, toJS } from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import { ANewDialog } from 'components/dialogs';
import {
	ClearableInput,
	UploadButton,
	SelectModuleClaimsInput,
	SelectModuleExtraInput,
	SelectModuleHRInput,
	SelectModuleSHEQInput
} from 'components/inputs';
import { FormControls, Row } from 'components/FormComponents';

import style from "./NewDialog.lazy.css";
import {insertOHSDoc} from "mutations/create";

//<editor-fold desc="Dialog">
@observer
class NewDialog extends ANewDialog {
	pageKey = "NewDialog";
	title = "Create OHS Document";

	constructor(props) {
		super(props, style);
	}

	get controls() {
		return Controls;
	}
}

//</editor-fold>

@observer
class Controls extends React.Component {

	@observable
	state = {
		lists: {
			plugin: [],
			type: ["Standards", "Policies", "Procedures", "Guidelines", "Legal Register", "OHS Act", "Best Practices"].map(value => {
				return {
					text: value,
					value,
					checked: false
				};
			}),
		},
		plugin: null,
	};

	constructor() {
		super();

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
		this.form.addChangeOne("plugin", this.onChangePlugin.bind(this));
	}

	componentWillMount() {
		this.state.lists.plugin = pluginManager.listAll.
			filter(({ data: { status } }) => status === "Installed").
			map((value) => ({
				label: value.data.title, value,
			}));
	}

	//<editor-fold desc="onChanges">
	onChangePlugin(el, val) {
		this.state.plugin = val;
	}
	//</editor-fold>

	//<editor-fold desc="onNext">
	onNext(e, btn) {
		const { form } = this;

		const { idx } = btn.props;
		if (idx === 1) {
			if (!form.isValid('type')) {
				infoDialog.open('Type is required');
				return;
			}
			if (!form.isValid('title')) {
				infoDialog.open('Document Title is required');
				return;
			}
		}

		return true;
	}

	//</editor-fold>

	//<editor-fold desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const { form } = this;

		if (!form.isValid('type')) {
			infoDialog.open('Type is required');
			return;
		}
		if (!form.isValid('title')) {
			infoDialog.open('Document Title is required');
			return;
		}
		if (!form.isValid('doc')) {
			infoDialog.open('Document is required');
			return;
		}

		const {
			plugin,
			module_list,
			type,
			title,
			desc,
			doc,
		} = form.data;

		const data = {
			type,
			title,
			desc,
			doc,
			module_list: {
				data: (module_list || []).map(({module:{id: module_id}}) => ({
					module_id
				})),
			},
		};

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertOHSDoc(data).then(res => {
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

	//</editor-fold>

    //<editor-fold desc="defaultValue">
    @computed
    get defaultValue() {
        let value;
        if(this.state.plugin) {
            value = this.state.plugin;
        } else {
            const {plugin, module} = this.props.dialog.props;
            const p = this.state.lists.plugin.find(({value:{data: {key}}}) => key === plugin);
            if(p) {
                value = p.value;
            }
        }

        if(value) {
            return {label: value.data.title, value};
        }
    }
    //</editor-fold>

	//<editor-fold desc="render">
	render() {
		if (this.state.lists.plugin.isEmpty()) {
			return <CircularProgress className="fixed-center" />;
		}

		const { props: { onFormNext, onFormBack, onFormOpen, dialog: {props:{plugin, module}} } } = this;
		
		return <FormControls
			form={this.form}
			onChange={this.form.onChange}
		>
			<Row
				rendered
				active
				idx={1}
				title='1. Details'
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				<ClearableInput
					name="type"
					type="radio"
					placeholder="Type"
					className="col-lg-12 form-control"
					vertical
					values={this.state.lists.type}
					onChange={this.form.onChange}
				/>
				<ClearableInput
					name="title"
					type="text"
					placeholder="Document Title"
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>
				<ClearableInput
					name="desc"
					type="textarea"
					placeholder="Description"
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>
			</Row>
			<Row
				rendered
				idx={2}
				title='2. Applicable Modules'
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<ClearableInput
					name="plugin"
					type="select"
					placeholder="Plugin"
					defaultValue={this.defaultValue}
					vertical
					className="col-lg-12 form-control"
					values={this.state.lists.plugin}
					returnValue
					onChange={this.form.onChange}
				/>
				<SelectModule
					state={this.state}
					defaultValue={module}
					onChange={this.form.onChange}
				/>
			</Row>
			<Row
				rendered
				idx={3}
				title={`3. Document Attachment`}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<UploadButton
					name="doc"
					buttonTitle="Upload File (PDF, Word, Excel, PowerPoint)"
					type={['PDF', 'Word', 'Excel', 'PPT']}
					showOnlyIcon
					className="col-lg-12"
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}

	//</editor-fold>
}

//<editor-fold desc="SelectModule">
@observer
class SelectModule extends React.Component {
	render() {
		const { state: { plugin }, defaultValue, onChange } = this.props;

		if (!plugin) {
			return null;
		}

		const {data: {key}} = plugin;

		console.log('plugin', plugin, defaultValue)

		let node = [<hr />];
		if (key === 'plugin_sheq_assist') {
			node.push(<SelectModuleSHEQInput name="module_list" type="select_multi" defaultValue={defaultValue} isOHSDocs className="col-lg-12"
				onChange={onChange} />);
		} else if (key === 'plugin_hr_management') {
			node.push(<SelectModuleHRInput name="module_list" type="select_multi" defaultValue={defaultValue} isOHSDocs className="col-lg-12"
				onChange={onChange} />);
		} else if (key === 'plugin_extra') {
			node.push(<SelectModuleExtraInput name="module_list" type="select_multi" defaultValue={defaultValue} isOHSDocs className="col-lg-12"
				onChange={onChange} />);
		} else if (key === 'plugin_claim_management') {
			node.push(<SelectModuleClaimsInput name="module_list" type="select_multi" defaultValue={defaultValue} isOHSDocs className="col-lg-12"
				onChange={onChange} />);
		} else {
			return null;
		}

		return <>{node}</>;
	}
}

//</editor-fold>

export default NewDialog;
