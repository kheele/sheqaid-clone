// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from '../../utils/Form';
import {Dates, execWhen, isWeb} from '../../utils/Utils';
import {Button, SelectClientInput, SelectProjectInput, SelectSiteInput} from '../../components/inputs';
import {SelectTable} from '../../components/tables';
import {ANewDialog} from '../../components/dialogs';

import ExportFilteredData from './ExportFilteredData';
// </editor-fold>
import style from "./AExportDialog.lazy.css";
import {toJS} from "mobx";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class AExportDialog extends ANewDialog {
	pageKey = "AExportDialog";

	constructor(props) {
		super(props, style);
	}

	get title() {
		return `Export ${this.titlePlural}`;
	}

	get topButtons() {
		return <React.Fragment>
			<Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
			{!this.excludeExcel &&
				<Button action="excel" className="btn btn-primary save" text="Export (Excel)" onClick={this.onSubmit}/>}
			{!this.excludePDF &&
				<Button action="pdf" className="btn btn-primary save" text="Print (PDF)" rendered={false}
				        onClick={this.onSubmit}/>}
		</React.Fragment>;
	}

}

// </editor-fold>

@observer
class AControls extends React.Component {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path;
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		const {path} = props;
		path && (this.path = path);

		this.reset = this.reset.bind(this);

		this.onGetRef = this.onGetRef.bind(this);

		this.onPrepareSearchOrgs = this.onPrepareSearchOrgs.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.onLoadListImpl = this.onLoadListImpl.bind(this);
		this.onLoadList && (this.onLoadList = this.onLoadList.bind(this));
		this.onSelectAll = this.onSelectAll.bind(this);
		this.onUnSelectAll = this.onUnSelectAll.bind(this);

		this.renderTHeadFrom && (this.renderTHeadFrom = this.renderTHeadFrom.bind(this));
		this.renderItemFrom && (this.renderItemFrom = this.renderItemFrom.bind(this));

		this.form = new Form();

		(async () => {
			const fieldNames = (await Promise.all(Object.keys(this.filterData).filter(key => key !== 'onGetRef').map(async key => {
				const ref = await execWhen(() => this.onGetRef(key));
				return {key, ref};
			}))).map(({key, ref}) => {
				return ref.props.name;
			});
			this.form.addChangeMany(fieldNames, this.onChangeFields.bind(this));
		})();
	}

	// </editor-fold>

	onChangeFields(el, name, val) {
		const {_reactInternals: {ref}, parentWrapper} = el;

		const refName = parentWrapper ? parentWrapper.refName : ref._stringRef;

		if (Form.hasVal(val)) {
			console.log('onChangeFields1', refName, val)
			val = this.form.getFormData(refName, val);
			console.log('onChangeFields2', refName, val)
			if (val) {
				val = Object.values(val).pop();
				this.filterData[refName] = val;
			}
		} else {
			this.filterData[refName] = null;
		}
		console.log('onChangeFields', refName, val)
	}

	// <editor-fold defaultstate="collapsed" desc="reset">
	reset() {
		// Object.keys(this.filterData).
		// filter(key => Form.hasVal(this.filterData[key])).
		// forEach(key => {
		//     this.filterData[key] = null;
		//     const ref = this.onGetRef(key);
		//     if(ref) {
		//         ref.reset && ref.reset();
		//     }
		// });
	}

	// </editor-fold>

	onGetRef(ref) {
		return this.refs[ref];
	}

	onLoadListImpl(isNew) {
		const {onLoadList} = this;

		const data = {};
		Object.keys(this.filterData).filter(key => Form.hasVal(this.filterData[key])).forEach(key => {
			data[key] = this.filterData[key];
		});

		console.log('filterData', data)
		return onLoadList({isNew, filterData: data});
	}

	onPrepareSearchOrgs() {
		const {isConsultant, hasProjects, isContractor} = storage.is;

		const {form} = this;
		if (isConsultant) {
			if (!form.isValid('client_from')) {
				infoDialog.open('Company is required');
				return;
			}

			const {
				client_from
			} = form.data;
			this.filterData.client_id = client_from.id;
		}

		if (!isContractor && hasProjects) {
			const {
				project_from, site_from
			} = form.data;

			if (project_from && project_from !== 'All') {
				this.filterData.project_id = project_from.id;
			} else if (project_from === 'All') {
				this.filterData.project_id = null;
			}
			if (site_from && site_from !== 'All') {
				this.filterData.site_id = site_from.id;
			} else if (site_from === 'All') {
				this.filterData.site_id = null;
			}
		}

		return true;
	}

	// <editor-fold defaultstate="collapsed" desc="onSearch">
	onSearch() {
		if (!this.onPrepareSearchOrgs()) {
			return;
		}

		const {searchList} = this.state;
		this.refs.selectTable.setSelectedList(searchList).open().then(list => {
			this.state.searchList.clear();
			this.state.searchList.push(...list);
			this.reset();
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {props: {dialog: {titleSingular}}, form, state: {searchList}} = this;

		if (searchList.isEmpty()) {
			infoDialog.open(`Please select at least one ${titleSingular}`);
			return;
		}

		const {action} = btn.props;
		if (action === 'pdf') {
			return this.onSubmitPrint(e, btn, onSaved);
		} else {
			return this.onSubmitExport(e, btn, onSaved);
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmitPrint">
	onSubmitPrint(e, btn, onSaved) {
		const {
			refs: {exportFilteredData: {values}},
			state: {searchList: list},
			filterData
		} = this;
		const item = {list, values};
		this.refs.pdfReader.open(item);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmitExport">
	onSubmitExport(e, btn, onSaved) {
		const {props: {dialog: {titlePlural}}, form, state: {searchList}} = this;
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {
			client_from, project_from, site_from,
			department, job_position,
			supervisor
		} = form.data;

		const client = client_from || selectedClient;
		const project = project_from || selectedProject;
		const site = site_from || selectedSite;

		btn.text("Exporting...").disabled();
		neonBinding.events.emit(this.path + "export-excel", {
			client,
			project,
			site,
			department,
			job_position,
			supervisor,
			list: toJS(searchList.map(v => toJS(v))),
		}).then(res => {
			if (!res) {
				infoDialog.open(<>
					<p>An error occurred. Please try again</p>
				</>);
			} else {
				if (isWeb()) {
					infoDialog.open(<>
						<p>{titlePlural} successfully exported.</p>
						<p><small>The file will be automatically downloaded</small></p>
					</>);
					saveFileAs(res, `${titlePlural.replaceAll(' ', '-')}_${Dates.formatDate(new Date())}.xlsx`);
				} else {
					infoDialog.open(<>
						<p>{titlePlural} successfully exported.</p>
						<p>Saved in the following folder:</p>
						<p><small>{res.path}</small></p>
						<p><small>The file will open after 3 seconds</small></p>
					</>);
				}
			}
		}).catch(err => {
			infoDialog.open(<>
				<p>An error occurred. Please check your network connection and try again</p>
			</>);
		}).finally(() => {
			btn.text("Export").enabled();
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSelectAll">
	onSelectAll(e, btn) {

	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onUnSelectAll">
	onUnSelectAll(e, btn) {

	}

	// </editor-fold>

	get title() {
		return "Export";
	}

	get titleSelected() {
		return "Export";
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {isConsultant, hasProjects, isContractor} = storage.is;
		const {props: {dialog: {titlePlural}}, title, titleSelected, renderBeforeResults} = this;
		return (<div className="controls-wrapper h-full">
			<div className="controls h-full">
				<div className="row col-lg-3 h-full padding-0 grid-1 align-content-top">
					<label className="heading text-center h-45">
						<h4 className="font-size-15">Find {titlePlural} To {title}:</h4>
					</label>
					<div
						className="row sec-group padding-t-10 padding-b-15 padding-l-10 grid-1 grid-gap-10 overflow-y-auto w-full h-full">
						{!isContractor && hasProjects && <React.Fragment>
							{isConsultant && <SelectClientInput ref="client_id" name="client_from" group="orgs1"
							                                    placeholder="Company..." required
							                                    className="col-lg-12 margin-0 form-control"
							                                    onChange={this.form.onChange}/>}
							<SelectProjectInput ref="project_id" name="project_from" group="orgs1"
							                    placeholder="Project..." showAll required
							                    className="col-lg-12 margin-0 form-control"
							                    onChange={this.form.onChange}/>
							<SelectSiteInput ref="site_id" name="site_from" group="orgs1" placeholder="Site..." showAll
							                 required className="col-lg-12 margin-0 form-control"
							                 onChange={this.form.onChange}/>
							<hr className="pull-left no-border bg-ddd h-2"/>
						</React.Fragment>}
						{this.renderFields}
					</div>
					<hr className="pull-left no-border bg-ddd h-2"/>
					<Button className="btn btn-primary hor-center h-40 margin-b-10" onClick={this.onSearch}>
						Find {titlePlural}
					</Button>
					<SelectTable
						ref="selectTable"
						isDialog
						replaceCols
						name="selectTable"
						desc={titlePlural}
						title={`Select ${titlePlural}`}
						className="col-lg-12 no-padding SelectAExportTable"
						renderTHead={this.renderTHeadFrom}
						renderItem={this.renderItemFrom}
						onLoadList={this.onLoadListImpl}
						onUnSelectAll={this.onUnSelectAll}
						onSelectAll={this.onSelectAll}
						isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}
					>
						<ExportFilteredData filterData={this.filterData} onGetRef={this.onGetRef}/>
					</SelectTable>
				</div>
				<div className="row col-lg-9 h-full pull-right padding-0">
					{renderBeforeResults}
					<label className="heading text-center"><h4>{titlePlural} To {titleSelected}:</h4></label>
					<SelectTable
						ref="selectedTable"
						replaceCols
						name="selectedTable"
						desc={titlePlural}
						title={`Selected ${titlePlural}`}
						className={"col-lg-12 no-padding SelectedAExportTable Table-" + (title.replaceAll(' ', ''))}
						renderTHead={this.renderTHeadFrom}
						renderItem={this.renderItemFrom}
						list={this.state.searchList}
						isChecked={(item, selectedList) => true}
					>
						<ExportFilteredData
							ref="exportFilteredData"
							filterData={this.filterData}
							onGetRef={this.onGetRef}
						/>
					</SelectTable>
				</div>
			</div>
		</div>);
	}

	// </editor-fold>
}

export {AExportDialog, AControls};