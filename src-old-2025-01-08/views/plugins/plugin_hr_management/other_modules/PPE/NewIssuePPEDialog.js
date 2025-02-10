// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';

import {AEditDialog} from 'components/dialogs';
import {
	Button,
} from 'components/inputs';
import {NewIssuePPEListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewIssuePPEDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends AEditDialog {
	pageKey = "NewIssuePPEDialog";
	title = "Issue PPE";
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();
		
		this.form = new Form();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		if (!form.isValid('name')) {
			infoDialog.open('Item Description is required');
			return;
		}
		if (!form.isValid('unit')) {
			infoDialog.open('Item Unit is required');
			return;
		}
		if (form.isValid('duration_type') && !form.isValid('duration_value')) {
			infoDialog.open('Duration Value is required');
			return;
		}
		
		const {
			site, project, client,
			//
			name, unit, duration_type, duration_value, notes, profile_pic,
			//
			team_list
		} = form.data;
		const data = {
			client: {id: client.id, name: client.data.name},
			project: {id: project.id, name: project.data.name},
			site: {id: site.id, name: site.data.name},
			name, unit, notes
		};
		
		if (duration_type) {
			data.duration_type = duration_type;
		}
		if (isNumber(duration_value)) {
			data.duration_value = duration_value;
		}
		
		if (profile_pic) {
			data.profile_pic = profile_pic.path;
		}
		
		if (team_list) {
			data.team_list = team_list.map(v => {
				if (v.team) {
					return v.team.id;
				} else {
					return v.id;
				}
			});
		}
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		neonBinding.events.emit(this.path + "create", data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
		});
	}
	
	// </editor-fold>
	
	@computed get item() {
		return this.props.state.item;
	}
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress/>;
		}
		
		const {
			item, item: {
				id,
				data: {
					full_name,
					job_position,
					department,
					team,
					ppe_type_list,
					ppe_item_list,
				},
			},
		} = this;
		
		console.log(item);
		
		const {onFormNext, onFormBack, onFormOpen} = this.props;
		return (<FormControls>
			<Row
				activeAlways
				rendered
				idx={0}
				title="Employee Details"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
			
			</Row>
			<Row
				rendered
				idx={1}
				title="1. PPE Issue"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<NewIssuePPEListTable name="ppe_type_list" defaultValue={ppe_type_list} onChange={this.form.onChange}/>
			</Row>
		</FormControls>);
	}
	
	// </editor-fold>
}

export default NewDialog;
