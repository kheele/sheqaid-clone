// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import { observer } from 'mobx-react';
import { computed, extendObservable, observable } from 'mobx';
import Chip from "@material-ui/core/Chip";
import Grid from "@mui/material/Grid";

import { Dates } from 'utils/Utils';
import { Button, ProfileField, UploadButton, SelectClientInput, SelectProjectInput, SelectSiteInput } from 'components/inputs';
import { SelectTable, THead, TRow } from 'components/tables';
import { ANewListTable } from 'components/FormTableComponents';

import {
	IncidentInvestigationStatus,
	IncidentTableRow
} from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentComponentRows';

import NCRAuditFindingItemTable from 'views/plugins/plugin_sheq_assist/21_Internal_Audit/AuditTab/forms/AuditFindingItemTable';
import NCRInspectionQuestionItemTable from 'views/plugins/plugin_sheq_assist/Inspections/InspectionTab/NCRInspectionQuestionItemTable';
import NCRIncidentCauseItemTable from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/IncidentsTab/NCRIncidentCauseItemTable';

import { SelectedSourceItemAuditFinding, SelectedSourceItemInspectionQuestion, SelectedSourceItemIncidentCause } from "./NCRSelectedSourceItemComponents";
import { SelectedSource } from "./NCRSelectedSourceComponents";

import docStyle from "./NewNCRDocumentTable.lazy.css";
// </editor-fold>

//<editor-fold desc="SourceBtnWrapper">
@observer
class SourceBtnWrapper extends React.Component {
	@observable
	state = {
		source: null,
		selected_source: null,
	};

	@computed
	get source() {
		return this.state.source;
	}

	set source(val) {
		this.state.source = val;
	}

	@computed
	get selected_source() {
		return this.state.selected_source;
	}

	set selected_source(val) {
		this.state.selected_source = val;
	}

	render() {
		const { onClick, onSelectSite } = this.props;
		const { source, selected_source: selected_site } = this;
		if (!source) return null;
		if (source.label === 'Site Audit') {
			let { project, client, data: _data } = selected_site || {};
			client = client || (_data && _data.client);
			project = project || (_data && _data.project);
			return <React.Fragment>
				<SelectClientInput name="client" placeholder="Company..." defaultValue={client} group="NCRSiteAudit"
					className="col-lg-12 form-control margin-b-10" />
				<SelectProjectInput name="project" placeholder="Project..." defaultValue={project} group="NCRSiteAudit"
					className="col-lg-12 form-control margin-b-10" />
				<SelectSiteInput name="site" placeholder="Site..." defaultValue={selected_site} group="NCRSiteAudit"
					className="col-lg-12 form-control margin-b-10" onChange={onSelectSite} returnValue />
			</React.Fragment>;
		}
		return <Button key={new Date().getTime()} text={"Select " + source.label + "..."}
			className='btn btn-primary block min-w-300 hor-center margin-b-5 border-radius-20'
			onClick={onClick} />;
	}
}
//</editor-fold>

//<editor-fold desc="SelectSourceTable">
@observer
class SelectSourceTable extends React.Component {
	@observable
	state = {
		source: null,
		selected_source: null,
	};

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.renderTHeadSource = this.renderTHeadSource.bind(this);
		this.renderTHeadSourceItem = this.renderTHeadSourceItem.bind(this);
		this.renderItemSource = this.renderItemSource.bind(this);
		this.onLoadList = this.onLoadList.bind(this);
	}

	// </editor-fold>

	open() {
		this.refs.selectSourceTable.open();
	}

	close() {
		const { selectSourceTable } = this.refs;
		selectSourceTable && selectSourceTable.close();
	}

	setOnCancel(fn) {

	}

	clearSelection() {
		this.refs.selectSourceTable.clearSelection();
	}

	// <editor-fold defaultstate="collapsed" desc="renderTHeadSource">
	renderTHeadSource() {
		switch (this.source.label) {
			case "Site Audit":
				return <THead>
					<div className="td">Company</div>
					<div className="td">Project</div>
					<div className="td">Site</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
			case "Compliance Audit":
				return <THead>
					<div className="td fixed-flex min-w-50">ID</div>
					<div className="td fixed-flex min-w-100">Audit Date</div>
					<div className="td">Audit Type</div>
					<div className="td">Auditor</div>
					<div className="td">Scope Of Audit</div>
					<div className="td">Company</div>
					<div className="td fixed-flex min-w-195">Company Representative</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
			case "Inspection":
				return <THead>
					<div className="td fixed-flex min-w-50">ID</div>
					<div className="td">Name</div>
					<div className="td">Asset</div>
					<div className="td">Responsible Person</div>
					<div className="td fixed-flex min-w-80">Interval</div>
					<div className="td fixed-flex min-w-140">Date Scheduled</div>
					<div className="td fixed-flex min-w-140">Conducted On</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
			case "Incident Investigation":
				return <THead>
					<div className="td fixed-flex min-w-50">ID</div>
					<div className="td fixed-flex min-w-120">Incident Date</div>
					<div className="td fixed-flex min-w-140">Incident Group</div>
					<div className="td">Category</div>
					<div className="td">Description</div>
					<div className="td">Location</div>
					<div className="td fixed-flex min-w-120">Status</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
		}
	}

	renderTHeadSourceItem() {
		switch (this.source.label) {
			case "Site Audit":
				return <THead>
					<div className="td">Company</div>
					<div className="td">Project</div>
					<div className="td">Site</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
			case "Compliance Audit":
				return <THead>
					<div className="td fixed-flex min-w-50">ID</div>
					<div className="td fixed-flex min-w-100">Audit Date</div>
					<div className="td">Audit Type</div>
					<div className="td">Auditor(s)</div>
					<div className="td">Scope Of Audit</div>
					<div className="td">Company</div>
					<div className="td fixed-flex min-w-195">Company Representative(s)</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
			case "Inspection":
				return <THead>
					<div className="td fixed-flex min-w-50">ID</div>
					<div className="td">Name</div>
					<div className="td">Asset</div>
					<div className="td">Responsible Person</div>
					<div className="td fixed-flex min-w-80">Interval</div>
					<div className="td fixed-flex min-w-140">Date Scheduled</div>
					<div className="td fixed-flex min-w-140">Conducted On</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
			case "Incident Investigation":
				return <THead>
					<div className="td fixed-flex min-w-50">ID</div>
					<div className="td fixed-flex min-w-120">Incident Date</div>
					<div className="td fixed-flex min-w-140">Incident Group</div>
					<div className="td">Category</div>
					<div className="td">Description</div>
					<div className="td">Location</div>
					<div className="td fixed-flex min-w-120">Status</div>
					<div className="td fixed-flex no-padding min-w-70"></div>
				</THead>;
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemSource">
	renderItemSource(item, n) {
		switch (this.source.label) {
			case "Site Audit":
				return null;
			case "Compliance Audit": {
				const {
					id,
					data: { created_at, client, scope, date, type, representative_list, auditor_list, definition_list, list }
				} = item;
				return <>
					<div className="td fixed-flex min-w-50">{id}</div>
					<div className="td fixed-flex min-w-100">{Dates.formatDate(date)}</div>
					<div className="td">{type || 'N/A'}</div>
					<div className="td">{
						auditor_list ? auditor_list.map(({ other_person, employee }) => (employee || other_person).full_name) : 'N/A'
					}</div>
					<div className="td">{scope || 'N/A'}</div>
					<div className="td">{(client && client.name) || 'N/A'}</div>
					<div className="td fixed-flex padding-l-10 min-w-195">{
						representative_list ? representative_list.map((
							{
								other_person,
								employee
							}
						) => (employee || other_person).full_name) : 'N/A'
					}</div>
				</>;
			}
			case "Inspection": {
				const {
					id, data: {
						created_at,
						name,
						desc,
						status,
						status_answered_by_sender,
						is_template,
						type,
						visibility,
						scheduled,
						page_title_list,
						question_list,
						progress,
						total_questions,
						//
						interval,
						start_date,
						date_completed,
						time_completed,
						schedule_date,
						next_schedule_date,
						responsible_person,
						responsible_department,
						asset_type,
						asset,
						schedule_list = [],
						//
						template
					}
				} = item;

				return <>
					<div className="td fixed-flex min-w-50">{id}</div>
					<div className="td">{name}</div>
					<div
						className="td">{asset ? `${asset.asset_detail.name} (${asset.asset_detail.reg_num || asset.asset_detail.serial_num})` : 'N/A'}</div>
					<div className="td">{responsible_person && responsible_person.full_name || 'N/A'}</div>
					<div className="td fixed-flex min-w-80">{interval}</div>
					<div className="td fixed-flex min-w-140">{Dates.formatDateTime(schedule_date)}</div>
					<div
						className="td fixed-flex padding-l-10 min-w-140">{Dates.formatDate(date_completed)} {time_completed}</div>
				</>;
			}
			case "Incident Investigation": {
				let {
					id, data: {
						created_at,
						client, project, site,
						investigation,
						//
						group,
						incident_date,
						short_desc,
						location,
						exact_location,
						//
						category_list,
						sub_category_list,
						sector_list,
						activity_list,
						//
					}
				} = item;

				const {
					//1

					//2
					investigation_team_list,//
					due_date,//
					//3
					investigation_details,//
					investigation_findings_list,//
					investigation_findings_further_desc,//
					document_list,//
					//4
					severity,//{consequence, likelihood}
					//5
					cause_analysis,//
					//7
					distribution_list,//
					//8
					weather_condition_list,//
					//9
					protective_equipment_worn_list,//
					//10
					class_list,//
					//11
					environment_list,//
					//12
					estimated_costs_damages,//
					estimated_costs_medical,//
					estimated_costs_salaries_wages,//
					estimated_costs_investigations,//
					estimated_costs_others,//
				} = investigation || {};

				return <>
					<ProfileField name="group" title="Incident Group" value={group}
						className="col-lg-12" />
					<ProfileField name="short_desc" title="Short Description" value={short_desc}
						className="col-lg-12" />
					<ProfileField name="desc" title="Incident Description" value={desc}
						className="col-lg-12" />

					<ProfileField name="location" title="Area" value={location}
						className="col-lg-12" />
					<ProfileField name="exact_location" title="Exact Location" value={exact_location}
						className="col-lg-12" />

					<hr />

					<ProfileField name="incident_date" type="date" title="Date Incident Occurred"
						value={incident_date} className="col-lg-6" />
					<ProfileField name="incident_time" title="Time Incident Occurred"
						value={incident_time} className="col-lg-6" />

					<ProfileField name="date_reported" type="date" title="Date Reported"
						value={date_reported} className="col-lg-6" />
					<ProfileField name="time_reported" title="Time Reported"
						value={time_reported}
						className="col-lg-6" />

					<ProfileField name="time_shift" title="Time Shift"
						value={time_shift}
						className="col-lg-12" />

					<hr />

					<ProfileField name="category_list" title="Category"
						value={(category_list || []).map(v => v.category.name).join(', ')}
						className="col-lg-12" />
					<ProfileField name="sub_category_list" title="Category"
						value={(sub_category_list || []).map(v => v.sub_category.name).join(', ')}
						className="col-lg-12" />

					{/* <div className="td fixed-flex min-w-50">{id}</div> */}
					{/* <div className="td fixed-flex min-w-120">{Dates.formatDate(incident_date) || 'N/A'}</div>
					<div className="td fixed-flex min-w-140">{group || 'N/A'}</div> */}
					{/* <div className="td">
						{category_list ? <Grid container spacing={1} columns={4}>{
							category_list.map(({ category: { name } }) => <Grid item><Chip label={name} size="small" /></Grid>)}
						</Grid> : 'N/A'}
					</div> */}
					{/* <div className="td">{short_desc || 'N/A'}</div> */}
					{/* <div className="td">{exact_location || 'N/A'}</div> */}
					{/* <IncidentInvestigationStatus key={new Date().getTime()} item={item} /> */}
				</>;
			}
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onLoadList">
	onLoadList(isNew) {
		const { value: listByLogged } = this.source;
		return listByLogged({ isNew });
	}

	// </editor-fold>

	@computed
	get source() {
		return this.state.source;
	}

	set source(val) {
		this.state.source = val;
	}

	@computed
	get selected_source() {
		return this.state.selected_source;
	}

	set selected_source(val) {
		this.state.selected_source = val;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const { onChange, onSelectSourceItem } = this.props;
		const { source, selected_source } = this;
		if (!source) return null;
		if (!source || source.label === 'Site Audit') return null;
		return <>
			{selected_source && <SelectedSource
				key={new Date().getTime()}
				source={source}
				selected_source={selected_source}
				onClick={onSelectSourceItem} />
			}
			<SelectTable ref="selectSourceTable"
				isDialog
				replaceCols
				name="selected_source"
				className="col-lg-12 margin-l-0 no-padding min-h-200 h-full SelectSourceTable"
				btnClassName="w-80 min-w-80 margin-0"
				onChange={onChange}
				renderTHead={this.renderTHeadSource}
				renderItem={this.renderItemSource}
				onLoadList={this.onLoadList}
				checkBtnTitle="Select"
				uncheckBtnTitle="Unselect"
				isSingleSelect
				isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)} />
		</>;
	}

	// </editor-fold>
}
//</editor-fold>

//<editor-fold desc="SelectSourceItemTable">
@observer
class SelectSourceItemTable extends React.Component {
	@observable
	state = {
		source: null,
		selected_source_item: null,
	};

	setOnCancel(fn) {
		return this.refs.selectSourceListTable.setOnCancel(fn);
	}

	@computed
	get source() {
		return this.state.source;
	}

	set source(val) {
		this.state.source = val;
	}

	@computed
	get selected_source_item() {
		return this.state.selected_source_item;
	}

	set selected_source_item(val) {
		this.state.selected_source_item = val;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const { onChange } = this.props;
		const { source, selected_source_item } = this;
		if (!source || source.label === 'Site Audit') return null;
		console.log('source', source)

		if (source.label === 'Compliance Audit') {
			return <>
				{selected_source_item &&
					<SelectedSourceItemAuditFinding key={new Date().getTime()} selected_source_item={selected_source_item} />}
				<NCRAuditFindingItemTable
					ref="selectSourceListTable"
					name="selected_source_item"
					title="Select Audit Finding"
					isDialog
					isSingleSelect
					isNew={false}
					onChange={onChange}
				/>
			</>;
		}
		if (source.label === 'Inspection') {
			return <>
				{selected_source_item &&
					<SelectedSourceItemInspectionQuestion key={new Date().getTime()} selected_source_item={selected_source_item} />}
				<NCRInspectionQuestionItemTable
					ref="selectSourceListTable"
					name="selected_source_item"
					title="Select Inspection Question"
					isDialog
					isSingleSelect
					isNew={false}
					onChange={onChange}
				/>
			</>;
		}
		if (source.label === 'Incident Investigation') {
			return <>
				{selected_source_item &&
					<SelectedSourceItemIncidentCause key={new Date().getTime()} selected_source_item={selected_source_item} />}
				<NCRIncidentCauseItemTable
					ref="selectSourceListTable"
					name="selected_source_item"
					title="Select Audit Finding"
					isDialog
					isSingleSelect
					isNew={false}
					onChange={onChange}
				/>
			</>;
		}
	}

	// </editor-fold>
}
//</editor-fold>

//<editor-fold desc="NewDocumentTable">
@observer
class NewDocumentTable extends ANewListTable {
	className = "NewDocumentTable";
	title = "Job Positions";
	style = docStyle;

	constructor(props) {
		super(props);
	}

	onClickComplete(e, el) {
		let { savable, targetItem, type, insertFn, deleteFn, onAttrs, onUpdated } = this.props;

		if (savable && targetItem) {
			let { action, idx, item } = el.props;

			if (action === "save" || action === "saveEdit") {
				if (!item || !item.doc) {
					this.list.removeAt(idx);
					return infoDialog.open("Please select a file");
				}

				progressDialog.open();
				insertFn({
					[targetItem.key]: targetItem.item.id,
					...onAttrs({ ...item, type }),
				}).then(savedItem => {
					if (!savedItem) {
						infoDialog.open("Sorry! Record couldn't be added.");
					} else {
						infoDialog.open("Record successfully added.");
					}

					infoDialog.close(2000);
				}).catch(err => {
					infoDialog.open("An error occurred. Please try again later.");
					infoDialog.close(2000);
					console.error(err);
				}).finally(() => {
					setTimeout(() => progressDialog.close());
				});
			} else if (action === "delete") {
				confirmDialog.open("Are you sure you want to remove the item?").then(res => {
					if (!res) return;

					if (!item.id) return;

					progressDialog.open();
					deleteFn(item.id).then(savedItem => {
						if (!savedItem) {
							infoDialog.open("Sorry! Record couldn't be removed.");
						} else {
							infoDialog.open("Record successfully removed.");
						}

						infoDialog.close(2000);
					}).catch(err => {
						infoDialog.open("An error occurred. Please try again later.");
						infoDialog.close(2000);
						console.error(err);
					}).finally(() => {
						setTimeout(() => progressDialog.close());
					});
				});
			}
			// onUpdate && onUpdate(e, el);
		}
	}

	// onPostChange(val, name, el) {
	//     if(!val) {
	//         return;
	//     }

	//     const {idx} = el.props;
	//     this.onClick(null, {
	//         props: {action: "save", idx},
	//     });
	// }

	renderItem(n, onClick) {
		const { readonly, type, renderTable } = this.props;
		const item = this.state.list[n];
		if (item) {
			const {
				type: _type,
				// title, 
				// date, 
				// expiry, 
				// desc, 
				doc,
			} = item;

			const doc_type = type || _type;

			return <TRow key={"item-" + n} className="tr-readonly w-full">
				<div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
				<div className="td fixed-flex min-w-160">{doc_type}</div>
				{/* <div className="td fixed-flex min-w-190">{title}</div> */}
				{/* <div className="td">{desc}</div> */}
				<div className="td fixed-flex min-w-200">
					<UploadButton
						ref={this.onSetRef}
						name="doc"
						buttonTitle={!readonly && "Upload Document (PDF, Word, Image)"}
						type={['PDF', 'Word', 'Image']}
						defaultValue={doc}
						showOnlyIcon
						readonly={readonly}
						className="col-lg-12"
						onChange={this.onChange}
					/>
				</div>
				{/* <div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div> */}
				{/* <div className={`td fixed-flex min-w-${readonly ? 100 : 110}`}>{Dates.formatDate(expiry)}</div> */}
				{!readonly ? <div className="td fixed-flex min-w-100 padding-l-0">
					<Button idx={n} action="edit" className="btn btn-primary margin-r-10 pull-right w-40"
						onClick={onClick}>
						<i className="fa fa-pen" />
					</Button>
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle" />
					</Button>
				</div> : null}
				{readonly ? <div className="td fixed-flex min-w-0 padding-0" /> : null}
			</TRow>;
		} else {
			// alert(this.list.length)
			return <TRow key="item-new" className="w-full grid-1 grid-gap-10 padding-t-10 padding-b-10">
				{/* <ClearableInput ref={this.onSetRef} name="type" type="select" placeholder="Document Type"
                                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}
                                values={this.selfState.lists.type} returnValue add/> */}
				{/* <ClearableInput ref={this.onSetRef} name="title" type="text" placeholder="Title"
                                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}/>
                <ClearableInput ref={this.onSetRef} name="desc" type="textarea" placeholder="Description"
                                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}/> */}
				<UploadButton
					ref={this.onSetRef}
					name="doc"
					buttonTitle="Upload Document (PDF, Word, Image)"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					className="col-lg-12 w-full"
					onChange={this.onChange}
				/>
				{/* <ClearableInput ref={this.onSetRef} name="date" type="date" placeholder="Date"
                                className="col-lg-12 w-full form-control" onChange={this.onChange}/>
                <ClearableInput ref={this.onSetRef} name="expiry" type="date" placeholder="Expiry Date"
                                className="col-lg-12 w-full form-control" onChange={this.onChange}/> */}
				<Button idx={n} action="save" className="btn btn-primary hor-center border-radius-20 w-100"
					onClick={onClick}>
					<i className="fa fa-check" /> ADD
				</Button>
			</TRow>;
		}
	}

	renderTHead() {
		const { readonly } = this.props;
		return <THead className="align-left">
			<div className="td fixed-flex min-w-30">#</div>
			<div className="td fixed-flex min-w-160 font-size-14">Document Type</div>
			{/* <div className="td fixed-flex min-w-190 font-size-14">Title</div>
            <div className="td font-size-14">Description</div> */}
			<div className="td fixed-flex min-w-200 font-size-14">Document</div>
			{/* <div className="td fixed-flex min-w-110 font-size-14">Date</div>
            <div className="td fixed-flex min-w-110 font-size-14">Expiry</div> */}
			{!readonly && <div className="td fixed-flex min-w-60 padding-0" />}
			{readonly && <div className="td fixed-flex min-w-0 padding-0" />}
		</THead>;
	}

}

//</editor-fold>

export { SourceBtnWrapper, SelectSourceTable, SelectSourceItemTable, NewDocumentTable };
