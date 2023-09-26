import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileJobPositionDialog.lazy.css";
import EmployeesDialog from "../EmployeesDialog";
import {CircularProgress} from "@mui/material";
import findByIdJobPosition from "mutations/all/JobPosition/findByIdJobPosition";

@observer
class ProfileJobPositionDialog extends AProfileDialog {
	pageKey = "ProfileJobPositionDialog";
	findById = findByIdJobPosition;

	constructor(props) {
		super(props, style);
	}

	title() {
		return "Job Position";
	}

	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {

	@observable
	state = {
		item: null,
	};

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(evt, btn) {
		const {id, data: {name}} = this.item;
		this.refs.employeesDialog.open({
			title: `${name} Job Position Employees`,
			params: {
				filterData: {
					job_position_id: id,
					isNew: true,
				},
			},
		});
	}

	@computed get item() {
		return this.state.item;
	}

	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		const {
			props: {dialog: {renderProfileCover}},
			item: {
				id, data: {
					created_at,
					client,
					name, desc, job_category, doc
				}
			}
		} = this;

		return <>
			<FormControls>
				<Row
					activeAlways
					rendered
					idx={0}
					title="Company"
				>
					<ProfileField title="Company" value={client} renderer={v => v.name || v.data.name}
					              className="col-lg-12"/>
				</Row>
				<Row
					activeAlways
					rendered
					idx={1}
					title="Job Position Details"
				>
					<ProfileField title="Job Position" name="name" value={name} className="col-lg-12"/>
					<ProfileField title="Job Category" name="job_category" value={job_category} renderer={v => v.name}
					              className="col-lg-12"/>
					<ProfileField title="Job Description" name="desc" value={desc} type="textarea" className="col-lg-12"/>
					<UploadButton
						name="doc"
						defaultValue={doc}
						buttonTitle="Job Description Document"
						type={['PDF', 'Word', 'Image']}
						showOnlyIcon
						readonly
						className="ProfileField pull-left-3 col-lg-6"
					/>
				</Row>
				<Row
					activeAlways
					rendered
					idx={2}
					title="Actions"
				>
					<Button className="btn btn-primary hor-center margin-v-20" onClick={this.onClick}>View
						Employees</Button>
				</Row>
			</FormControls>
			<EmployeesDialog ref="employeesDialog"/>
		</>;
	}

}

export default ProfileJobPositionDialog;
