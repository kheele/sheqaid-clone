import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDepartmentDialog.lazy.css";
import EmployeesDialog from "../EmployeesDialog";
import {CircularProgress} from "@mui/material";
import findByIdDepartment from "mutations/all/Department/findByIdDepartment";

@observer
class ProfileDepartmentDialog extends AProfileDialog {
	pageKey = "ProfileDepartmentDialog";
	findById = findByIdDepartment;

	constructor(props) {
		super(props, style);
	}

	title() {
		return "Department";
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
			title: `${name} Department Employees`,
			params: {
				filterData: {
					department_id: id,
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
					created_at, name, client
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
					title="Department Details"
				>
					<ProfileField title="Department Name" name="name" value={name} className="col-lg-12"/>
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

export default ProfileDepartmentDialog;
