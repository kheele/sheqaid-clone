// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from "mobx";

import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewPPEItemListTable} from 'components/FormTableComponents';

import style from "./ProfileTeamDialog.lazy.css";
import {CircularProgress} from "@mui/material";
import findByIdTeam from "mutations/all/Team/findByIdTeam";
import EmployeesDialog from "../EmployeesDialog";
import updateTeam from "mutations/all/Team/updateTeam";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "ProfileTeamDialog";
	findById = findByIdTeam;
	removeById = updateTeam;
	softDeleteAttrs = {status: "Inactive"};
	
	constructor(props) {
		super(props, style);
	}
	
	title() {
		return "Team";
	}
	
	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onClick = this.onClick.bind(this);
	}
	
	// </editor-fold>
	
	onClick(evt, btn) {
		const {id, data: {name}} = this.item;
		this.refs.employeesDialog.open({
			title: `${name} Team Employees`,
			params: {
				filterData: {
					team_id: id,
					isNew: true,
				},
			},
		});
	}
	
	@computed get item() {
		return this.props.state.item;
	}
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}
		
		const {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {renderProfileCover}
			},
			item: {
				id, data: {
					created_at,
					site, project, client,
					supervisor,
					name, status,
					//
					list,
					//
					ppe_type_list
				}
			}
		} = this;
		
		return <>
			<FormControls>
				<RowOrgs
					readonly
					client={client}
					project={project}
					site={site}
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<Row
						rendered
						idx={1}
						title="1. Team Details"
					>
						<ProfileField title="Supervisor" value={supervisor}
						              renderer={v => (v.lname || v.data.lname) + " " + (v.fname || v.data.fname)}
						              className="col-lg-12"/>
						<ProfileField title="Team Name" value={name} className="col-lg-12"/>
						<ProfileField title="Status" value={status} className="col-lg-12"/>
					</Row>
				</RowOrgs>
				<Row
					rendered
					idx={2}
					title="2. PPE Required"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
				>
					<NewPPEItemListTable name="ppe_type_list" defaultValue={[...(ppe_type_list || [])]} readonly/>
				</Row>
				<Row
					activeAlways
					rendered
					idx={3}
					title="Actions"
				>
					<Button className="btn btn-primary hor-center margin-v-20" onClick={this.onClick}>View
						Employees</Button>
				</Row>
			</FormControls>
			<EmployeesDialog ref="employeesDialog"/>
		</>;
	}
	
	// </editor-fold>
	
}

export default ProfileDialog;
